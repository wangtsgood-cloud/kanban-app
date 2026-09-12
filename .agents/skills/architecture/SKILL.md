---
name: architecture
description: 當需要進行前端架構設計、模組拆分、目錄規範、零相依與組件化規劃，或評估技術選型時使用此 Skill。
---

# 前端架構設計 Skill (Architecture)

本 Skill 提供前端單頁應用（SPA）與 Web 工具的架構規劃指引，專注於維持高可維護性、零外部相依性與模組化分層設計。

---

## 核心架構原則

1. **分層解耦 (Layered Separation)**：
   - **展示層 (Presentation Layer)**：HTML 語意標記與 CSS 樣式系統，專注介面呈現。
   - **狀態與儲存層 (State & Persistence Layer)**：資料模型、不可變更新邏輯與 LocalStorage 存取抽象。
   - **業務邏輯層 (Business Logic Layer)**：狀態轉移規則、計算比對、事件處理與過濾排序。
2. **零外部相依性 (Zero Dependencies)**：
   - 堅持純現代原生標準（HTML5, CSS3, ES6+）。
   - 消除建置打包、Node.js 模組或重型框架負擔，實現「雙擊即開、無痛部署」。
3. **單一職責與不可變性 (Single Responsibility & Immutability)**：
   - 每個函式只做一件明確的事情（如：`createCardElement` 僅負責 DOM 生成）。
   - 狀態更新一律透過純函式產生新陣列/物件，避免副作用傳遞。

---

## 目錄與模組組織標準

```
project-root/
├── index.html                  # 應用程式骨架與語意標記
├── style.css                   # 設計系統、變數體系與樣式組件
├── app.js                      # 核心業務、狀態管理與事件綁定
├── .agents/                    # AI 協同規範與工作流程資產
│   ├── rules/                  # 開發與文檔守則 (development.md, docs-writing.md)
│   ├── skills/                 # 能力庫 (architecture, ui-design 等)
│   └── workflows/              # 驗收與維護流程 (ux-check.md)
└── README.md                   # 專案說明與展示
```

---

## 架構審查清單 (Architecture Checklist)

- [ ] 是否完全無需安裝 `node_modules` 即可在瀏覽器端獨立運行？
- [ ] 業務邏輯是否獨立於 DOM 渲染函式之外？
- [ ] 是否具備清晰的單向資料流（Action $\to$ State $\to$ Storage $\to$ Render）？
- [ ] 是否在資料層設置安全邊界與舊版格式相容防線？