---
name: ui-design
description: 當需要設計或調整介面視覺層次、配色系統（Design Tokens）、微互動動效、卡片與標籤樣式、響應式排版（RWD）及無障礙設計時使用此 Skill。
---

# UI/UX 設計與視覺系統 Skill (UI Design)

本 Skill 提供現代極簡、高質感前端應用的視覺設計規範、Design Tokens 配置、響應式斷點與微互動動效指引。

---

## 核心設計系統 (Design Tokens)

所有視覺樣式必須統一於 `:root` 定義之 CSS Custom Properties：
```css
:root {
  /* 基礎色系 */
  --bg-primary: #F8F5EF;       /* 溫潤燕麥奶底色 */
  --bg-card: #FFFFFF;          /* 純白卡片 */
  --bg-subtle: #ECE4DA;        /* 次級底色 */
  --border-color: #E6DDD2;     /* 邊框色 */
  --border-focus: #D96B27;     /* 焦點輪廓 */

  /* 品牌亮點色 */
  --accent: #D96B27;           /* 焦糖陶土色 */
  --accent-hover: #BF5A1B;
  --accent-ring: rgba(217, 107, 39, 0.22);

  /* 語意狀態色 (警示/成功/中性) */
  --danger-color: #C04838;
  --danger-hover-bg: #FDF2F0;

  /* 幾何與排版 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-pill: 9999px;
  --shadow-card: 0 4px 14px rgba(70, 50, 30, 0.05);
  --shadow-hover: 0 8px 22px rgba(70, 50, 30, 0.08);
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 組件設計與微互動標準

1. **藥丸徽章群組 (`.badge-group`)**：
   - 採用小巧精緻的 `border-radius: var(--radius-pill)` 藥丸造型。
   - 包含小尺寸圓點或 SVG 圖示（11px ~ 12px），提升掃讀辨識度。
2. **卡片微互動 (Card Micro-interactions)**：
   - 滑鼠懸停具備輕量浮起位移（`transform: translateY(-2px)`）與陰影加深。
   - 拖曳中卡片降低不透明度（`opacity: 0.4`）並呈現虛線邊框。
3. **無障礙對比度 (A11y)**：
   - 所有文字與背景色彩對比度需符合 WCAG AA 標準（常態文字 $\ge 4.5:1$）。

---

## 響應式佈局策略 (RWD Breakpoints)

- **Mobile ( $\le 540\text{px}$ )**：表單控制項折行垂直排列，按鈕滿版或置中，外距內縮為 `16px ~ 20px`。
- **Tablet ( $541\text{px} \sim 860\text{px}$ )**：看板由三欄過渡為單欄或雙欄流式堆疊。
- **Desktop ( $\ge 861\text{px}$ )**：三欄並排等比分佈，最大寬度約束於 `1080px` 水平置中。