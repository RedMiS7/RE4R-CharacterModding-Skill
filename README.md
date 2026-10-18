# RE4 Character Modding Skills

**Resident Evil 4 Remake 角色模型替换 / Character model replacement**

## How To Use

[中文快速开始](#中文快速开始) · [English quick start](#english-quick-start) · [中文详细说明](#中文) · [English details](#english)

### 中文快速开始

#### 1. 准备下载和初始化环境

安装 [Node.js 22+](https://nodejs.org/en/download)（包含 npm/npx）。使用 Git 下载时，还需安装 [Git](https://git-scm.com/downloads/)。安装后打开 PowerShell，确认命令可用：

```powershell
node --version
npx --version
```

下文统一使用 `npx`。Windows 下的 `npx.cmd` 是同一个工具的命令入口；若 PowerShell 因执行策略阻止 `npx.ps1`，可将命令中的 `npx` 改写为 `npx.cmd`。

#### 2. 下载仓库并进入目录

使用 Git 下载：

```powershell
git clone https://github.com/RedMiS7/RE4R-CharacterModding-Skill.git re4-character-modding
cd re4-character-modding
```

仓库：[RedMiS7/RE4R-CharacterModding-Skill](https://github.com/RedMiS7/RE4R-CharacterModding-Skill)。上述命令将仓库下载到本地 `re4-character-modding` 目录。

也可以在 GitHub 点击 **Code → Download ZIP**，解压到本地，然后在解压后的仓库目录打开 PowerShell。当前目录应直接包含 `package.json`、`bin/` 和 `skills/`；不要停留在 ZIP 文件或它的上一级目录。

#### 3. 初始化

在上述仓库目录执行：

```powershell
npx . init
```

如果 npx 询问是否运行本地命令包，确认后继续。命令会显示“红绿灯 + 名称”的环境检查列表，并在当前目录生成 `config.json`。已有 `config.json` 或旧版 `re4-mod.config.json` 时保留原文件。初始化不会安装 Skill、工具或 Blender 插件。

#### 4. 填写路径并重新检查

打开 `config.json`，将工具、插件、游戏和管理器路径填写到对应字段；路径可使用 `C:/Tools/Blender/blender.exe` 这样的形式。完整字段与 JSON 示例见下方“生成的路径文件”。如果沿用旧配置，则修改实际使用的 `re4-mod.config.json`。

保存后，在同一目录执行：

```powershell
npx . check
```

随后按下方“安装 Skill 并确认识别”将 `skills/` 下四个目录一起复制到 Codex 的技能目录，再开始模型任务。

### English quick start

#### 1. Prepare the download and initialization environment

Install [Node.js 22+](https://nodejs.org/en/download), including npm/npx. Install [Git](https://git-scm.com/downloads/) if cloning the repository. Open PowerShell after installation and check:

```powershell
node --version
npx --version
```

The examples use `npx`. On Windows, `npx.cmd` is the command entrypoint for the same tool; if PowerShell execution policy blocks `npx.ps1`, replace `npx` with `npx.cmd`.

#### 2. Download and enter the repository

Clone with Git:

```powershell
git clone https://github.com/RedMiS7/RE4R-CharacterModding-Skill.git re4-character-modding
cd re4-character-modding
```

Repository: [RedMiS7/RE4R-CharacterModding-Skill](https://github.com/RedMiS7/RE4R-CharacterModding-Skill). The commands above clone it into the local `re4-character-modding` directory.

Alternatively, select **Code → Download ZIP** on GitHub, extract it locally, and open PowerShell in the extracted repository directory. That directory must directly contain `package.json`, `bin/` and `skills/`; do not run commands from inside the ZIP or its parent directory.

#### 3. Initialize

Run from the repository directory:

```powershell
npx . init
```

If npx asks to run the local command package, confirm to continue. The command displays a traffic-light checklist and creates `config.json` in the current directory. Existing `config.json` or legacy `re4-mod.config.json` files are preserved. Initialization does not install Skills, tools or Blender add-ons.

#### 4. Set paths and check again

Open `config.json` and fill in tool, add-on, game and manager paths. Windows paths can use forward slashes, such as `C:/Tools/Blender/blender.exe`. See “Generated path file” below for fields and a complete JSON example. If using a legacy configuration, edit the active `re4-mod.config.json` instead.

Save and run from the same directory:

```powershell
npx . check
```

Next, follow “Install and confirm Skill discovery” below to copy all four folders from `skills/` into Codex's Skill directory, then start your model task.

## 中文

### 用途

本 Skill **仅用于 RE4 Remake 的角色模型替换，以及替换过程中产生的模型问题修复**，包括骨架、权重、材质、纹理和裙子物理。它提供流程与辅助工具，不包含模型、贴图、游戏资源或第三方插件；实际导出和游戏表现需要验证。

主要面向 Windows 下的本地 Codex 工作环境。README 为中英文，技术流程文档目前以中文为主。其他系统、游戏 build 与 Blender／插件组合未在本仓库中提供完整兼容性测试矩阵，应按实际项目验证。

### 使用前准备

| 操作 | 需要什么 |
| --- | --- |
| 下载仓库 | 使用 `git clone` 时需要 Git；也可通过 GitHub 的 **Code → Download ZIP** 下载并解压 |
| 安装与读取 Skill | 能读取本地 Skill 的 Codex 环境；复制四个目录本身不需要 Node.js 或 Python |
| 运行环境检查器 | Node.js 22+；使用 `npx` 时还需要随 Node.js 提供的 npm/npx |
| 制作或修复模型 | Blender、当前源格式的导入器、适配目标资源格式的 RE 工具与游戏资源提取能力 |
| 运行公共打包工具 | Python 3.10+，仅使用标准库，无需 `pip install` |
| 游戏内验证 | 已安装的 RE4 Remake、适用的 Mod 管理器及待测候选 |

#### 工具获取与版本选择

| 工具／项目入口 | 用途与要求 |
| --- | --- |
| [Git](https://git-scm.com/downloads/) | 克隆与更新仓库；下载 ZIP 时可省略 |
| [Node.js](https://nodejs.org/en/download) | 检查器要求 22+ |
| [Python](https://www.python.org/downloads/) | 公共辅助脚本要求 3.10+ |
| [Blender](https://www.blender.org/download/) | 按所用插件的要求选择版本 |
| [RE Mesh Editor](https://github.com/NSACloud/RE-Mesh-Editor) | Mesh、MDF 与 TEX 处理；上游当前说明要求 Blender 4.3.2+ |
| [RE Chain Editor](https://github.com/NSACloud/RE-Chain-Editor) | 需要物理接入或修复时使用；同时核对与 Mesh 工具的兼容性 |
| [MMD Tools](https://github.com/MMD-Blender/blender_mmd_tools) | 源模型为 PMX/PMD 时使用；其他格式另查对应导入器 |
| [RE Asset Library](https://github.com/NSACloud/RE-Asset-Library) | 一种资源浏览与提取方案；上游当前说明要求 Blender 4.3.2+，也可使用已验证的其他提取方案 |

以上为第三方项目入口，工具不随本仓库分发。下载、安装与启用步骤以各项目说明为准，尤其注意其 ZIP 来源要求。核对日期：2026-10-18；上述三个 NSACloud RE 工具仓库已归档并声明停止维护，使用时应核对已知问题并记录实际版本。上游最低要求不等于本 Skill 已验证的完整工具组合。

### 1. 环境检查与路径配置

**`git clone` 负责下载；`npx . init` 检查环境并在当前目录生成 `config.json`，不安装 Skill、工具或插件。** npx 可能询问是否缓存并运行本地命令包。检查列表采用“红绿灯 + 名称”，例如（仅示意）：

```text
🟢 Node.js
🟢 Python 3.10+
🟢 Blender
🟡 RE Mesh
🔴 RE Chain
🟡 RE4
```

| 检查项 | 用途 |
| --- | --- |
| Node.js | 执行检查命令 |
| Python 3.10+ | 模型与打包辅助脚本 |
| Blender、RE Mesh/MDF/TEX | 模型、材质与纹理处理 |
| RE Chain | 需要物理接入或修复时 |
| MMD Tools | 源模型为 PMX/PMD 时；其他格式另查对应导入器 |
| RE Asset Library | 一种资源提取工具；使用其他提取方案时另行确认 |
| Git、tar | 下载与部分归档操作；tar 为可选项 |
| 游戏、Mod 管理器 | 提供路径后检查文件，用于后续部署验证 |

自动查找 PATH、Windows 常见 Blender 安装位置及用户 Blender 插件目录。便携版或自定义位置未找到时再补充路径：

```powershell
npx . check --blender 'C:\Tools\Blender\blender.exe' --addons 'C:\Tools\RE-Addons'
```

首次初始化便携版路径时也可执行 `npx . init --blender 'C:\Tools\Blender\blender.exe' --addons 'C:\Tools\RE-Addons'`。已有配置不会覆盖，参数可临时用于本轮检查。

可选参数：`--blender`、`--addons`（可重复）、`--game`、`--manager`、`--help`。不需要 Python 也能完成检查。未找到表示当前搜索范围未发现；插件文件存在表示已发现，不能证明在当前 Blender 中已启用或兼容。检查完成返回 0 不表示所有组件都齐全。检查不启动游戏或改变 Mod 部署。

| 参数 | 传入内容 |
| --- | --- |
| `--blender` | Blender 可执行文件的完整路径 |
| `--addons` | 包含 `re_mesh_editor`、`re_chain_editor` 或 `mmd_tools` 等插件目录的父目录，可重复指定 |
| `--game` | 包含 `re4.exe` 的游戏目录 |
| `--manager` | Mod 管理器文件的完整路径，不是其所在目录 |
| `--help` | 查看命令用法 |

如 `--addons 'C:\Tools\RE-Addons'`，检查器会查找 `C:\Tools\RE-Addons\re_mesh_editor\__init__.py` 等文件；未解压的插件 ZIP 不能作为插件目录。RE MDF/TEX 检查的是 RE Mesh Editor 内的对应模块。

灯号含义：🟢 工具可执行并成功返回版本，Python 还需满足 3.10+；🟡 仅发现插件／游戏／管理器文件、未提供检查位置，或未找到可选的 tar；🔴 当前范围未找到组件、Python 版本不符或程序调用失败。插件存在时仍显示黄灯，因为启用状态与兼容性未验证。检查器没有为 Blender 或插件执行兼容性测试，红灯也不表示该组件对所有任务都必需。

#### 生成的路径文件

`config.json` 保存当前电脑的实际路径：

**路径可以直接填写在项目根目录的 `config.json` 中，无需每次传命令行参数。** 优先读取 `config.json`；没有时兼容读取旧文件 `re4-mod.config.json`，两者不合并。已有旧配置可继续使用；首次 `init` 只在两个文件都不存在时创建 `config.json`。

| 字段 | 内容 |
| --- | --- |
| `tools` | Node.js、Python、Blender、Git、tar 的路径；`pythonArgs` 保留 Python 启动器所需参数 |
| `addonRoots` | 找到插件的父目录列表 |
| `plugins` | RE Mesh/MDF/TEX、RE Chain、MMD Tools、资源插件的实际文件路径 |
| `gameDirectory`、`modManager` | 验证存在的游戏目录与管理器路径 |

未发现项写为 `null`，目录列表可为空；可手动补充真实路径。Windows 路径可使用 `/`，避免 JSON 反斜杠转义。此文件已加入 `.gitignore`，不随发布包分发。

配置示例（将示例路径替换为本机实际路径；未知项填 `null`，无插件目录时将 `addonRoots` 设为 `[]`）：

```json
{
  "schemaVersion": 1,
  "tools": {
    "node": null,
    "python": "C:/Tools/Python/python.exe",
    "pythonArgs": [],
    "blender": "C:/Tools/Blender/blender.exe",
    "git": null,
    "tar": null
  },
  "addonRoots": ["C:/Tools/RE-Addons"],
  "plugins": {
    "reMesh": null,
    "reMdf": null,
    "reTex": null,
    "reChain": null,
    "mmdTools": null,
    "reAssetLibrary": null
  },
  "gameDirectory": "D:/Games/RE4",
  "modManager": "C:/Tools/Fluffy/Modmanager.exe"
}
```

`plugins` 中可填写对应插件文件的实际路径，或保留 `null` 让检查器从插件目录查找。修改后在项目目录运行 `npx . check` 重新检查；只保存路径不会安装或启用工具。

后续运行 `npx . check` 会读取当前目录的配置重新检查。优先级为命令行参数、已保存路径、自动查找；失效的已保存路径会报告缺失。普通检查不改写文件，重复 `init` 保留已有文件。新模型任务可让 AI 读取该文件定位工具，但仍需验证当前版本和实际导入／导出。

**配置属于当前工作目录，不会随 Skill 安装自动复制。** 在其他 Mod 项目中使用时，可以将同一电脑上的配置复制到该项目根目录，或在项目目录打开终端，用检查器的实际路径生成项目配置：

```powershell
node 'C:\Tools\re4-character-modding\bin\cli.cjs' init
```

将示例路径替换为实际仓库位置；运行前终端应已位于目标项目目录。该命令只需要 Node.js。若不复制配置，也可以在任务中明确告知 AI 配置文件的绝对路径。相对路径按当前工作目录解析，建议保存绝对路径；不要提交含本机路径的配置。

### 2. 安装 Skill 并确认识别

```text
skills/
├── re4-character-modding/     # 纯分流入口
├── re4-model-replacement/     # 模型替换流程
├── re4-mod-repair/            # 模型替换相关修复
└── re4-mod-common/            # 公共文档与工具，非独立 Skill
```

按 [Codex 官方 Skill 文档](https://learn.chatgpt.com/docs/build-skills)，用户级安装位置为 `~/.agents/skills`；Windows 下为 `%USERPROFILE%\.agents\skills`。将仓库 `skills/` 下的**四个目录一起复制**到这里，保留它们同级，已有同名内容时先核对再处理。环境检查命令不会替你执行复制。

```text
~/.agents/skills/
├── re4-character-modding/SKILL.md
├── re4-model-replacement/SKILL.md
├── re4-mod-repair/SKILL.md
└── re4-mod-common/             # 没有 SKILL.md，供其他三个目录引用
```

也可按官方文档安装到项目的 `.agents/skills/`。如果现有环境已从 `$CODEX_HOME/skills` 或 `~/.codex/skills` 加载这些技能，可沿用已生效的位置，避免在多个目录重复安装同名 Skill。不要多嵌套一层仓库目录，也不要只复制入口 Skill。

安装后在 Codex 中输入 `$` 查找技能；CLI／IDE 也可使用 `/skills`。应能找到三个可调用 Skill，`re4-mod-common` 不会作为独立 Skill 出现。未出现时核对目录与 `SKILL.md`，再尝试重启 Codex。可用下面的请求确认路由与公共文件可读：

```text
$re4-character-modding 只检查这组 Skill 是否完整：列出模型替换、修复入口和公共文档的位置，说明当前还缺哪些输入。
```

### 3. 准备首次任务

| 任务 | 建议提供的输入 |
| --- | --- |
| 新模型替换 | 源模型与贴图路径、模型格式、目标角色／服装／模式、游戏 build、游戏或已提取资源位置、需要保留的外观／比例／面部／物理效果 |
| 已有 Mod 修复 | 原包或父候选路径、实际安装的版本、缺陷截图或视频、复现动作／场景、最后正常的对照、必须保留的有效部分 |
| 项目续接 | `PROJECT_STATE.md`、最新有效报告、当前候选与父包身份、已通过阶段、本轮交付范围 |

尚未知道的项目写“待确认”，不要猜测。安装、部署、启动游戏与发布沿用当前任务授权。

模型替换请求示例（将方括号替换为实际输入）：

```text
$re4-model-replacement
源模型与贴图：[绝对路径]
目标：[角色、服装、模式]；游戏 build：[版本或待确认]
游戏／提取资源：[绝对路径]；工具配置：[config.json 的绝对路径]
保留要求：[外观、比例、面部与物理要求]
本轮交付：[离线候选／包含游戏内验证等]
先确认输入与工具，再按阶段制作和验证。
```

修复请求示例：

```text
$re4-mod-repair
父候选：[原包绝对路径及已知哈希]
目标与环境：[角色、服装、模式、游戏 build]
问题与复现：[部位、动作、场景、截图或视频路径]
必须保留：[已正常的材质、绑定或物理效果]
只针对该问题生成独立候选，说明改动、验证结果与回退方式。
```

不确定应选哪个流程时，使用 `$re4-character-modding` 描述目标即可。

### 4. 产物与验证范围

交付应说明修改与保留范围、候选与父包身份、资源清单、包路径及 SHA-256、实际验证结果、未观察条件和回退方式。详细方法见 [验证与打包](skills/re4-mod-common/references/validation-and-packaging.md)。

[artifact.py](skills/re4-mod-common/scripts/artifact.py) 提供 `inventory`、`verify`、`package`，用于清单、哈希校验与确定性 ZIP；它不解析游戏格式或自动部署。离线检查通过、游戏加载成功和目标场景实际验收应分别记录，不能相互替代。

### 5. 反馈与贡献

问题反馈请使用 [Issues](https://github.com/RedMiS7/RE4R-CharacterModding-Skill/issues)；文档更正和通用方法改进可通过 [Pull Request](https://github.com/RedMiS7/RE4R-CharacterModding-Skill/pulls) 提交。说明书中的技术步骤尚未覆盖的情况，请提供可区分原因的证据。

```text
Skill 版本／提交：
系统与 Codex 版本：
Node.js／Python／Blender／插件版本：
目标角色、服装、模式与游戏 build：
执行命令或任务描述：
预期结果／实际结果：
最小复现步骤：
相关日志、截图与候选哈希：
```

提交前去除日志中的个人路径等私有信息。贡献内容应是可移植的方法或辅助代码，示例优先使用自行生成的最小数据。

### 6. 仓库许可与发布准备

本仓库的代码与流程文档采用 [MIT License](https://github.com/RedMiS7/RE4R-CharacterModding-Skill/blob/main/LICENSE)。第三方模型、贴图、游戏资源和工具仍遵循各自许可，本仓库不授予其使用或分发权。

后续发布版本时：
- 按 `package.json` 中的版本标记发行内容；兼容性记录只填写实际验证的环境与范围。
- 从最终目录生成发布包，包含 README、`package.json`、`bin/`、四个 Skill／公共目录和许可证；核对 ZIP 内的 README 与当前源码一致。
- 排除 `config.json`、旧版 `re4-mod.config.json`、本机报告、工作产物及未获分发授权的资产；手动压缩时不要依赖 `.gitignore` 自动过滤。

### 7. 模型版权与责任声明

**本 Skill 仅提供模型替换及相关模型问题修复的技术流程。所使用模型、纹理及其他第三方资产的权利属于各自权利人，本 Skill 不授予这些资产的使用、修改或再分发权。**

**使用者须自行确认并取得所需授权，遵守原作者的许可与使用条件。因使用者选择、导入、修改、生成、使用或传播模型及其他资产而产生的侵权、权利争议及相应责任，由使用者自行承担，与 Skill 作者无关。Skill 作者不对第三方资产的权属或授权状态作出保证。**

向 GitHub 提交时仅包含本仓库的流程文档与辅助代码，不要附带未获分发授权的模型、贴图、游戏文件或他人的 Mod。

## English

### Purpose

This Skill is **limited to character model replacement in RE4 Remake and repairs to model issues arising from that replacement**, including rigs, weights, materials, textures and skirt physics. It provides workflows and utilities, not models, textures, game assets or third-party add-ons. Exports and runtime behavior require actual validation.

The primary target is a local Codex environment on Windows. This README is bilingual; technical workflow documents are mainly Chinese. This repository does not provide a complete compatibility matrix for other operating systems, game builds or Blender/add-on combinations. Validate them for each project.

### Prerequisites

| Action | Requirements |
| --- | --- |
| Download | Git for `git clone`, or GitHub **Code → Download ZIP** and extraction |
| Install and read Skills | A Codex environment with local Skill support; copying the four folders requires neither Node.js nor Python |
| Run the environment checker | Node.js 22+; npm/npx is needed for the `npx` command |
| Build or repair models | Blender, a source-format importer, RE tools matching the target formats, and game asset extraction capability |
| Run the packaging utility | Python 3.10+, standard library only; no `pip install` required |
| Validate in game | An installed RE4 Remake, an appropriate Mod manager and a candidate to test |

#### Tool sources and version selection

| Tool / project | Purpose and requirements |
| --- | --- |
| [Git](https://git-scm.com/downloads/) | Clone and update; optional when downloading a ZIP |
| [Node.js](https://nodejs.org/en/download) | Checker requires 22+ |
| [Python](https://www.python.org/downloads/) | Shared utilities require 3.10+ |
| [Blender](https://www.blender.org/download/) | Select a version supported by your add-ons |
| [RE Mesh Editor](https://github.com/NSACloud/RE-Mesh-Editor) | Mesh, MDF and TEX workflows; upstream currently specifies Blender 4.3.2+ |
| [RE Chain Editor](https://github.com/NSACloud/RE-Chain-Editor) | Physics integration and repair; also check compatibility with your Mesh tool |
| [MMD Tools](https://github.com/MMD-Blender/blender_mmd_tools) | PMX/PMD sources; other formats need their own importers |
| [RE Asset Library](https://github.com/NSACloud/RE-Asset-Library) | One browsing/extraction option; upstream currently specifies Blender 4.3.2+. Other validated extraction tools may be used |

These third-party tools are not bundled. Follow each project's download, installation and activation instructions, including its ZIP source requirements. Checked on 2026-10-18: the three linked NSACloud RE repositories are archived and announce the end of maintenance. Check known issues and record actual versions. Upstream minimum requirements do not establish a fully tested toolchain for this Skill.

### 1. Environment checks and path configuration

**`git clone` downloads the repository. `npx . init` checks the environment and creates `config.json` in the current directory. It does not install Skills, tools or add-ons.** npx may ask to cache and execute the local command package. Each checklist row contains a traffic light and a name, for example (illustrative only):

```text
🟢 Node.js
🟢 Python 3.10+
🟢 Blender
🟡 RE Mesh
🔴 RE Chain
🟡 RE4
```

The checker covers Node.js, Python 3.10+, Blender, RE Mesh/MDF/TEX, RE Chain, MMD Tools, RE Asset Library, Git and optional tar. Game and manager files are checked when paths are supplied. RE Chain is needed for physics work; MMD Tools applies to PMX/PMD sources; check other importers or extraction alternatives separately.

It searches PATH, common Windows Blender install locations and user Blender add-on directories. For portable installations or custom locations, supply paths only when needed:

```powershell
npx . check --blender 'C:\Tools\Blender\blender.exe' --addons 'C:\Tools\RE-Addons'
```

Options: `--blender`, repeatable `--addons`, `--game`, `--manager` and `--help`. The check itself does not require Python. A missing result applies only to searched locations. Add-on files being found does not prove activation in the current Blender version or compatibility. Exit code 0 means the inventory completed, not that all components are ready. The checker does not launch the game or change deployment.

For a first initialization with custom paths, use `npx . init --blender 'C:\Tools\Blender\blender.exe' --addons 'C:\Tools\RE-Addons'`. Existing configuration is preserved; command-line options can override paths for the current check.

| Option | Value |
| --- | --- |
| `--blender` | Full path to the Blender executable |
| `--addons` | Parent directory containing folders such as `re_mesh_editor`, `re_chain_editor` or `mmd_tools`; repeatable |
| `--game` | Game directory containing `re4.exe` |
| `--manager` | Full path to the Mod manager file, not its directory |
| `--help` | Command usage |

For example, `--addons 'C:\Tools\RE-Addons'` searches for files such as `C:\Tools\RE-Addons\re_mesh_editor\__init__.py`. An unextracted add-on ZIP is not an add-on directory. MDF/TEX checks look for modules inside RE Mesh Editor.

🟢 means a tool ran and returned its version; Python must also meet 3.10+. 🟡 means an add-on/game/manager file was found, a location was not supplied, or optional tar was not found. 🔴 means a component was not found, Python is unsupported, or a program invocation failed. Found add-ons remain yellow because activation and compatibility are unverified. Blender and add-on compatibility are not tested; a red item is not necessarily required for every task.

#### Generated path file

`config.json` records executable paths in `tools`, Python launcher arguments in `tools.pythonArgs`, discovered add-on parents in `addonRoots`, actual plugin files in `plugins`, and validated game/manager locations in `gameDirectory` and `modManager`.

**You can put paths directly in the project's root `config.json` instead of supplying CLI options each time.** The checker reads `config.json` first, falling back to the legacy `re4-mod.config.json` only when it is absent; files are not merged. Existing legacy configurations remain usable. `init` creates `config.json` only when neither file exists.

Unresolved paths are `null`; directory lists can be empty. Fill in actual locations manually when needed. Use `/` in Windows paths to avoid JSON backslash escaping. This machine-specific file is git-ignored and excluded from release packages.

Example (replace paths with your actual locations, use `null` for unknown paths, and `[]` for `addonRoots` if none):

```json
{
  "schemaVersion": 1,
  "tools": {
    "node": null,
    "python": "C:/Tools/Python/python.exe",
    "pythonArgs": [],
    "blender": "C:/Tools/Blender/blender.exe",
    "git": null,
    "tar": null
  },
  "addonRoots": ["C:/Tools/RE-Addons"],
  "plugins": {
    "reMesh": null,
    "reMdf": null,
    "reTex": null,
    "reChain": null,
    "mmdTools": null,
    "reAssetLibrary": null
  },
  "gameDirectory": "D:/Games/RE4",
  "modManager": "C:/Tools/Fluffy/Modmanager.exe"
}
```

Entries in `plugins` may point to actual plugin files, or remain `null` for discovery in add-on directories. Run `npx . check` from the project directory after editing. Saving paths does not install or activate tools.

Later, `npx . check` reads the current directory's configuration and rechecks it. Command-line paths take priority over saved paths, followed by automatic discovery; stale saved paths are reported as missing. Checks never rewrite the file, and repeated `init` preserves it. An AI can read this file to locate tools for a new model task; versions and actual import/export still require validation.

**Configuration belongs to the current working directory and is not copied when you install the Skills.** For another Mod project on the same computer, copy the configuration into that project's root, or open a terminal in that project and run the checker by its actual path:

```powershell
node 'C:\Tools\re4-character-modding\bin\cli.cjs' init
```

Replace the example path with your checkout location. The terminal must already be in the target project directory; this command needs only Node.js. Alternatively, tell the AI the absolute path to your existing configuration. Relative paths resolve against the current working directory, so absolute paths are recommended. Do not commit machine-specific configurations.

### 2. Install and confirm Skill discovery

- `skills/re4-character-modding`: routing only.
- `skills/re4-model-replacement`: model replacement workflow.
- `skills/re4-mod-repair`: model replacement related repairs.
- `skills/re4-mod-common`: shared references/utilities, not a callable Skill.

The [official Codex Skill documentation](https://learn.chatgpt.com/docs/build-skills) lists `~/.agents/skills` for user installation (`%USERPROFILE%\.agents\skills` on Windows). Copy **all four directories** from this repository's `skills/` into that location, as siblings. Review existing destinations before replacing anything. The checker does not copy them.

```text
~/.agents/skills/
├── re4-character-modding/SKILL.md
├── re4-model-replacement/SKILL.md
├── re4-mod-repair/SKILL.md
└── re4-mod-common/             # Shared resources, no SKILL.md
```

A project's `.agents/skills/` is another documented location. If your existing environment already loads these Skills from `$CODEX_HOME/skills` or `~/.codex/skills`, you can retain that working location. Avoid duplicate installations, an extra enclosing repository folder, or copying only the router.

In Codex, type `$` to find Skills; CLI/IDE users can also run `/skills`. Expect three callable Skills; `re4-mod-common` is shared resources only. If missing, check the folder layout and `SKILL.md` files, then try restarting Codex. Confirm routing and shared-file access with:

```text
$re4-character-modding Check this Skill set for completeness only: locate the replacement and repair entrypoints and shared references, and list missing task inputs.
```

### 3. Prepare your first task

| Task | Suggested inputs |
| --- | --- |
| New replacement | Source model and texture paths, source format, target character/outfit/mode, game build, game or extracted-resource location, and appearance/scale/face/physics requirements |
| Repair | Original package or parent candidate, deployed version, screenshots/video, reproduction actions/scenes, last working comparison, and behavior that must be preserved |
| Resume | `PROJECT_STATE.md`, latest valid reports, current candidate and parent identity, accepted stages, and this task's delivery scope |

Mark unknowns as “to confirm.” Installation, deployment, game execution and publication follow current task authorization.

Replacement request (replace brackets with your inputs):

```text
$re4-model-replacement
Source model and textures: [absolute paths]
Target: [character, outfit, mode]; game build: [version or to confirm]
Game/extracted resources: [absolute path]; tool config: [absolute path to config.json]
Preserve: [appearance, scale, face and physics requirements]
Delivery scope: [offline candidate / include in-game validation, etc.]
Confirm inputs and tools, then build and validate by stage.
```

Repair request:

```text
$re4-mod-repair
Parent candidate: [absolute package path and known hash]
Target/environment: [character, outfit, mode, game build]
Issue/reproduction: [part, action, scene, screenshot/video paths]
Preserve: [working materials, rigging or physics]
Build an independent candidate for this issue and report changes, validation and rollback.
```

Use `$re4-character-modding` with your goal if you are unsure which workflow fits.

### 4. Deliverables and validation scope

Deliveries should identify changes and preserved behavior, candidate and parent identity, file manifests, package path and SHA-256, observed results, untested conditions and rollback. See [validation and packaging](skills/re4-mod-common/references/validation-and-packaging.md).

[artifact.py](skills/re4-mod-common/scripts/artifact.py) provides `inventory`, `verify` and `package` for manifests, hash checks and deterministic ZIP creation. It does not parse game formats or deploy Mods. Record offline acceptance, successful game loading and acceptance in the requested scenes separately.

### 5. Feedback and contributions

Report problems through [Issues](https://github.com/RedMiS7/RE4R-CharacterModding-Skill/issues). Submit documentation fixes or reusable workflow improvements through [Pull Requests](https://github.com/RedMiS7/RE4R-CharacterModding-Skill/pulls). For uncovered technical cases, include evidence that helps distinguish causes.

```text
Skill version/commit:
Operating system and Codex version:
Node.js/Python/Blender/add-on versions:
Character, outfit, mode and game build:
Command or task description:
Expected/actual result:
Minimal reproduction steps:
Relevant logs, screenshots and candidate hashes:
```

Remove private information such as personal paths before posting logs. Contributions should be portable methods or helper code; prefer self-created minimal example data.

### 6. Repository license and release preparation

The code and workflow documentation in this repository are licensed under the [MIT License](https://github.com/RedMiS7/RE4R-CharacterModding-Skill/blob/main/LICENSE). Third-party models, textures, game assets and tools remain subject to their own licenses; this repository grants no rights to use or redistribute them.

For subsequent releases:
- Tag releases consistently with `package.json`; list only environments and scopes actually validated in compatibility records.
- Build the release archive from the final tree, including the README, `package.json`, `bin/`, all four Skill/shared folders and license. Confirm that the archived README matches the source.
- Exclude `config.json`, legacy `re4-mod.config.json`, local reports, working outputs and assets without redistribution permission. Manual ZIP creation does not automatically apply `.gitignore`.

### 7. Model rights and responsibility

**This Skill provides technical workflows only for model replacement and related model repairs. Rights to models, textures and other third-party assets remain with their respective rights holders. This Skill grants no permission to use, modify or redistribute those assets.**

**Users must obtain all necessary permissions and comply with the original creators' licenses and terms. Any infringement, rights dispute or related liability arising from a user's selection, import, modification, generation, use or distribution of models or other assets is the user's responsibility and is unrelated to the Skill author. The Skill author makes no warranty regarding the ownership or licensing status of third-party assets.**

When publishing to GitHub, include only these workflow documents and utility code. Do not upload models, textures, game files or other people's Mods without redistribution permission.
