# 待辦看板 · Minimalist Kanban

> 溫潤暖色系極簡個人任務看板，專為工作與生活平衡打造。免安裝、無外部相依庫，支援拖曳跨欄、優先級排序、截止日期提醒與本地儲存。

[🚀 線上即刻體驗](https://wangtsgood-cloud.github.io/kanban-app/) · [📁 GitHub 專案倉庫](https://github.com/wangtsgood-cloud/kanban-app)

---

## 專案亮點與特色

- 📌 **三欄式看板工作流**：清晰劃分 `To-do`（待辦）、`Process`（進行中）與 `Done`（已完成）三種狀態。
- 🎯 **HTML5 原生拖放 (Drag & Drop)**：滑鼠直接拖曳卡片跨欄，亦提供行動端與鍵盤友善的「快捷切換按鈕」。
- 📅 **可選截止日期與逾期提醒**：新增任務時可選填截止日；卡片即時顯示 `年/月/日` 標籤，若為「今天或已過期」自動切換紅色警示樣式。
- 🏷️ **分類與優先度管理**：
  - **分類**：工作（Work）與生活（Life）兩種情境，支援頂部頁籤快速切換篩選。
  - **優先度**：`High`、`Medium`、`Low` 三段設定，各欄位自動依重要程度與建立時間由高至低智慧排序。
- 💾 **本地資料持久化 (LocalStorage)**：關閉瀏覽器後任務資料不遺失，開箱即用無需後端伺服器或資料庫。
- 🎨 **暖調燕麥美學設計**：採用柔和溫暖的陶土焦糖色與燕麥奶底色，長時間使用舒適不疲勞。

---

## 系統展示與線上預覽

- **GitHub Pages 公開網址**：[https://wangtsgood-cloud.github.io/kanban-app/](https://wangtsgood-cloud.github.io/kanban-app/)

---

## 檔案架構

```
kanban-app/
├── index.html                  # 看板結構與語意化 HTML5 標記
├── style.css                   # 暖色系極簡美學 CSS 樣式與動畫
├── app.js                      # 核心業務邏輯、DOM 操作與 LocalStorage 管理
├── .agents/
│   └── rules/
│       └── docs-writing.md     # 專案文件撰寫規範
└── README.md                   # 專案說明文件
```

---

## 快速開始與本地運行

本專案採用純原生前端技術開發（Vanilla JavaScript + HTML5 + CSS3），無需安裝 Node.js、npm 或任何打包編譯工具。

### 1. 複製專案 (Clone)
```bash
git clone https://github.com/wangtsgood-cloud/kanban-app.git
cd kanban-app
```

### 2. 開啟專案
直接以任何現代瀏覽器開啟 `index.html` 即可：
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

> [!TIP]
> 如果有使用 VS Code，也可使用 **Live Server** 擴充套件啟動本地熱重載預覽伺服器。

---

## 核心操作說明

### 1. 新增任務
1. 於頂部輸入框輸入任務內容。
2. 選擇「工作」或「生活」分類。
3. 選擇優先程度（`High` / `Medium` / `Low`）。
4. （可選）點擊「截止日」欄位設定到期日期。
5. 點擊「新增」或按下鍵盤 `Enter` 鍵送出。

### 2. 跨欄移動任務
- **桌面端拖曳**：按住卡片左上方握把或卡片本體，拖曳至目標欄位放置。
- **快捷按鈕**：卡片右下角提供快速切換按鈕（例如：`進行中 →`、`完成 →`、`← 待辦`）。

### 3. 篩選與清理
- 點擊頂部的「全部」、「工作」、「生活」頁籤可即時篩選卡片。
- 在 `Done` 欄位若有完成的卡片，點擊標題旁的「清除」按鈕可一鍵清理已歸檔任務。

---

## 技術細節

- **純原生零相依**：無 React / Vue / jQuery 等外部套件，載入極速且效能優異。
- **日期與逾期比對機制**：
  採用本地時間比對截止日期與當日午夜（`00:00:00`），精確辨識逾期狀態而無視差問題。
- **資料相容與版本遷移**：
  內建資料正規化解析器，具備舊格式自動相容與預設範例補全機制。

> [!NOTE]
> 本專案所有任務資料均儲存於使用者的瀏覽器 `localStorage` 中，不會向任何外部伺服器發送個人數據。

---

## 授權條款 (License)

本專案採用 [MIT License](https://opensource.org/licenses/MIT) 授權開放使用。