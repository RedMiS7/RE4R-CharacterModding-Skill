---
name: re4-character-modding
description: "RE4 角色 Mod 的统一入口，按任务选择模型替换或已有 Mod 修复 Skill。"
---

# RE4 角色 Mod 入口

- 新模型制作或模型来源替换：读取 [模型替换 Skill](../re4-model-replacement/SKILL.md)。
- 已有 Mod 的缺陷诊断、修复或定向审计：读取 [修复 Skill](../re4-mod-repair/SKILL.md)。
- 混合任务：先进入当前阶段对应的 Skill，需要时按其中的交接规则切换。
- 已有项目续接或仅验证／打包：依据当前项目状态进入对应 Skill。

只加载选中的流程；由当前执行者继续，无需创建新聊天或启动子代理。
