---
name: vibe-coding-frontend-builder
description: 當需要從零開始快速打造、部署、迭代單頁前端應用（SPA/Web Tool/MVP），並在開發過程中沉澱工程規範與自動化驗收工作流時使用此 Skill。
---

# VibeCoding 前端應用開發 Skill

本 Skill 旨在規範並標準化「人類意圖引導 + AI 快速實作」的前端敏捷交付模式。透過「極速發布 $\to$ 垂直切片增量 $\to$ 規則資產化 $\to$ 自動化驗收閉環」的完整路徑，讓開發者與 AI 能夠在數小時內高品質落地任何前端單頁應用。

---

## 適用情境

- **輕量工具型單頁應用 (Micro Utility SPAs)**：計時器、計算機、單位換算器、密碼生成器、Markdown 筆記/預覽器等。
- **行銷與展示型靜態網站 (Portfolio & Landing Pages)**：個人作品集、活動宣傳頁、產品登錄頁（Waitlist Page）。
- **快速原型驗證與概念落實驗證 (MVP / Rapid Prototyping)**：黑客松競賽作品、產品最小可行性原型。
- **獨立前端小組件或擴充套件介面 (Standalone Widgets & Extension UIs)**：無外部相依性的小工具、外掛彈出介面。

---

## 核心方法論（四心法）

1. **管線先行（Delivery First）**：第一行代碼寫完即打通雲端自動化部署，確保隨時有真實網址可供體驗與驗證。
2. **垂直切片（Feature Slice）**：每次只做一個最小完整功能（HTML+CSS+JS），拒絕大批改動，嚴守零破壞原則。
3. **規範內化（Rule Crystallization）**：先有具體實作，再將代碼哲學沉澱為 Rules 與 Guidelines，讓 AI 具備防護欄。
4. **驗收閉環（Workflow Audit）**：將驗收標準轉化為可重複觸發的 Workflow SOP，實現一鍵自動化回歸測試。

---

## 步驟序列

### 步驟 1：環境前置檢查（驗證工具鏈與身分權限）
- **目的**：確認本機 Git、GitHub CLI 已就緒且具備發布權限，消除後續指令失敗的風險。
- **Prompt 模板**：
  ```markdown
  幫我確認 Git 和 GitHub CLI 有沒有正確安裝，並檢查當前 GitHub 帳號的登入狀態與權限。
  ```
- **成功判斷標準**：終端回傳 Git 版本資訊、`gh` 版本資訊，且 `gh auth status` 明確顯示已登入有效帳號與權限範圍。

---

### 步驟 2：本地基準版本化（建立安全回退點）
- **目的**：為初始代碼建立第一份版本快照，確立現代分支規範，建立安全防護底線。
- **Prompt 模板**：
  ```markdown
  目前我的專案資料夾裡有 [檔案清單，例如：index.html、style.css、app.js]。幫我初始化 Git 版本控制，將預設分支設為 main，並建立第一次 commit："[初始化提交訊息，例如：feat: 初始化專案結構與基礎樣式]"。
  ```
- **成功判斷標準**：`git status` 回報 `working tree clean`，`git log` 包含第一次提交記錄，預設分支為 `main`。

---

### 步驟 3：打通雲端自動化部署（交付閉環）
- **目的**：建立遠端 GitHub 倉庫並啟用 GitHub Pages，讓專案第一時間獲得公開可點擊的真實網址。
- **Prompt 模板**：
  ```markdown
  幫我在 GitHub 建立一個公開的 Repo 叫做 [倉庫名稱，例如：kanban-app]，把現有的 commit 推送上去，並開啟 GitHub Pages 發布 [發布分支與路徑，例如：main 分支根目錄]，完成後回報線上公開網址。
  ```
- **成功判斷標準**：遠端倉庫建立完成、代碼推送成功、GitHub Actions 部署完成，且該公開網址以 `curl` 驗證回傳 `HTTP 200 OK`。

---

### 步驟 4：單一垂直切片功能迭代（小步快跑）
- **目的**：以最小衝擊、零破壞既有架構的方式，端到端完成單一特性的增量開發。
- **Prompt 模板**：
  ```markdown
  幫我在 [目標區塊/元件，例如：新增任務表單] 上加入 [新增欄位/功能，例如：截止日期欄位]，屬性為 [必填/選填，例如：可選填]。當 [觸發條件/資料存在時]，[介面表現與樣式反饋，例如：在卡片顯示「年/月/日」標籤，若是今天或已過期則標籤呈現紅色]。請確保其他現有功能與樣式完全不要改動。
  ```
- **成功判斷標準**：新功能符合預期，既有核心功能（如拖曳、排序、篩選）完全未受影響，瀏覽器控制台零報錯。

---

### 步驟 5：驗收固化與同步上線
- **目的**：在本地或自動化驗證通過後，立即將變更封裝為標準 Commit 並推向生產環境。
- **Prompt 模板**：
  ```markdown
  功能測試通過了，幫我以 Conventional Commits 格式建立 commit："[提交說明，例如：feat: 新增任務表單加入可選截止日期與逾期紅標]"，然後 push 到 GitHub 遠端倉庫更新線上版本。
  ```
- **成功判斷標準**：`git push` 成功，GitHub Pages 自動觸發重新部署並成功上線最新版本。

---

