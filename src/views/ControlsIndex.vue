<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSeedStore } from '@/stores/seed'
import { useProjectStore } from '@/stores/project'
import { usePrefsStore } from '@/stores/prefs'
import { Search, Filter, Eye, EyeOff, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const seedStore = useSeedStore()
const projectStore = useProjectStore()
const prefsStore = usePrefsStore()

const searchQuery = ref('')

const filteredControls = computed(() => {
  if (!searchQuery.value) return seedStore.controls
  const q = searchQuery.value.toLowerCase()
  return seedStore.controls.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.number.toString().includes(q) ||
    c.description.toLowerCase().includes(q)
  )
})

const getControlProgress = (controlNumber) => {
  const safeguards = seedStore.getSafeguardsByControl(controlNumber)
  return projectStore.getProgress(safeguards)
}

const goToControl = (number) => {
  router.push(`/controls/${number}`)
}

const globalProgress = computed(() => projectStore.getProgress(seedStore.safeguards))
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <!-- Header Summary -->
    <header class="mb-12">
      <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-2">Evaluación de Controles</h1>
          <p class="text-slate-500">Avance global basado en el target <span class="font-bold text-primary-600">{{ projectStore.project?.igTarget }}</span></p>
        </div>
        
        <div class="flex flex-wrap gap-4 items-center">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar control..." 
              class="input pl-10 w-full md:w-64"
            />
          </div>
          
          <button 
            @click="prefsStore.showOutsideTarget = !prefsStore.showOutsideTarget"
            class="btn-secondary px-4"
            :title="prefsStore.showOutsideTarget ? 'Ocultar salvaguardas fuera del target' : 'Mostrar todas las salvaguardas'"
          >
            <Eye v-if="!prefsStore.showOutsideTarget" :size="18" class="mr-2" />
            <EyeOff v-else :size="18" class="mr-2" />
            {{ prefsStore.showOutsideTarget ? 'Ver Scope Target' : 'Ver Todo' }}
          </button>
        </div>
      </div>

      <!-- Global Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card p-6 bg-primary-600 text-white border-none">
          <div class="text-sm font-bold opacity-80 uppercase tracking-wider mb-1">Cumplimiento Global</div>
          <div class="text-4xl font-black mb-4">{{ globalProgress.percent }}%</div>
          <div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white transition-all duration-700" :style="{ width: `${globalProgress.percent}%` }"></div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Salvaguardas en Scope</div>
          <div class="text-3xl font-bold text-slate-900 dark:text-white">{{ globalProgress.total }}</div>
          <div class="text-xs text-slate-500 mt-2">Target: {{ projectStore.project?.igTarget }}</div>
        </div>

        <div class="card p-6">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Implementadas</div>
          <div class="text-3xl font-bold text-green-600">{{ globalProgress.implemented }}</div>
          <div class="text-xs text-slate-500 mt-2">Cumplimiento total</div>
        </div>

        <div class="card p-6">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Evaluadas</div>
          <div class="text-3xl font-bold text-primary-600">{{ globalProgress.assessed }} / {{ globalProgress.total }}</div>
          <div class="text-xs text-slate-500 mt-2">{{ Math.round((globalProgress.assessed / globalProgress.total) * 100) }}% del total</div>
        </div>
      </div>
    </header>

    <!-- Controls Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="control in filteredControls" 
        :key="control.number"
        @click="goToControl(control.number)"
        class="card card-hover cursor-pointer p-6 flex flex-col group"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-black text-slate-600 dark:text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
            {{ control.number.toString().padStart(2, '0') }}
          </div>
          <div class="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 uppercase">
            {{ getControlProgress(control.number).implemented }} / {{ getControlProgress(control.number).total }}
          </div>
        </div>
        
        <h3 class="font-bold text-lg mb-2 leading-tight group-hover:text-primary-600 transition-colors">
          {{ control.name }}
        </h3>
        
        <p class="text-sm text-slate-500 line-clamp-2 mb-6 flex-grow">
          {{ control.description }}
        </p>

        <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Avance</span>
            <span class="text-xs font-black text-primary-600">{{ getControlProgress(control.number).percent }}%</span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary-500 transition-all duration-500" 
              :style="{ width: `${getControlProgress(control.number).percent}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
