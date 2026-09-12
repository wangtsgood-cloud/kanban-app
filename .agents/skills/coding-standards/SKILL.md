---
name: coding-standards
description: 當需要統一代碼撰寫風格、代碼品質檢查、命名規範、作用域安全防護、現代 ES6+ 語法約束與 Git Commit 規範時使用此 Skill。
---

# 代碼風格與品質規範 Skill (Coding Standards)

本 Skill 定義前端專案的 JavaScript、CSS、HTML 語法標準與 Conventional Commits 版本提交規範。

---

## JavaScript 編碼規範

1. **作用域封裝**：
   - 程式碼一律包裹於 IIFE 運算式中，第一行強制宣告 `'use strict';`。
2. **變數與命名法**：
   - 禁用 `var`，優先使用 `const`，僅在變數需重新賦值時使用 `let`。
   - 變數與函式使用駝峰命名（`camelCase`），常數與設定鍵使用全大寫（`UPPER_SNAKE_CASE`）。
3. **早期返回原則 (Early Return)**：
   - 函式驗證優先處理無效條件並提前返回，降低巢狀深度：
   ```javascript
   function handleAdd(text) {
     if (!text) return;
     // 核心邏輯
   }
   ```
4. **安全防護**：
   - 避免直接使用 `innerHTML` 拼接未經驗證的外部輸入文字，以 `textContent` 防範 XSS 攻擊。

---

## CSS 與 HTML 組織規範

1. **CSS 規範**：
   - 類名採用語意化烤肉串命名（`kebab-case`），如 `.kanban-card`, `.badge-group`。
   - 禁止隨意使用 `!important` 破壞權重階層。
   - 所有動畫過渡需具備貝茲曲線或簡潔的時間常數（如 `0.2s ease`）。
2. **HTML 語意化規範**：
   - 善用語意標籤：`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`。
   - 互動元件（按鈕、輸入框）必須補齊 `aria-label` 或 `<label for="...">`。

---

## Git Commit 規範 (Conventional Commits)

提交訊息格式必須為：`<type>: <description>`
- `feat:` 新增功能
- `fix:` 修復問題
- `docs:` 文件更新
- `style:` 純樣式與排版調整
- `refactor:` 代碼重構
- `perf:` 效能提升
- `test:` 測試相關異動