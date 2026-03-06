<script>
  import { router } from '../stores/routerStore';
  import { authStore } from '../stores/authStore';
  import { api } from '../services/api';
  import { API_ENDPOINTS } from '../utils/constants';
  import { notifications } from '../stores/notificationStore';

  if (!$authStore.isAuthenticated) {
    router.navigate('/');
  }

  let query = '';
  let result = null;  // Single result object, not array
  let loading = false;
  let searchHistory = [];

  async function handleSearch() {
    if (!query.trim()) return;
    
    loading = true;
    result = null;
    
    try {
      // Backend returns single SearchResponse object
      const response = await api.post(API_ENDPOINTS.SEARCH.QUERY, { 
        query,
        maxResults: 5
      });
      
      result = response;  // Store the whole response
      searchHistory = [query, ...searchHistory].slice(0, 5);
      
    } catch (error) {
      notifications.error(error.message);
    } finally {
      loading = false;
    }
  }

  function logout() {
    authStore.logout();
    router.navigate('/');
  }
</script>

<div class="container">
  <header>
    <h1>🔷 Sapphire AI</h1>
    <div class="user-menu">
      <span>Welcome, {$authStore.user?.email || 'User'}</span>
      <button class="btn-admin" on:click={() => router.navigate('/admin')}>Admin</button>
      <button class="btn-logout" on:click={logout}>Logout</button>
    </div>
  </header>
  
  <main>
    <div class="search-section">
      <h2>Ask a Question</h2>
      
      <div class="search-box">
        <input 
          type="text" 
          bind:value={query}
          on:keypress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="How do I configure OAuth?"
          disabled={loading}
        />
        <button on:click={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {#if searchHistory.length > 0}
        <div class="history">
          <small>Recent searches:</small>
          {#each searchHistory as item}
            <button class="history-item" on:click={() => { query = item; handleSearch(); }}>
              {item}
            </button>
          {/each}
        </div>
      {/if}
    </div>
    
    {#if loading}
      <div class="loading">Searching knowledge base...</div>
    {/if}
    
    {#if result}
      <div class="results">
        <div class="result-card">
          <div class="answer">
            {result.answer}
          </div>
          
          <div class="meta">
            <span class="confidence">Confidence: {(result.confidence * 100).toFixed(0)}%</span>
            <span class="time">{result.processingTimeMs}ms</span>
          </div>
          
          {#if result.sources && result.sources.length > 0}
            <div class="sources">
              <strong>Sources ({result.sources.length}):</strong>
              {#each result.sources as source}
                <div class="source-item">
                  <div class="source-header">
                    <span class="source-title">{source.documentTitle || source.chunkId}</span>
                    <span class="source-score">{(source.score * 100).toFixed(0)}%</span>
                  </div>
                  {#if source.chunkContent}
                    <div class="source-preview">{source.chunkContent.substring(0, 200)}...</div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  .container {
    min-height: 100vh;
    background: #f5f5f5;
  }
  
  header {
    background: white;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  header h1 {
    margin: 0;
    color: #2c3e50;
    font-size: 24px;
  }
  
  .user-menu {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .btn-admin {
    padding: 8px 16px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-logout {
    padding: 8px 16px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  main {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
  }
  
  .search-section {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .search-section h2 {
    margin: 0 0 20px 0;
    color: #2c3e50;
  }
  
  .search-box {
    display: flex;
    gap: 10px;
  }
  
  .search-box input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .search-box button {
    padding: 12px 30px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
  }
  
  .search-box button:disabled {
    opacity: 0.6;
  }
  
  .history {
    margin-top: 15px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .history small {
    color: #666;
  }
  
  .history-item {
    padding: 5px 10px;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
  }
  
  .history-item:hover {
    background: #e0e0e0;
  }
  
  .loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }
  
  .results {
    margin-top: 30px;
  }
  
  .result-card {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .answer {
    color: #2c3e50;
    line-height: 1.8;
    font-size: 16px;
    margin-bottom: 20px;
    white-space: pre-wrap;
  }
  
  .meta {
    display: flex;
    gap: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .confidence {
    color: #27ae60;
    font-weight: 500;
  }
  
  .time {
    color: #7f8c8d;
  }
  
  .sources {
    margin-top: 20px;
  }
  
  .sources strong {
    display: block;
    margin-bottom: 15px;
    color: #2c3e50;
  }
  
  .source-item {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 10px;
    border-left: 3px solid #3498db;
  }
  
  .source-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .source-title {
    font-weight: 500;
    color: #2c3e50;
    font-size: 14px;
  }
  
  .source-score {
    background: #3498db;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
  }
  
  .source-preview {
    color: #666;
    font-size: 13px;
    line-height: 1.6;
  }
</style>