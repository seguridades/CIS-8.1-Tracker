<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { useSeedStore } from '@/stores/seed'
import { usePrefsStore } from '@/stores/prefs'
import { LayoutDashboard, CheckSquare, BarChart3, Settings, Moon, Sun, Monitor, Download, Search, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const seedStore = useSeedStore()
const prefsStore = usePrefsStore()

const progress = computed(() => projectStore.getProgress(seedStore.safeguards))

const navItems = [
  { name: 'Dashboard', path: '/controls', icon: LayoutDashboard },
  { name: 'Reportes', path: '/reportes', icon: BarChart3 },
  { name: 'Configuración', path: '/configuracion', icon: Settings },
]

const isActive = (path) => route.path.startsWith(path)

const exportJson = () => {
  const data = {
    format: 'cisv81-tracker-export',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    appVersion: '1.0.0',
    project: projectStore.project,
    evaluations: projectStore.evaluations
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `CIS-v8.1-Tracker-${projectStore.project?.orgName || 'Export'}-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  projectStore.markAsExported()
}
const isExportOverdue = computed(() => {
  if (!projectStore.project) return false
  
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  
  // If never exported
  if (!projectStore.exportedAt) {
    const startedAt = new Date(projectStore.project.startedAt)
    return (now - startedAt.getTime()) > sevenDays
  }
  
  // If exported before
  const lastExport = new Date(projectStore.exportedAt)
  return (now - lastExport.getTime()) > sevenDays
})
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
    <!-- Export Warning Banner -->
    <div v-if="isExportOverdue" class="bg-amber-500 text-white text-[10px] font-bold py-1 text-center uppercase tracking-widest print:hidden">
      ¡Atención! No has exportado tus datos en más de 7 días. Exporta un JSON para evitar pérdida de datos.
    </div>

    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo & Title -->
      <div class="flex items-center gap-4 cursor-pointer" @click="projectStore.isProjectActive ? router.push('/controls') : null">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
          <ShieldCheck :size="20" />
        </div>
        <div class="hidden md:block">
          <h1 class="font-bold text-sm leading-tight">CIS Tracker</h1>
          <p v-if="projectStore.isProjectActive" class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{{ projectStore.project?.orgName }}</p>
          <p v-else class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Controls v8.1</p>
        </div>
      </div>

      <!-- Navigation: only when project is active -->
      <nav v-if="projectStore.isProjectActive" class="hidden md:flex items-center gap-1">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.path) ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'"
        >
          <component :is="item.icon" :size="18" />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Progress Mini-stat: only when project is active -->
        <div v-if="projectStore.isProjectActive" class="hidden lg:flex items-center gap-3 mr-4 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
          <div class="text-xs font-bold text-slate-500">{{ progress.percent }}%</div>
          <div class="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-primary-500 transition-all duration-500" :style="{ width: `${progress.percent}%` }"></div>
          </div>
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ projectStore.project?.igTarget }}</div>
        </div>

        <!-- Export: only when project is active -->
        <button v-if="projectStore.isProjectActive" @click="exportJson" class="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Exportar JSON">
          <Download :size="20" />
        </button>

        <!-- GitHub link -->
        <a
          href="https://github.com/seguridades/CIS-8.1-Tracker"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Ver en GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>

        <button @click="prefsStore.toggleTheme" class="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
          <Sun v-if="prefsStore.theme === 'light'" :size="20" />
          <Moon v-else-if="prefsStore.theme === 'dark'" :size="20" />
          <Monitor v-else :size="20" />
        </button>
      </div>
    </div>
  </header>
</template>