### 步驟 6：沉澱專案文檔元規範（Meta-Rules）
- **目的**：定義文檔規範，強制約束 AI 在後續產生任何文檔時的結構、語系與排版標準。
- **Prompt 模板**：
  ```markdown
  在專案目錄底下建立 Rules 檔案 .agents/rules/docs-writing.md，規範本專案所有技術文件的結構階層、繁體中文語系標準、程式碼標籤、GitHub Alert 語法與維護同步原則。
  ```
- **成功判斷標準**：檔案成功生成於 `.agents/rules/docs-writing.md`，內容完整且帶有正確的 Rules Frontmatter。

---

### 步驟 7：生成專案專業說明文檔（README）
- **目的**：依循剛建立的文檔規範，產出具備開源水準的專案首頁說明文檔。
- **Prompt 模板**：
  ```markdown
  遵循 .agents/rules/docs-writing.md 規範，為這個專案撰寫完整的 README.md 文件，需包含：專案簡介、線上展示連結、功能特色、檔案架構樹、免相依本機啟動步驟、操作指引與技術細節。
  ```
- **成功判斷標準**：專案根目錄生成排版精美、連結正確且內容完整的 `README.md`，並同步推送到 GitHub 倉庫首頁。

---

### 步驟 8：逆向提取並沉澱技術開發規範（Dev-Rules）
- **目的**：將專案既有的代碼哲學、資料架構與設計系統內化為規則，作為未來 AI 協同的防護欄。
- **Prompt 模板**：
  ```markdown
  按照現有專案的實際代碼與架構，撰寫開發規範文件至 .agents/rules/development.md，內容需涵蓋：零相依架構原則、JS 模組與安全防護、資料模型規格與防禦容錯、CSS 設計系統（Design Tokens）、HTML 語意無障礙與 Git Commit 規範。
  ```
- **成功判斷標準**：檔案生成於 `.agents/rules/development.md`，規則完全吻合當前專案實際代碼結構。

---

### 步驟 9：建立標準化驗收工作流程（Workflow SOP）
- **目的**：將人工驗收經驗提煉為結構化的核對清單（Checklist），形成標準作業程序。
- **Prompt 模板**：
  ```markdown
  在專案目錄底下建立 Workflows 檔案 .agents/workflows/[工作流程名稱，例如：ux-check.md]，定義本專案在功能發布前必須檢驗的視覺層次、響應式斷點、表單防呆、狀態轉換、資料持久化與無障礙核對清單。
  ```
- **成功判斷標準**：檔案生成於 `.agents/workflows/<name>.md`，包含清晰的核選項目與驗收標準。

---

### 步驟 10：一鍵觸發自動化品質審查（Audit Loop）
- **目的**：調用預先定義好的工作流程，讓 AI 針對代碼進行全方位的自動化審計與回歸驗證。
- **Prompt 模板**：
  ```markdown
  @[.agents/workflows/[工作流程名稱，例如：ux-check.md]]
  ```
- **成功判斷標準**：AI 依序逐條核查當前專案實作，提供每項檢查點的通過狀態，並給予最終驗收判定。

---

## 常見問題處理

### 問題 1：Git 首次 Commit 因未設定身分失敗（`Author identity unknown`）
- **原因**：在全新環境或使用者從未設定全域 Git 身分時，Git 無法得知提交者姓名與 Email，會直接阻斷 commit 執行。
- **解法**：在初次 commit 前，先執行身分綁定。若有登入 GitHub CLI，可直接關聯 GitHub 帳號：
  ```bash
  git config --global user.name "你的使用者名稱"
  git config --global user.email "你的Email或GitHub隱私Email"
  ```

### 問題 2：新增資料欄位後，舊訪客開啟網頁導致 JS 崩潰（Runtime Crash）
- **原因**：使用者瀏覽器的 `localStorage` 內存有舊版本資料，當新代碼直接讀取新欄位進行屬性存取或字串處理時（例如 `item.dueDate.split('-')`），會觸發 `TypeError: Cannot read properties of undefined`。
- **解法**：永遠實施「防禦性反序列化」（Defensive Normalization）。在 `loadData()` 解析儲存資料時，對每個欄位提供安全預設值：
  ```javascript
  const normalized = storedList.map(item => ({
    id: item.id || generateId(),
    text: item.text || '',
    dueDate: item.dueDate || null, // 預設安全 fallback
    // ...其餘欄位
  }));
  ```

### 問題 3：GitHub Pages 發布後出現 404 或樣式破圖（Asset Path Mismatch）
- **原因**：GitHub Pages 專案頁面通常位於子路徑（如 `https://username.github.io/repo-name/`）。若在 HTML/CSS/JS 中使用絕對根路徑引用靜態資源（例如 `/style.css`、`/app.js`），瀏覽器會向根目錄尋找導致 404。
- **解法**：專案內部資源引用一律使用「相對路徑」（例如 `style.css`、`./app.js` 或 `images/logo.png`），避免以斜線 `/` 開頭；推送後以 `curl.exe -s -I <URL>` 確認實際返回狀態碼為 `HTTP 200 OK`。

### 問題 4：AI 在新增功能時「擅作主張」改動了原有樣式或破壞現有功能（Regression Bug）
- **原因**：提示詞僅描述目標功能，缺少明確的邊界限制與保護條件，導致模型重構了周邊代碼。
- **解法**：在 Prompt 模板中務必加上「負向約束」與「防守邊界」：
  1. 明確宣告：`「僅修改 [目標區塊/元件]，其他現有功能、樣式與資料結構請完全不要改動」`。
  2. 迭代完成後立即執行步驟 10 的 `@[.agents/workflows/ux-check.md]` 進行自動化回歸審核。