---
name: webapp-testing
description: 當需要為前端應用設計測試策略、執行單元測試、邊界值驗證、UI 互動與跨瀏覽器相容性測試時使用此 Skill。
---

# 網頁應用測試與驗證 Skill (WebApp Testing)

本 Skill 提供前端輕量應用的自動化邏輯測試、極限邊界測試與互動流程驗收指引。

---

## 測試維度與覆蓋範圍

1. **純函式與核心邏輯單元測試 (Unit Tests)**：
   - 日期計算（今日/過期紅標判定、跨年、閏年處理）。
   - 排序權重比對（Priority Weighting: High > Medium > Low）。
   - 資料遷移解析器（舊版欄位向下相容）。
2. **表單輸入與邊界條件測試 (Edge Cases)**：
   - 空白輸入與純空白字元（`"   "`）。
   - 超長字串輸入（超過 120 字元截斷或提示）。
   - 特殊字元與 HTML 注入防護（`<script>`, `&`, `"`）。
3. **狀態持久化測試 (Persistence)**：
   - 模擬 `localStorage` 滿載或被清除時的容錯表現。
   - 頁面重新整理（F5）後狀態一致性校對。

---

## 輕量化 Node.js 快速測試模板

在無重型測試框架（Jest/Vitest）的情境下，直接運用 Node.js 內建 `assert` 模組撰寫快速驗證腳本：

```javascript
const assert = require('assert');

// 測試用例 1: 逾期判定驗證
function isDueOrOverdue(dateStr) {
  if (!dateStr) return false;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return false;
  const due = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() <= today.getTime();
}

assert.strictEqual(isDueOrOverdue('2025-01-01'), true, '過去日期應判定為逾期');
assert.strictEqual(isDueOrOverdue('2099-12-31'), false, '未來日期不應判定為逾期');
console.log('所有單元邏輯斷言測試通過！');
```

---

## 測試驗收判準

- [ ] 控制台（Console）是否有未捕捉的 Uncaught Error？
- [ ] 核心業務函式是否具備自動化斷言測試？
- [ ] 跨欄拖曳與狀態切換是否能正確更新視覺與持久層？