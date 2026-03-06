<script>
  import { router } from '../stores/routerStore';
  import { authStore } from '../stores/authStore';
  import { notifications } from '../stores/notificationStore';
  import SapphireLogo from '../components/SapphireLogo.svelte';

  let email = '';
  let password = '';

  async function handleLogin(e) {
    e.preventDefault();
    const success = await authStore.login(email, password);
    if (success) {
      notifications.success('Welcome back!');
      router.navigate('/search');
    }
  }
</script>

<div class="login-page">
  <div class="background-gradient"></div>
  <div class="particles">
    {#each Array(20) as _, i}
      <div class="particle" style="
        left: {Math.random() * 100}%;
        top: {Math.random() * 100}%;
        animation-delay: {Math.random() * 5}s;
        animation-duration: {5 + Math.random() * 10}s;
      "></div>
    {/each}
  </div>

  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <SapphireLogo size={100} />
        <h1>Sapphire AI</h1>
        <p class="tagline">Enterprise Knowledge Intelligence</p>
      </div>

      <form on:submit={handleLogin} class="login-form">
        {#if $authStore.error}
          <div class="error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
            </svg>
            {$authStore.error}
          </div>
        {/if}

        <div class="form-group">
          <label for="email">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" fill="currentColor"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" fill="currentColor"/>
            </svg>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="you@company.com"
            required
            disabled={$authStore.loading}
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" fill="currentColor"/>
            </svg>
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="••••••••"
            required
            disabled={$authStore.loading}
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="login-button" disabled={$authStore.loading}>
          {#if $authStore.loading}
            <div class="spinner"></div>
            Signing in...
          {:else}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-2 0V4H5v12h10v-2a1 1 0 112 0v3a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" fill="currentColor"/>
              <path d="M11 10a1 1 0 011-1h5.586l-1.293-1.293a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L17.586 11H12a1 1 0 01-1-1z" fill="currentColor"/>
            </svg>
            Sign In
          {/if}
        </button>
      </form>

      <div class="login-footer">
        <p>Secure enterprise authentication</p>
        <div class="security-badges">
          <span class="badge">🔒 256-bit encryption</span>
          <span class="badge">✓ SOC 2 compliant</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .background-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      #0f172a 0%,
      #1e293b 25%,
      #334155 50%,
      #1e3a8a 75%,
      #1e40af 100%
    );
    z-index: 0;
  }

  .particles {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(96, 165, 250, 0.6);
    border-radius: 50%;
    animation: float-particle linear infinite;
  }

  @keyframes float-particle {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) translateX(50px);
      opacity: 0;
    }
  }

  .login-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 480px;
    padding: 20px;
  }

  .login-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 48px;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    animation: slideUp 0.6s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .logo-section {
    text-align: center;
    margin-bottom: 40px;
  }

  .logo-section h1 {
    margin: 20px 0 8px;
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    color: #dc2626;
    font-size: 14px;
    animation: shake 0.4s;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #334155;
  }

  label svg {
    color: #64748b;
  }

  input {
    width: 100%;
    padding: 14px 16px;
    font-size: 15px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.2s;
    background: #f8fafc;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-button {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  }

  .login-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .login-footer {
    margin-top: 32px;
    text-align: center;
  }

  .login-footer p {
    color: #64748b;
    font-size: 13px;
    margin-bottom: 12px;
  }

  .security-badges {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: #f1f5f9;
    border-radius: 20px;
    font-size: 11px;
    color: #475569;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .login-card {
      padding: 32px 24px;
    }
  }
</style>