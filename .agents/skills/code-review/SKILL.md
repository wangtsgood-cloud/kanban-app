---
name: code-review
description: 當需要對代碼變更進行同儕審查（Code Review）、效能與安全性審查、架構合規性檢查及可維護性評估時使用此 Skill。
---

# 代碼審查與品質把關 Skill (Code Review)

本 Skill 提供標準化的代碼審查（Code Review）指引，確保每次 Pull Request 或功能提交皆符合架構規範、無回退缺陷並具備高品質。

---

## 審查五大維度 (Review Dimensions)

1. **功能完整性 (Correctness)**：
   - 變更是否完全滿足需求？
   - 邊界條件（極限長度、空值、時區、異常輸入）是否妥善處置？
2. **架構合規性 (Compliance)**：
   - 是否違反「零外部相依」或「分層架構」原則？
   - 是否遵循現有命名規範與 Design Tokens 色彩定義？
3. **安全性防護 (Security)**：
   - 是否存在 XSS 弱點（如不當使用 `innerHTML`）？
   - LocalStorage 存取是否具備 try-catch 與型別防禦？
4. **效能與資源 (Performance)**：
   - 是否存在過度重複渲染（Excessive Re-rendering）？
   - 拖曳監聽事件是否正確在 `dragend` 清理無用樣式？
5. **代碼可讀性 (Maintainability)**：
   - 函式長度是否適中？註解是否清楚說明非顯而易見的設計動機？

---

## 審查回覆標準分級 (Review Feedback Levels)

- **[Blocker] 阻斷性問題**：嚴重的功能缺陷、安全性漏洞、控制台報錯或嚴重的回退問題，必須修正後方可合併。
- **[Major] 主要建議**：違反架構原則、缺少必要的邊界防護或容錯機制，強烈建議改善。
- **[Minor] 次要優化**：代碼寫法可更簡潔、CSS 變數引用一致性微調，可於後續迭代改進。
- **[Nit] 細節微調**：錯字修正、標點排版或格式小建議，不阻擋發布。

---

## 審查產出標準模板

```markdown
### 🔍 Code Review 總結報告

- **整體判定**：✅ 批准 (Approved) / ⚠️ 需修改後批准 / ❌ 需重新設計
- **優點亮點**：
  - [列舉具體實現優秀之處]
- **審查發現與改善建議**：
  1. **[級別] 項目標題**：具體問題說明與建議改進代碼。
- **驗證確認**：
  - [ ] 通過語法檢驗 (Syntax Check)
  - [ ] 零 Console 報錯
  - [ ] GitHub Pages 正常運作
```