#!/usr/bin/env python3
"""Inventory a payload, verify it, or create a deterministic ZIP. No deployment."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import shutil
import zipfile


SCHEMA = 're4-payload-manifest/v1'


def digest(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def relative_file(root, name):
    rel = PurePosixPath(name)
    if (not name or name != rel.as_posix() or rel == PurePosixPath('.')
            or '\\' in name or ':' in name or rel.is_absolute() or '..' in rel.parts):
        raise ValueError(f'Unsafe relative path: {name}')
    path = Path(root) / rel
    if not path.resolve().is_relative_to(Path(root).resolve()):
        raise ValueError(f'Path escapes payload root: {name}')
    return path


def records(root):
    root = Path(root).resolve()
    if not root.is_dir():
        raise ValueError('Payload root must be a directory')
    result, seen = [], set()
    for path in sorted(root.rglob('*'), key=lambda p: p.relative_to(root).as_posix()):
        if path.is_symlink():
            raise ValueError(f'Symbolic link is not supported: {path.name}')
        if not path.is_file():
            continue
        name = path.relative_to(root).as_posix()
        relative_file(root, name)
        if name.casefold() in seen:
            raise ValueError(f'Case-insensitive path collision: {name}')
        seen.add(name.casefold())
        result.append({'path': name, 'size': path.stat().st_size, 'sha256': digest(path)})
    if not result:
        raise ValueError('Empty payload')
    return result


def verify(root, manifest):
    value = json.loads(Path(manifest).read_text(encoding='utf-8-sig'))
    if value.get('schema') != SCHEMA or not value.get('files'):
        raise ValueError(f'Expected nonempty {SCHEMA}')
    seen = set()
    for row in value['files']:
        name = row['path']
        relative_file(root, name)
        if name.casefold() in seen:
            raise ValueError(f'Duplicate manifest path: {name}')
        seen.add(name.casefold())
    actual = records(root)
    if actual != value['files']:
        raise ValueError('Payload file set, size or hash differs from manifest')
    return actual


def inventory(root, output):
    root, output = Path(root).resolve(), Path(output).resolve()
    if output.is_relative_to(root):
        raise ValueError('Manifest must be outside payload root')
    rows = records(root)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('x', encoding='utf-8', newline='\n') as stream:
        json.dump({'schema': SCHEMA, 'files': rows}, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    return {'manifest': str(output), 'files': len(rows)}


def package(root, manifest, output):
    root, output = Path(root).resolve(), Path(output).resolve()
    if output.is_relative_to(root) or output == Path(manifest).resolve():
        raise ValueError('ZIP must be outside payload and distinct from manifest')
    rows = verify(root, manifest)
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, 'x', compression=zipfile.ZIP_STORED) as archive:
        for row in rows:
            path = relative_file(root, row['path'])
            info = zipfile.ZipInfo(row['path'], (1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            with path.open('rb') as stream, archive.open(info, 'w', force_zip64=True) as dest:
                shutil.copyfileobj(stream, dest, 1024 * 1024)
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() is not None or archive.namelist() != [r['path'] for r in rows]:
            raise ValueError('ZIP member verification failed; reject output')
        for row in rows:
            h = hashlib.sha256()
            count = 0
            with archive.open(row['path']) as stream:
                for block in iter(lambda: stream.read(1024 * 1024), b''):
                    count += len(block)
                    h.update(block)
            if count != row['size'] or h.hexdigest() != row['sha256']:
                raise ValueError(f'Payload changed during packaging: {row["path"]}; reject output')
    return {'package': str(output), 'size': output.stat().st_size, 'sha256': digest(output),
            'files': len(rows), 'runtime_tested': False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    p = commands.add_parser('inventory', help='Create a new exact payload manifest')
    p.add_argument('root'); p.add_argument('--output', required=True)
    p = commands.add_parser('verify', help='Compare the complete payload tree to a manifest')
    p.add_argument('root'); p.add_argument('--manifest', required=True)
    p = commands.add_parser('package', help='Verify payload and create a new deterministic ZIP')
    p.add_argument('root'); p.add_argument('--manifest', required=True); p.add_argument('--output', required=True)
    args = parser.parse_args()
    try:
        if args.command == 'inventory':
            result = inventory(args.root, args.output)
        elif args.command == 'verify':
            result = {'verified_files': len(verify(args.root, args.manifest))}
        else:
            result = package(args.root, args.manifest, args.output)
    except (OSError, ValueError, KeyError, zipfile.BadZipFile) as error:
        parser.exit(2, f'error: {error}\n')
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
