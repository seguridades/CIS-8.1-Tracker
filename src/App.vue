<script setup>
import { onMounted } from 'vue'
import { useSeedStore } from './stores/seed'
import { useProjectStore } from './stores/project'
import { usePrefsStore } from './stores/prefs'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import UnlockModal from './components/UnlockModal.vue'

const seedStore = useSeedStore()
const projectStore = useProjectStore()
const prefsStore = usePrefsStore()

onMounted(async () => {
  prefsStore.applyTheme()
  projectStore.init()
  await seedStore.loadSeed()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Unlock modal shown as lightbox over the home page -->
    <UnlockModal v-if="projectStore.isLocked" />

    <template v-else>
      <AppHeader />
      
      <main class="flex-grow">
        <router-view v-if="!seedStore.loading"></router-view>
        <div v-else class="h-screen flex items-center justify-center">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-slate-500 font-medium">Cargando base de datos CIS...</p>
          </div>
        </div>
      </main>

      <AppFooter />
    </template>
  </div>
</template>

<style>
/* Global transitions for page changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
