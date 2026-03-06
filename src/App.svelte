<script>
  import { router } from './lib/stores/routerStore';
  import LoginPage from './lib/pages/LoginPage.svelte';
  import SearchPage from './lib/pages/SearchPage.svelte';
  import AdminPage from './lib/pages/AdminPage.svelte';
  import Toast from './lib/components/Toast.svelte';

  let currentPath = '/';
  
  router.subscribe(path => {
    currentPath = path;
  });
</script>

<Toast />

{#if currentPath === '/'}
  <LoginPage />
{:else if currentPath === '/search'}
  <SearchPage />
{:else if currentPath === '/admin'}
  <AdminPage />
{:else}
  <LoginPage />
{/if}