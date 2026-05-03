import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Setup from '@/views/Setup.vue'
import ControlsIndex from '@/views/ControlsIndex.vue'
import ControlDetail from '@/views/ControlDetail.vue'
import SafeguardEdit from '@/views/SafeguardEdit.vue'
import Reports from '@/views/Reports.vue'
import Settings from '@/views/Settings.vue'
import { useProjectStore } from '@/stores/project'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup
  },
  {
    path: '/controls',
    name: 'Controls',
    component: ControlsIndex,
    meta: { requiresProject: true }
  },
  {
    path: '/controls/:number',
    name: 'ControlDetail',
    component: ControlDetail,
    meta: { requiresProject: true }
  },
  {
    path: '/safeguards/:id',
    name: 'SafeguardEdit',
    component: SafeguardEdit,
    meta: { requiresProject: true }
  },
  {
    path: '/reportes',
    name: 'Reports',
    component: Reports,
    meta: { requiresProject: true }
  },
  {
    path: '/configuracion',
    name: 'Settings',
    component: Settings,
    meta: { requiresProject: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guard to ensure project is loaded
router.beforeEach((to) => {
  const projectStore = useProjectStore()

  // If locked, only allow Home (modal will show on top)
  if (projectStore.isLocked) {
    if (to.name !== 'Home') return { name: 'Home' }
    return
  }
  
  if (to.meta.requiresProject && !projectStore.isProjectActive) {
    return { name: 'Home' }
  }
  
  if (to.name === 'Home' && projectStore.isProjectActive) {
    return { name: 'Controls' }
  }
})

export default router
