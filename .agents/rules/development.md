---
description: 專案開發與代碼規範 (Development and coding standards for Kanban app)
globs: ["**/*.{js,html,css}"]
always_on: true
---

# 專案開發規範 (Development Guidelines)

本規範依據目前看板專案（Kanban App）的原生架構與設計哲學制定，所有後續功能的迭代、重構與維護均須遵循此標準。

---

## 1. 核心開發架構與原則

- **純原生零相依 (Zero Dependencies)**：
  - 嚴格維持純 HTML5、CSS3 與原生現代 JavaScript（ES6+）。
  - 禁止引進外部框架（如 React、Vue）、工具函式庫（如 Lodash、jQuery）或額外打包工具（如 Webpack、Vite）。
  - 確保專案任何時候皆能「免安裝、開箱即用」，直接以瀏覽器雙擊開啟 `index.html` 即可正常執行。
- **無後端、本地優先 (Local-First)**：
  - 資料完全儲存於瀏覽器 `localStorage`，保護使用者隱私並提供即時讀寫反應。
  - 任何狀態變動皆須同步更新 `localStorage` 與觸發畫面渲染 (`render()`)。

---

## 2. JavaScript 編程規範 (`app.js`)

### 2.1 作用域與安全
- 核心程式碼一律包裹於立即調用函式運算式（IIFE）內，並啟用嚴格模式：
  ```javascript
  (function () {
    'use strict';
    // 模組邏輯
  })();
  ```
- 禁止污染全域 `window` 物件。

### 2.2 資料模型與正規化
- 任務物件（Task Object）標準欄位規格：
  ```javascript
  {
    id: string,          // 唯一識別碼，格式：task_{timestamp}_{random}
    text: string,        // 任務描述內容（trim 去除前後空白）
    category: string,    // 分類：'work' | 'life'
    priority: string,    // 優先度：'high' | 'medium' | 'low'
    dueDate: string|null,// 截止日：'YYYY-MM-DD' 或 null
    status: string,      // 看板狀態：'todo' | 'process' | 'done'
    createdAt: number    // 時間戳記 Date.now()
  }
  ```
- **資料防禦與向下相容**：
  在 `loadTodos()` 解析 `localStorage` 時，務必對每個欄位提供防禦預設值，確保舊格式或異常資料不會引發前端 Runtime Exception。

### 2.3 狀態管理與渲染流程
- 遵循單向資料流原則：
  1. **User Action**（點擊、表單送出、拖曳放開）
  2. **Update State**（透過不可變操作如 `map`、`filter`、`unshift` 更新 `todos` 陣列）
  3. **Persist**（呼叫 `saveTodos()` 寫入 `localStorage`）
  4. **Re-render**（呼叫 `render()` 更新三欄卡片與統計數字）

### 2.4 日期與時間計算
- 處理截止日期（`dueDate`）時，嚴格比對至當日午夜（`00:00:00`），避免因時差或當前時間微秒影響比對結果：
  ```javascript
  const due = new Date(year, month - 1, day);
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isUrgent = due.getTime() <= today.getTime();
  ```

---

## 3. CSS 與設計系統規範 (`style.css`)

### 3.1 暖色調設計系統 (Design Tokens)
- 所有色彩、圓角、陰影與動畫必須引用 `:root` 定義的 CSS 變數，禁止硬編碼（Hardcode）隨意色彩：
  - 背景基調：`--bg-primary`（燕麥奶底色）、`--bg-card`、`--bg-column`
  - 品牌強調：`--accent`（焦糖暖橘）、`--accent-hover`、`--accent-ring`
  - 分類色系：`--work-*`（陶土肉桂）、`--life-*`（鼠尾草綠）
  - 優先程度：`--priority-high-*`、`--priority-medium-*`、`--priority-low-*`
  - 警示逾期：`--danger-color`、`--danger-hover-bg`

### 3.2 卡片與標籤佈局
- 標籤群組採用 `.badge-group` 容器，配合 `display: flex; gap: 6px; flex-wrap: wrap;`。
- 新增標籤時需遵循現有的藥丸造型風格（`.radius-pill`），並包含合適的尺寸比例與微互動效果。

### 3.3 響應式與操作體驗
- 確保在手機直向（375px+）與桌機寬螢幕（1080px+）均能良好適應。
- 拖曳與快捷操作並行：桌機支援原生 HTML5 Drag & Drop，行動端提供 `.move-btn` 快速轉移狀態。

---

## 4. HTML 語意化與無障礙 (`index.html`)

- **語意結構**：維持 `<main>`、`<header>`、`<section class="kanban-board">`、`<article class="kanban-card">` 的清晰語意樹。
- **表單無障礙**：所有輸入元件必須具備對應的 `<label>` 或 `aria-label`。
- **圖示規範**：圖示一律採用內嵌式輕量 SVG（`viewBox="0 0 24 24"`），不引進字型圖標庫（如 FontAwesome）。

---

## 5. 版本控制與 Commit 規範 (Git Workflow)

- **分支原則**：主要發布分支為 `main`，直接與 GitHub Pages 同步部屬。
- **Commit 訊息格式**：採用 Conventional Commits 格式規範：
  - `feat:` 新增功能（例如：`feat: 支援卡片標籤顏色自訂`）
  - `fix:` 修復問題（例如：`fix: 修正跨日逾期判斷時差問題`）
  - `docs:` 文件更新（例如：`docs: 更新 README 操作指引`）
  - `style:` 純外觀排版、樣式調整，不影響業務邏輯
  - `refactor:` 代碼重構，無新增功能亦無修復 Bug
  - `perf:` 效能優化

> [!IMPORTANT]
> 任何功能開發或修改完畢後，必須確認無任何 JavaScript 控制台報錯，方可建立 Commit 並推送到 GitHub 遠端倉庫。