---
name: backend-integration
description: 當前端應用需要對接 RESTful API、第三方雲端服務、Webhook、OAuth 登入或處理非同步請求與離線緩存時使用此 Skill。
---

# 後端整合與 API 對接 Skill (Backend Integration)

本 Skill 提供前端輕量應用在對接後端 RESTful API、雲端 Serverless 服務、處理非同步通訊與離線優化時的工程規範。

---

## 核心通訊原則

1. **原生 Fetch 封裝**：
   - 不引進 Axios 等大型外部套件，採用封裝後的原生 `fetch` 支援超時（Timeout）、認證 Header 注入與統一錯誤捕捉。
2. **完整的非同步狀態呈現 (Four-State UI)**：
   - 任何網路請求必須對齊四種狀態：`Idle`（閒置）、`Loading`（載入中）、`Success`（成功）、`Error`（錯誤提示與重試）。
3. **離線優先與樂觀更新 (Optimistic UI)**：
   - 使用者發起操作時先即時更新本地畫面，背景非同步發送 API 請求；若請求失敗則優雅回滾並彈出通知。

---

## API 請求客戶端模組範例

```javascript
class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 8000);

    const config = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        throw new Error('網路連線逾時，請檢查網路狀態');
      }
      throw err;
    }
  }
}
```

---

## 安全性與跨網域原則 (Security & CORS)

- **避免暴露敏感金鑰**：純前端應用中絕對不可硬編碼寫入具備寫入/管理權限的 Secret API Key。
- **CORS 與憑證**：涉及跨網域請求時確認伺服器提供合適的 `Access-Control-Allow-Origin`。