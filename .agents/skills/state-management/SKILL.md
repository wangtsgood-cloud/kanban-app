---
name: state-management
description: 當需要設計或重構前端狀態流、單向資料流、事件驅動機制、防禦性資料載入及瀏覽器持久化（LocalStorage/IndexedDB）時使用此 Skill。
---

# 前端狀態管理與持久化 Skill (State Management)

本 Skill 規範前端狀態結構、資料更新不可變性、單向資料流及跨版本本地儲存的防禦性容錯機制。

---

## 單向資料流 (Unidirectional Data Flow)

```
[使用者互動/事件觸發]
       ↓
[調用 Action / Dispatch] (例：addTodo, moveTaskToStatus)
       ↓
[不可變更新 State] (使用 map, filter, unshift 生成新狀態)
       ↓
[寫入持久層 (saveTodos)] (LocalStorage 同步序列化)
       ↓
[觸發畫面重新渲染 (render)] (純函式更新三欄 DOM 與統計)
```

---

## 防禦性資料模型規範 (Defensive Schema)

當自 `localStorage` 讀取資料時，嚴格執行資料清洗與預設值補齊，避免異常值導致頁面崩潰：

```javascript
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_TODOS;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_TODOS;

    return parsed.map(item => ({
      id: item.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      text: String(item.text || '').trim() || '未命名任務',
      category: ['work', 'life'].includes(item.category) ? item.category : 'work',
      priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
      dueDate: typeof item.dueDate === 'string' ? item.dueDate : null,
      status: ['todo', 'process', 'done'].includes(item.status) ? item.status : 'todo',
      createdAt: Number(item.createdAt) || Date.now()
    }));
  } catch (err) {
    console.error('資料解析失敗，回退至預設值:', err);
    return INITIAL_TODOS;
  }
}
```

---

## 狀態管理檢驗準則

- [ ] 任何狀態修改是否均無直接 `todos[i].status = '...'` 的可變更動？
- [ ] 每次狀態變動是否均保證 LocalStorage 與 UI 同步更新？
- [ ] 是否妥善處理了資料不存在或格式損壞時的 Graceful Fallback？