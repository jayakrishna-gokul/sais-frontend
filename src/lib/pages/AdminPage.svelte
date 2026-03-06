<script>
  import { router } from '../stores/routerStore';
  import { authStore } from '../stores/authStore';
  import { api } from '../services/api';
  import { notifications } from '../stores/notificationStore';

  if (!$authStore.isAuthenticated) {
    router.navigate('/');
  }

  let stats = null;
  let loading = true;
  let uploading = false;
  let uploadProgress = 0;
  let syncing = false;
  let connectionId = null;
  
  // Modal state
  let showConnectionModal = false;
  let savingConnection = false;
  
  // Form data
  let connectionForm = {
    name: '',
    baseUrl: '',
    email: '',
    apiToken: '',
    spaceKey: ''
  };

  async function loadStats() {
    loading = true;
    try {
      stats = await api.get('/api/admin/stats');
      
      if (stats?.confluence?.connected) {
        // Backend extracts organizationId from JWT token automatically
        const connections = await api.get('/api/confluence/connections');
        if (connections && connections.length > 0) {
          connectionId = connections[0].id;
        }
      }
    } catch (error) {
      notifications.error('Failed to load stats: ' + error.message);
    } finally {
      loading = false;
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    uploading = true;
    uploadProgress = 0;

    try {
      await api.uploadFile('/api/documents/upload', file, (progress) => {
        uploadProgress = progress;
      });
      notifications.success('Document uploaded and indexed');
      loadStats();
    } catch (error) {
      notifications.error(error.message);
    } finally {
      uploading = false;
      uploadProgress = 0;
      e.target.value = '';
    }
  }

  async function syncConfluence() {
    if (!connectionId) {
      notifications.error('No Confluence connection configured');
      return;
    }
    
    syncing = true;
    try {
      await api.post(`/api/confluence/connections/${connectionId}/sync/full`);
      notifications.success('Confluence sync triggered');
      setTimeout(loadStats, 3000);
    } catch (error) {
      notifications.error('Sync failed: ' + error.message);
    } finally {
      // BUGFIX: Always reset syncing flag, even on error
      syncing = false;
    }
  }

  function openConnectionModal() {
    connectionForm = {
      name: '',
      baseUrl: '',
      email: '',
      apiToken: '',
      spaceKey: ''
    };
    showConnectionModal = true;
  }

  function closeConnectionModal() {
    showConnectionModal = false;
  }

  async function saveConnection() {
  // Validate
  if (!connectionForm.name || !connectionForm.baseUrl || !connectionForm.email || !connectionForm.apiToken || !connectionForm.spaceKey) {
    notifications.error('All fields are required');
    return;
  }

  savingConnection = true;
  try {
    // 1. Create connection WITH space key
    const connection = await api.post('/api/confluence/connections', {
      connectionName: connectionForm.name,
      baseUrl: connectionForm.baseUrl,
      username: connectionForm.email,     // ✅ username (not email)
      apiToken: connectionForm.apiToken,
      spaceKeys: [connectionForm.spaceKey]  // ✅ Add space during creation
    });

    connectionId = connection.id;

    notifications.success('Confluence connection created successfully');
    closeConnectionModal();
    loadStats();
  } catch (error) {
    notifications.error('Failed to create connection: ' + error.message);
  } finally {
    savingConnection = false;
  }
}

  loadStats();
</script>

<div class="admin-page">
  <header>
    <div class="header-left">
      <h1>🔷 Sapphire AI — Admin</h1>
    </div>
    <button class="btn-back" on:click={() => router.navigate('/search')}>← Back to Search</button>
  </header>

  <main>
    <!-- Stats Grid -->
    <section class="stats-section">
      <h2>Overview</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📄</div>
          <div class="stat-value">{loading ? '...' : stats?.totalDocuments ?? 0}</div>
          <div class="stat-label">Documents</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🧩</div>
          <div class="stat-value">{loading ? '...' : stats?.totalChunks ?? 0}</div>
          <div class="stat-label">Chunks</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔍</div>
          <div class="stat-value">{loading ? '...' : stats?.totalSearchQueries ?? 0}</div>
          <div class="stat-label">Searches</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-value">{loading ? '...' : stats?.totalUsers ?? 0}</div>
          <div class="stat-label">Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-value">{loading ? '...' : stats?.totalAuditLogs ?? 0}</div>
          <div class="stat-label">Audit Logs</div>
        </div>
      </div>
    </section>

    <!-- Confluence Connector -->
    <section class="connector-section">
      <div class="section-header">
        <h2>Connectors</h2>
        {#if !connectionId}
          <button class="btn-configure" on:click={openConnectionModal}>+ Configure Connection</button>
        {/if}
      </div>
      
      <div class="connector-card">
        <div class="connector-header">
          <div class="connector-title">
            <span class="connector-icon">🔗</span>
            <h3>Confluence</h3>
            {#if stats?.confluence}
              <span class="status-badge status-{stats.confluence.status.toLowerCase()}">{stats.confluence.status}</span>
            {/if}
          </div>
          <button class="btn-sync" on:click={syncConfluence} disabled={syncing || !connectionId}>
            {syncing ? '⟳ Syncing...' : '⟳ Sync Now'}
          </button>
        </div>
        <div class="connector-details">
          <div class="detail-row">
            <span class="detail-label">Pages synced</span>
            <span class="detail-value">{loading ? '...' : stats?.confluence?.totalPages ?? 0}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Last synced</span>
            <span class="detail-value">{loading ? '...' : stats?.confluence?.lastSyncedAt ?? 'Never'}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Upload -->
    <section class="upload-section">
      <h2>Upload Document</h2>
      <div class="upload-box">
        <input type="file" id="file-upload" on:change={handleFileUpload}
               accept=".pdf,.docx,.txt,.md" disabled={uploading} />
        <label for="file-upload" class="upload-label" class:uploading>
          {#if uploading}
            ⟳ Uploading... {uploadProgress.toFixed(0)}%
          {:else}
            📎 Choose File
          {/if}
        </label>
        <p class="upload-hint">Supports PDF, DOCX, TXT, MD</p>
        {#if uploading}
          <div class="progress-bar">
            <div class="progress-fill" style="width: {uploadProgress}%"></div>
          </div>
        {/if}
      </div>
    </section>
  </main>
</div>

<!-- Connection Modal -->
{#if showConnectionModal}
  <div class="modal-overlay" on:click={closeConnectionModal}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h3>Configure Confluence Connection</h3>
        <button class="btn-close" on:click={closeConnectionModal}>×</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="conn-name">Connection Name</label>
          <input id="conn-name" type="text" bind:value={connectionForm.name} placeholder="SAIS Confluence" />
        </div>

        <div class="form-group">
          <label for="conn-url">Confluence URL</label>
          <input id="conn-url" type="url" bind:value={connectionForm.baseUrl} placeholder="https://your-domain.atlassian.net" />
        </div>

        <div class="form-group">
          <label for="conn-email">Email</label>
          <input id="conn-email" type="email" bind:value={connectionForm.email} placeholder="you@company.com" />
        </div>

        <div class="form-group">
          <label for="conn-token">API Token</label>
          <input id="conn-token" type="password" bind:value={connectionForm.apiToken} placeholder="ATATT3xFfGF0..." />
          <small>Generate at <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank">Atlassian API Tokens</a></small>
        </div>

        <div class="form-group">
          <label for="conn-space">Space Key</label>
          <input id="conn-space" type="text" bind:value={connectionForm.spaceKey} placeholder="ENGDOCS" />
          <small>Found in your Confluence space URL</small>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" on:click={closeConnectionModal}>Cancel</button>
        <button class="btn-save" on:click={saveConnection} disabled={savingConnection}>
          {savingConnection ? 'Saving...' : 'Save & Connect'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .admin-page {
    min-height: 100vh;
    background: #f1f5f9;
  }

  header {
    background: white;
    padding: 20px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  header h1 {
    margin: 0;
    font-size: 22px;
    color: #1e293b;
  }

  .btn-back {
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .btn-back:hover { background: #2563eb; }

  main {
    max-width: 1100px;
    margin: 32px auto;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  h2 {
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #1e293b;
    font-weight: 600;
  }

  /* Stats */
  .stats-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
  }

  .stat-card {
    background: #f8fafc;
    border-radius: 10px;
    padding: 20px 16px;
    text-align: center;
    border: 1px solid #e2e8f0;
  }

  .stat-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #1e3a8a;
  }

  .stat-label {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }

  /* Connector */
  .connector-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .btn-configure {
    padding: 8px 16px;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .btn-configure:hover { background: #059669; }

  .connector-card {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px;
  }

  .connector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .connector-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .connector-title h3 {
    margin: 0;
    font-size: 16px;
  }

  .connector-icon { font-size: 20px; }

  .status-badge {
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-synced { background: #dcfce7; color: #166534; }
  .status-syncing { background: #dbeafe; color: #1d4ed8; }
  .status-failed { background: #fee2e2; color: #dc2626; }
  .status-never_synced { background: #f1f5f9; color: #64748b; }

  .btn-sync {
    padding: 8px 16px;
    background: #1e3a8a;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .btn-sync:hover:not(:disabled) { background: #1e40af; }
  .btn-sync:disabled { opacity: 0.6; cursor: not-allowed; }

  .connector-details {
    display: flex;
    gap: 32px;
  }

  .detail-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-label {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-value {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
  }

  /* Upload */
  .upload-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .upload-box input[type="file"] { display: none; }

  .upload-label {
    display: inline-block;
    padding: 10px 24px;
    background: #3b82f6;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s;
  }

  .upload-label:hover { background: #2563eb; }
  .upload-label.uploading { background: #64748b; cursor: not-allowed; }

  .upload-hint {
    display: block;
    margin: 8px 0 0 0;
    font-size: 12px;
    color: #94a3b8;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    margin-top: 12px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #3b82f6;
    border-radius: 2px;
    transition: width 0.3s;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e2e8f0;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #1e293b;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 28px;
    color: #64748b;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
  }

  .btn-close:hover { color: #1e293b; }

  .modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
  }

  .form-group input {
    padding: 10px 12px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
  }

  .form-group input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .form-group small {
    font-size: 12px;
    color: #64748b;
  }

  .form-group small a {
    color: #3b82f6;
    text-decoration: none;
  }

  .form-group small a:hover {
    text-decoration: underline;
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .btn-cancel {
    padding: 10px 20px;
    background: #f1f5f9;
    color: #475569;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .btn-cancel:hover { background: #e2e8f0; }

  .btn-save {
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .btn-save:hover:not(:disabled) { background: #2563eb; }
  .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
</style>