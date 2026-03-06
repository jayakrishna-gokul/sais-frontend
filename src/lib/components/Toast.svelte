<script>
  import { notifications } from '../stores/notificationStore';
</script>

{#each $notifications as notification (notification.id)}
  <div class="toast toast-{notification.type}" on:click={() => notifications.remove(notification.id)}>
    <span>{notification.message}</span>
    <button class="close">&times;</button>
  </div>
{/each}

<style>
  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer;
    animation: slideIn 0.3s ease;
    z-index: 9999;
    max-width: 400px;
  }

  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .toast-success {
    background: #10b981;
    color: white;
  }

  .toast-error {
    background: #ef4444;
    color: white;
  }

  .toast-info {
    background: #3b82f6;
    color: white;
  }

  .close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    margin-left: 15px;
    cursor: pointer;
  }
</style>