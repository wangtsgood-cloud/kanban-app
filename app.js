/**
 * 待辦看板 (Minimalist Kanban Board)
 * 核心功能：三欄式看板 (To-do, Process, Done)、原生拖放跨欄 (Drag & Drop)、分類與本地儲存
 */

(function () {
  'use strict';

  // LocalStorage Key
  const STORAGE_KEY = 'minimalist_kanban_todos_v2';

  // 初始預設看板資料
  const INITIAL_TODOS = [
    {
      id: 'task-1',
      text: '規劃下季度專案里程碑與技術架構',
      category: 'work',
      priority: 'high',
      status: 'todo',
      createdAt: Date.now() - 3600000 * 3
    },
    {
      id: 'task-2',
      text: '挑選假期的露營裝備與營地預約',
      category: 'life',
      priority: 'low',
      status: 'todo',
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: 'task-3',
      text: '設計簡約暖色系看板介面與拖曳動畫',
      category: 'work',
      priority: 'high',
      status: 'process',
      createdAt: Date.now() - 3600000 * 1
    },
    {
      id: 'task-4',
      text: '早晨晨跑 5 公里與手沖淺焙咖啡',
      category: 'life',
      priority: 'medium',
      status: 'done',
      createdAt: Date.now() - 3600000 * 5
    }
  ];

  // 優先程度權重映射 (High > Medium > Low)
  const PRIORITY_WEIGHTS = {
    high: 3,
    medium: 2,
    low: 1
  };

  // 依優先程度與建立時間進行排序
  function compareTasksByPriority(a, b) {
    const weightA = PRIORITY_WEIGHTS[a.priority] || 2;
    const weightB = PRIORITY_WEIGHTS[b.priority] || 2;
    if (weightB !== weightA) {
      return weightB - weightA; // 優先級高者 (High) 排在前面
    }
    return (b.createdAt || 0) - (a.createdAt || 0); // 同優先度時新任務排前
  }

  // DOM 元素選取
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const currentDateEl = document.getElementById('current-date');
  const totalStatsEl = document.getElementById('total-stats');
  const clearDoneBtn = document.getElementById('clear-done-btn');

  // 三個欄位卡片容器
  const columnCards = {
    todo: document.getElementById('cards-todo'),
    process: document.getElementById('cards-process'),
    done: document.getElementById('cards-done')
  };

  // 三個欄位計數
  const columnCounts = {
    todo: document.getElementById('count-todo'),
    process: document.getElementById('count-process'),
    done: document.getElementById('count-done')
  };

  // 三個欄位空狀態
  const columnEmpties = {
    todo: document.getElementById('empty-todo'),
    process: document.getElementById('empty-process'),
    done: document.getElementById('empty-done')
  };

  // 狀態管理
  let todos = loadTodos();
  let currentFilter = 'all'; // 'all' | 'work' | 'life'
  let draggedTaskId = null;

  // 應用程式初始化
  function init() {
    renderDate();
    setupEventListeners();
    setupDropZones();
    render();
  }

  // 渲染頂部日期
  function renderDate() {
    const now = new Date();
    try {
      const options = { month: 'numeric', day: 'numeric', weekday: 'long' };
      currentDateEl.textContent = now.toLocaleDateString('zh-TW', options);
    } catch (e) {
      currentDateEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日`;
    }
  }

  // 從 LocalStorage 載入資料（相容舊版資料格式）
  function loadTodos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            id: item.id || 'task_' + Math.random().toString(36).substr(2, 8),
            text: item.text || '未命名任務',
            category: item.category === 'life' ? 'life' : 'work',
            priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
            status: item.status || (item.completed ? 'done' : 'todo'),
            createdAt: item.createdAt || Date.now()
          }));
        }
      }

      // 檢查是否可自 v1 舊資料遷移
      const v1Stored = localStorage.getItem('minimalist_warm_todos_v1');
      if (v1Stored !== null) {
        const v1Parsed = JSON.parse(v1Stored);
        if (Array.isArray(v1Parsed) && v1Parsed.length > 0) {
          return v1Parsed.map(item => ({
            id: item.id || 'task_' + Math.random().toString(36).substr(2, 8),
            text: item.text || '未命名任務',
            category: item.category === 'life' ? 'life' : 'work',
            priority: 'medium',
            status: item.completed ? 'done' : 'todo',
            createdAt: item.createdAt || Date.now()
          }));
        }
      }
    } catch (error) {
      console.error('載入 LocalStorage 發生錯誤:', error);
    }
    return INITIAL_TODOS;
  }

  // 儲存至 LocalStorage
  function saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('寫入 LocalStorage 失敗:', error);
    }
  }

  // 設定事件監聽
  function setupEventListeners() {
    // 新增任務表單
    todoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;

      const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || 'work';
      const selectedPriority = document.querySelector('input[name="priority"]:checked')?.value || 'medium';
      addTodo(text, selectedCategory, selectedPriority);
      todoInput.value = '';
      todoInput.focus();
    });

    // 分類篩選頁籤
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');
        setFilter(filter);
      });
    });

    // 清除 Done 欄位
    clearDoneBtn.addEventListener('click', function () {
      clearDoneTasks();
    });
  }

  // 設定拖放放置區 (Drop Zones)
  function setupDropZones() {
    Object.values(columnCards).forEach(zone => {
      const targetStatus = zone.dataset.status;

      zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      zone.addEventListener('dragenter', function (e) {
        e.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', function (e) {
        // 防止子元素觸發 dragleave 導致頻繁閃爍
        if (!zone.contains(e.relatedTarget)) {
          zone.classList.remove('drag-over');
        }
      });

      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('drag-over');

        const taskId = draggedTaskId || e.dataTransfer.getData('text/plain');
        if (taskId) {
          moveTaskToStatus(taskId, targetStatus);
        }
      });
    });
  }

  // 新增任務 (預設進入 To-do 欄位，附帶優先程度)
  function addTodo(text, category, priority = 'medium') {
    const newTodo = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      text: text,
      category: category,
      priority: priority,
      status: 'todo',
      createdAt: Date.now()
    };

    todos.unshift(newTodo);
    saveTodos();

    // 若當前篩選與任務分類不同，切換至該分類方便檢視
    if (currentFilter !== 'all' && currentFilter !== category) {
      setFilter(category);
    } else {
      render();
    }
  }

  // 跨欄移動任務狀態
  function moveTaskToStatus(id, newStatus) {
    let taskFound = false;
    todos = todos.map(todo => {
      if (todo.id === id) {
        taskFound = true;
        return { ...todo, status: newStatus };
      }
      return todo;
    });

    if (taskFound) {
      saveTodos();
      render();
    }
  }

  // 刪除單一任務
  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    render();
  }

  // 清除 Done 欄位已完成任務
  function clearDoneTasks() {
    todos = todos.filter(todo => todo.status !== 'done');
    saveTodos();
    render();
  }

  // 設定分類篩選
  function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    render();
  }

  // 建立任務卡片 DOM
  function createCardElement(todo) {
    const card = document.createElement('article');
    card.className = 'kanban-card';
    card.dataset.id = todo.id;
    card.setAttribute('draggable', 'true');

    // HTML5 拖曳事件
    card.addEventListener('dragstart', function (e) {
      draggedTaskId = todo.id;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', todo.id);
      
      // 延遲添加樣式確保拖曳鏡像正常渲染
      setTimeout(() => {
        card.classList.add('dragging');
      }, 0);
    });

    card.addEventListener('dragend', function () {
      draggedTaskId = null;
      card.classList.remove('dragging');
      // 清除所有可能殘留的 drag-over 樣式
      Object.values(columnCards).forEach(zone => zone.classList.remove('drag-over'));
    });

    // 1. 卡片頂部 (抓取圖標 + 刪除按鈕)
    const header = document.createElement('div');
    header.className = 'card-header';

    const grip = document.createElement('span');
    grip.className = 'drag-grip';
    grip.title = '拖曳卡片跨欄移動';
    grip.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    `;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const delBtn = document.createElement('button');
    delBtn.className = 'card-action-btn delete-btn';
    delBtn.title = '刪除任務';
    delBtn.setAttribute('aria-label', `刪除任務：${todo.text}`);
    delBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    });

    actions.appendChild(delBtn);
    header.appendChild(grip);
    header.appendChild(actions);

    // 2. 任務內容
    const textEl = document.createElement('p');
    textEl.className = 'card-text';
    textEl.textContent = todo.text;

    // 3. 卡片底部 (分類標籤、優先程度標籤 + 快速跨欄按鈕)
    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const badgeGroup = document.createElement('div');
    badgeGroup.className = 'badge-group';

    const tag = document.createElement('span');
    tag.className = `category-badge ${todo.category}`;
    tag.textContent = todo.category === 'work' ? '工作' : '生活';

    const priorityTag = document.createElement('span');
    const priority = ['high', 'medium', 'low'].includes(todo.priority) ? todo.priority : 'medium';
    priorityTag.className = `priority-badge ${priority}`;
    const priorityNames = { high: 'High', medium: 'Medium', low: 'Low' };
    priorityTag.textContent = priorityNames[priority] || 'Medium';

    badgeGroup.appendChild(tag);
    badgeGroup.appendChild(priorityTag);

    const shortcuts = document.createElement('div');
    shortcuts.className = 'move-shortcuts';

    // 依目前欄位產生前進/後退按鈕（提升行動端與鍵盤操作便利性）
    if (todo.status === 'todo') {
      const toProcessBtn = document.createElement('button');
      toProcessBtn.className = 'move-btn';
      toProcessBtn.textContent = '進行中 →';
      toProcessBtn.title = '移至 Process 進行中';
      toProcessBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveTaskToStatus(todo.id, 'process');
      });
      shortcuts.appendChild(toProcessBtn);
    } else if (todo.status === 'process') {
      const toTodoBtn = document.createElement('button');
      toTodoBtn.className = 'move-btn';
      toTodoBtn.textContent = '← 待辦';
      toTodoBtn.title = '移回 To-do';
      toTodoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveTaskToStatus(todo.id, 'todo');
      });

      const toDoneBtn = document.createElement('button');
      toDoneBtn.className = 'move-btn';
      toDoneBtn.textContent = '完成 →';
      toDoneBtn.title = '移至 Done 完成';
      toDoneBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveTaskToStatus(todo.id, 'done');
      });

      shortcuts.appendChild(toTodoBtn);
      shortcuts.appendChild(toDoneBtn);
    } else if (todo.status === 'done') {
      const backProcessBtn = document.createElement('button');
      backProcessBtn.className = 'move-btn';
      backProcessBtn.textContent = '← 重啟進行';
      backProcessBtn.title = '移回 Process 進行中';
      backProcessBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveTaskToStatus(todo.id, 'process');
      });
      shortcuts.appendChild(backProcessBtn);
    }

    footer.appendChild(badgeGroup);
    footer.appendChild(shortcuts);

    card.appendChild(header);
    card.appendChild(textEl);
    card.appendChild(footer);

    return card;
  }

  // 渲染整個看板
  function render() {
    // 依分類過濾任務
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'work') return todo.category === 'work';
      if (currentFilter === 'life') return todo.category === 'life';
      return true;
    });

    // 依狀態分組
    const statusGroups = {
      todo: filteredTodos.filter(t => t.status === 'todo'),
      process: filteredTodos.filter(t => t.status === 'process'),
      done: filteredTodos.filter(t => t.status === 'done')
    };

    // 渲染三個欄位的卡片與空狀態
    ['todo', 'process', 'done'].forEach(status => {
      const container = columnCards[status];
      const countEl = columnCounts[status];
      const emptyEl = columnEmpties[status];
      const items = statusGroups[status];

      // 依優先程度 (High > Medium > Low) 進行排序
      items.sort(compareTasksByPriority);

      container.innerHTML = '';
      countEl.textContent = items.length;

      if (items.length === 0) {
        emptyEl.style.display = 'block';
      } else {
        emptyEl.style.display = 'none';
        items.forEach(todo => {
          container.appendChild(createCardElement(todo));
        });
      }
    });

    // 更新總數統計
    totalStatsEl.textContent = `共 ${filteredTodos.length} 項任務`;

    // Done 欄位若有卡片則顯示清除按鈕
    if (statusGroups.done.length > 0) {
      clearDoneBtn.style.display = 'inline-block';
    } else {
      clearDoneBtn.style.display = 'none';
    }
  }

  // 頁面加載啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
