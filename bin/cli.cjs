#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const configFile = path.resolve(['config.json', 're4-mod.config.json'].find(file => fs.existsSync(file)) || 'config.json');

function parseArgs(args) {
  const result = { addons: [] };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === 'init' && i === 0) result.init = true;
    else if (arg === 'check' && i === 0) continue;
    else if (arg === '--check') continue; // Compatibility with the earlier check command.
    else if (arg === '--help' || arg === '-h') result.help = true;
    else if (['--blender', '--addons', '--game', '--manager'].includes(arg)) {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value / 缺少参数值: ${arg}`);
      if (arg === '--addons') result.addons.push(path.resolve(value));
      else result[arg.slice(2)] = path.resolve(value);
    } else throw new Error(`Unknown option / 未知选项: ${arg}`);
  }
  return result;
}

function readConfig() {
  let config;
  try { config = JSON.parse(fs.readFileSync(configFile, 'utf8').replace(/^\uFEFF/, '')); }
  catch (error) {
    if (error.code === 'ENOENT') return null;
    throw new Error(`Cannot read config / 无法读取配置 ${configFile}: ${error.message}`);
  }
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  const optionalPath = value => value === null || (typeof value === 'string' && value.trim().length > 0);
  if (!record(config) || config.schemaVersion !== 1 || !record(config.tools) || !record(config.plugins)
    || !Array.isArray(config.addonRoots) || !config.addonRoots.every(value => typeof value === 'string' && value.trim())
    || !Object.entries(config.tools).every(([key, value]) => key === 'pythonArgs'
      ? Array.isArray(value) && value.every(arg => typeof arg === 'string') : optionalPath(value))
    || !Object.values(config.plugins).every(optionalPath)
    || !optionalPath(config.gameDirectory) || !optionalPath(config.modManager)) {
    throw new Error(`Invalid config structure / 配置结构无效: ${configFile}`);
  }
  return config;
}

function isFile(file) {
  try { return fs.statSync(file).isFile(); }
  catch (error) {
    if (['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code)) return false;
    throw error;
  }
}

function directories(parent) {
  try { return fs.readdirSync(parent, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => path.join(parent, e.name)).sort().reverse(); }
  catch (error) {
    if (['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code)) return [];
    throw error;
  }
}

function executable(name) {
  for (const directory of (process.env.PATH || '').split(path.delimiter).filter(Boolean)) {
    const candidate = path.join(directory.replace(/^"|"$/g, ''), process.platform === 'win32' ? `${name}.exe` : name);
    if (isFile(candidate)) return candidate;
  }
  return null;
}

function program(name, candidates) {
  for (const [command, prefix] of candidates) {
    if (!command || !isFile(command)) continue;
    const result = spawnSync(command, [...prefix, '--version'], { encoding: 'utf8', timeout: 15000, windowsHide: true });
    if (result.status === 0) return { name, state: 'installed', detail: (result.stdout + result.stderr).trim().split(/\r?\n/)[0], location: command, args: prefix };
    return { name, state: 'error', detail: result.error?.message || `exit ${result.status}`, location: command };
  }
  return { name, state: 'missing', detail: '在当前查找范围内未找到 / Not found in searched locations' };
}

function checkEnvironment(options, config) {
  const tools = config?.tools || {};
  const rows = [{ name: 'Node.js', state: 'installed', detail: process.version, location: process.execPath }];
  const python = program('Python 3.10+', tools.python
    ? [[path.resolve(tools.python), tools.pythonArgs || []]]
    : [[executable('python'), []], [executable('py'), ['-3']], [executable('python3'), []]]);
  if (python.state === 'installed') {
    const version = python.detail.match(/Python (\d+)\.(\d+)/);
    if (!version || Number(version[1]) < 3 || (Number(version[1]) === 3 && Number(version[2]) < 10)) python.state = 'unsupported';
  }
  rows.push(python);
  options.blender ||= tools.blender && path.resolve(tools.blender);
  options.game ||= config?.gameDirectory && path.resolve(config.gameDirectory);
  options.manager ||= config?.modManager && path.resolve(config.modManager);
  const blenderCandidates = options.blender ? [options.blender] : [executable('blender')];
  if (!options.blender && process.platform === 'win32') {
    for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)']].filter(Boolean)) {
      blenderCandidates.push(...directories(path.join(base, 'Blender Foundation')).map(d => path.join(d, 'blender.exe')));
    }
  }
  const blender = program('Blender', blenderCandidates.map(p => [p, []]));
  const git = program('Git', [[tools.git ? path.resolve(tools.git) : executable('git'), []]]);
  const tar = program('tar', [[tools.tar ? path.resolve(tools.tar) : executable('tar'), []]]);
  tar.optional = true;
  rows.push(blender, git, tar);
  const roots = [...options.addons, ...(config?.addonRoots || []).map(p => path.resolve(p))];
  const configs = process.platform === 'win32'
    ? [process.env.APPDATA && path.join(process.env.APPDATA, 'Blender Foundation', 'Blender')]
    : [path.join(os.homedir(), '.config', 'blender'), path.join(os.homedir(), 'Library', 'Application Support', 'Blender')];
  for (const config of configs.filter(Boolean)) {
    for (const version of directories(config)) {
      roots.push(path.join(version, 'scripts', 'addons'), path.join(version, 'scripts', 'addons_core'));
      for (const repo of directories(path.join(version, 'extensions'))) roots.push(repo);
    }
  }
  if (blender.location) {
    for (const version of directories(path.dirname(blender.location))) {
      roots.push(path.join(version, 'scripts', 'addons'), path.join(version, 'scripts', 'addons_core'));
    }
  }
  const modules = [
    ['reMesh', 'RE Mesh', 're_mesh_editor/__init__.py'],
    ['reMdf', 'RE MDF', 're_mesh_editor/modules/mdf/file_re_mdf.py'],
    ['reTex', 'RE TEX', 're_mesh_editor/modules/tex/file_re_tex.py'],
    ['reChain', 'RE Chain', 're_chain_editor/__init__.py'],
    ['mmdTools', 'MMD Tools', 'mmd_tools/__init__.py'],
    ['reAssetLibrary', 'RE Asset Library', 're_asset_library/__init__.py']
  ];
  const plugins = {};
  const matchedRoots = new Set();
  for (const [key, name, relative] of modules) {
    const configured = !options.addons.length && config?.plugins[key];
    const location = configured ? path.resolve(configured) : roots.map(root => path.join(root, relative)).find(isFile);
    const found = location && isFile(location);
    plugins[key] = found ? location : null;
    if (found) {
      for (const root of roots) if (path.resolve(root, relative) === location) matchedRoots.add(path.resolve(root));
    }
    rows.push({ name, state: found ? 'found' : 'missing', location,
      detail: found ? '文件存在，启用状态与兼容性未验证 / Files found; activation and compatibility unchecked' : '未在插件目录中找到；可用 --addons 指定位置 / Not found; use --addons for custom locations' });
  }
  for (const [name, file] of [['RE4', options.game && path.join(options.game, 're4.exe')], ['Mod manager', options.manager]]) {
    rows.push({ name, state: !file ? 'unchecked' : isFile(file) ? 'found' : 'missing', location: file,
      detail: file ? '仅检查文件 / File presence only' : '未提供位置 / No location provided' });
  }
  const lights = { installed: '🟢', found: '🟡', missing: '🔴', unchecked: '🟡', unsupported: '🔴', error: '🔴' };
  console.log('RE4 环境检查 / Environment check\n');
  for (const row of rows) {
    const light = row.optional && row.state === 'missing' ? '🟡' : lights[row.state];
    console.log(`${light} ${row.name}`);
  }
  console.log('\n🟢 工具可运行 / Runnable  🟡 待确认或可选 / Unverified or optional  🔴 缺失或异常 / Missing or error');
  console.log(`路径配置 / Paths: ${path.basename(configFile)}`);
  const installedPath = row => row.state === 'installed' ? row.location : null;
  return {
    schemaVersion: 1,
    tools: { node: process.execPath, python: installedPath(python), pythonArgs: python.args || [],
      blender: installedPath(blender), git: installedPath(git), tar: installedPath(tar) },
    addonRoots: [...matchedRoots], plugins,
    gameDirectory: options.game && isFile(path.join(options.game, 're4.exe')) ? options.game : null,
    modManager: options.manager && isFile(options.manager) ? options.manager : null
  };
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log('re4-check [init|check] [--blender PATH] [--addons DIR] [--game DIR] [--manager PATH]\n'
      + 'check: inspect only (also the default). init: check and create config.json in the current directory.\n'
      + 'Reads config.json first; falls back to re4-mod.config.json. Existing files are preserved.\n'
      + 'check：只检查，也是默认操作。init：检查并在当前目录生成路径配置，已有文件不覆盖。');
  } else {
    const config = readConfig();
    const discovered = checkEnvironment(options, config);
    if (options.init) {
      if (config) console.log(`已保留现有配置 / Existing config preserved: ${configFile}`);
      else {
        fs.writeFileSync(configFile, JSON.stringify(discovered, null, 2) + '\n', { flag: 'wx' });
        console.log(`已生成路径配置；未发现项为 null / Config created; unresolved paths are null: ${configFile}`);
      }
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
