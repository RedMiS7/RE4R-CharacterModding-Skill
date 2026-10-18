---
name: re4-model-replacement
description: "将源角色模型制作为 RE4 角色替换 Mod，处理目标资源配对、坐标比例、骨架蒙皮、材质、物理接入和导出打包；适用于新制作或指定阶段重建。"
---

# RE4 角色模型替换

将用户指定源模型制作成目标角色／服装可加载的替换资源。可从统一入口进入，也可直接调用本 Skill；已有工程从未通过的阶段续接。

## 开始

读取 [公共执行约束](../re4-mod-common/references/common-contracts.md)。本 Skill 共用相邻 `re4-mod-common` 的技术文档和工具；直接调用时不再回到统一入口分流。

确认源模型、目标角色与服装／模式、当前 build、比例与外观保留要求、当前阶段和交付范围。仅重建指定阶段时先锁定父候选及必须保留的资源，不从头制作。

## 制作阶段

| 阶段 | 本阶段工作与依据 | 读取资料 |
| --- | --- | --- |
| 输入与目标 | 锁定输入、工具、目标 consumer、资源配对和实际输出路径 | [阶段与状态](../re4-mod-common/references/pipeline.md) 的 A–C 节 |
| 几何与绑定 | 确定坐标／比例策略，按 consumer 分区，建立骨映射、父级闭包和有效权重 | [模型与骨架](../re4-mod-common/references/model-and-rig.md) 的 1–3 节 |
| 材质与纹理 | 将源外观映射到当前 Mesh/MDF/UV/shader/纹理合同，回读依赖 | [材质与纹理](../re4-mod-common/references/materials-and-textures.md) |
| 面部准备 | 分别验证静态外形、面部 consumer、绑定与可用动作 | [模型与骨架](../re4-mod-common/references/model-and-rig.md) 的 4 节 |
| 物理接入 | 根据当前目标骨架建立挂点、模拟路径、末端、框架和过滤配置，核对 Mesh/Chain 的一致性 | [阶段与状态](../re4-mod-common/references/pipeline.md) 的 D 节；出现部件缺陷时进入修复流程 |
| 实际导出 | 为各 consumer 生成资源，回读几何、UV、骨架、权重、材质与引用 | [模型与骨架](../re4-mod-common/references/model-and-rig.md) 的 5 节 |
| 打包与验收 | 完成资源放行、新包清单、独立解压、授权部署和目标场景观察 | [验证与打包](../re4-mod-common/references/validation-and-packaging.md) |

仅加载当前阶段需要的资料。各阶段的通过条件以当前源与目标合同确定；未做面部动作或运行验证时明确未验证，不把静态模型成功推定为完整角色成功。

物理接入沿用当前格式工具可验证的语义；不能用参考 Mod 的固定参数代替框架与绑定。需要针对裙子建立或修正结构时，读取 [修复 Skill](../re4-mod-repair/SKILL.md) 中对应方法，以当前构建候选为输入。

## 发现缺陷时

先完成可回读的最小候选，保存 consumer/build、候选清单与哈希、当前通过阶段、触发条件和必须保留的范围。将具体缺陷交给 [修复 Skill](../re4-mod-repair/SKILL.md)，按一次一个变量组推进。

修复需要改动上游时，只重建受影响阶段并重新验证下游。已经有效的材质、权重或物理不因另一部件失败而全部重做。

## 工具与交付

公共打包脚本为 [artifact.py](../re4-mod-common/scripts/artifact.py)；验证文档中的 `common-dir` 指 `re4-mod-common` 目录。格式导入器与转换器由当前环境提供。

分发时将本 Skill、修复 Skill、公共资源目录 `re4-mod-common` 和统一入口 `re4-character-modding` 一起复制，保持四个目录同级。交付包含源／工具锁、consumer 配对、骨映射、实际导出资源、清单、新包与哈希、分阶段结果、运行覆盖范围和下一步。具体模型与参数保留在当前项目。
