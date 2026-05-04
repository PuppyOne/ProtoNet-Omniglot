# 小样本字符识别系统

基于 **Tauri v2 + PyTauri** 构建的跨平台桌面应用，提供图形界面进行少样本字符识别推理。前端采用 React 19 + TypeScript，推理后端由 Python + PyTorch 提供，三者通过 PyTauri 桥接通信。

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 UI | React 19 + TypeScript + Vite 8 + TailwindCSS v4 |
| 组件库 | HeroUI v3 |
| 路由 | TanStack Router |
| 状态管理 | Jotai v2 |
| 动画 | Motion |
| 桌面宿主 | Tauri v2 |
| Python 桥接 | PyTauri 0.8 |
| 推理引擎 | PyTorch + torchvision |
| 前端包管理 | Bun |
| Python 包管理 | uv |

## 工具链

| 类别 | 工具 |
|------|------|
| 运行时 | Python 3.14、Rust（stable）、Node.js |
| 包管理器 | Bun（前端）、uv（Python） |
| 构建工具 | Vite 8、Tauri CLI、setuptools |
| 代码格式化 | Prettier（前端）、Ruff（Python） |
| 静态检查 | TypeScript、ESLint、Ruff |
| Git 钩子 | Husky + lint-staged（pre-commit 自动格式化与检查） |

## 功能页面

| 路由 | 功能 |
|------|------|
| `/` | 首页仪表盘：推理引擎状态、字库统计、当前模型、推理入口 |
| `/support` | 字库管理：查看已注册的字符及其参考样本图像 |
| `/support/$characterName` | 字符详情：查看单个字符的所有样本图像 |
| `/model` | 模型列表：以 RadioGroup 形式展示并选择模型 |
| `/model/$modelFolderName` | 模型详情：查看结构、指标、可视化图，选择或删除模型 |
| `/query` | 推理页：上传图像 → 实时推理 → 识别结果 + 置信度排行 |

## 快速开始

### 环境要求

- [Bun](https://bun.sh/) >= 1.x
- [uv](https://github.com/astral-sh/uv) >= 0.5
- [Rust](https://www.rust-lang.org/) (stable)
- Python ~3.14

### 安装依赖

```powershell
cd fewshot-char-system
bun setup
```

### 启动开发模式

```powershell
bun dev
```

## 字库配置

推理时，应用从 `./support/` 目录（相对于应用运行目录）读取字符参考样本。目录结构如下：

```
support/
├── character01/          ← 字符名称（自定义，即识别标签）
│   ├── sample1.png
│   └── sample2.png
├── character02/
│   └── sample1.png
└── ...
```

支持的图像格式：`png`、`jpg`、`jpeg`、`bmp`、`gif`。

> 字库中每个字符至少需要 **1 张**参考样本图像。样本越多，识别准确率越高。

## 模型管理

模型文件从 `./models/` 目录（相对于应用运行目录）加载。每个模型子目录须包含：

| 文件 | 说明 |
|------|------|
| `meta.json` | 模型元数据（必须） |
| `encoder.pt2` | ATen 图格式的编码器（必须） |
| `protonet-classifier.pt2` 或 `siamesenet-classifier.pt2` | 分类器（必须） |
| `loss_curve.png/svg` | 训练损失曲线（可选） |
| `accuracy_curve.png/svg` | 验证准确率曲线（可选） |
| `t-sne.png/svg` | 嵌入 t-SNE 可视化（可选） |

### meta.json 格式

```json
{
  "name": "ProtoNet",
  "architecture": "ProtoNet",
  "encoder": "CNN-4",
  "dataset": "Omniglot",
  "version": [2, 0, 0],
  "embedding_dim": 64,
  "train": {
    "timestamp": "2026-04-10T08:27:41",
    "framework": "PyTorch",
    "n_way": 5,
    "k_shot": 1,
    "q_query": 5,
    "train_batches": 512,
    "val_batches": 512,
    "early_stop_patience": 25
  },
  "metrics": {
    "test_accuracy": 0.9140234375,
    "test_loss": 0.3461,
    "n_way": 5,
    "k_shot": 1,
    "q_query": 5,
    "test_batches": 1024
  },
  "files": {
    "models": {
      "encoder": "encoder.pt2",
      "classifier": "protonet-classifier.pt2"
    },
    "images": {
      "loss_curve": "loss_curve.png",
      "loss_curve_svg": "loss_curve.svg",
      "accuracy_curve": "accuracy_curve.png",
      "accuracy_curve_svg": "accuracy_curve.svg",
      "t_sne": "t-sne.png",
      "t_sne_svg": "t-sne.svg"
    }
  }
}
```

## 推理原理

推理由 Python 后端 `InferenceManager` 负责：

1. 从 `./support/` 读取所有字符参考样本图像作为 **support set**
2. 将用户上传的图像作为 **query**
3. 通过编码器将 support 和 query 图像编码为 64 维嵌入向量
4. 分类器根据嵌入距离（ProtoNet：到原型的负平方欧氏距离；SiameseNet：到 support 样本的负欧氏距离均值）输出 logits
5. `argmax` 取预测标签，`softmax` 计算各类置信度
6. 返回识别结果和置信度排行

> 应用启动时通过异步线程预加载 PyTorch 与推理模型，避免主线程阻塞，缩短首屏渲染延迟。

## Python 后端命令

| 命令 | 说明 |
|------|------|
| `preload` | 异步加载 PyTorch 并初始化推理引擎 |
| `infer` | 执行推理，返回识别结果和置信度 |
| `get_supports` | 获取字库列表 |
| `get_models` | 扫描并返回所有可用模型 |
| `resolve_model_path` | 解析模型文件的绝对路径 |
| `add_model` | 将外部模型文件夹复制到 `./models/` |
| `move_model_to_trash` | 将模型文件夹移至系统回收站 |

## 分发构建

应用通过 Tauri 打包为标准桌面安装程序：

```powershell
bun run build
```

构建产物位于 `src-tauri/target/release/` 目录。

完成构建后，若需要无需安装的便携版：

```powershell
bun run bundle:portable
```

便携版应用位于 `portable/`

## 项目结构

```
fewshot-char-system/
├── src/                     # 前端源码（React + TypeScript）
│   ├── atoms/               # Jotai 状态原子
│   ├── client/              # Python RPC 客户端（自动生成）
│   ├── components/          # 可复用 UI 组件
│   ├── motions/             # Motion 动画变体
│   ├── routes/              # 文件式路由页面
│   ├── types/               # TypeScript 类型定义
│   └── utils/               # 工具函数
├── src-python/              # Python 推理后端
│   └── fewshot_char_system/
│       ├── infer.py         # InferenceManager 推理核心
│       ├── server.py        # PyTauri RPC 命令注册
│       └── data/            # Pydantic 数据模型
├── src-tauri/               # Rust / Tauri 层
│   ├── src/main.rs          # 应用入口（PyTauri standalone）
│   └── tauri.conf.json      # Tauri 配置
├── scripts/                 # 构建脚本
├── package.json
├── pyproject.toml
└── Cargo.toml
```
