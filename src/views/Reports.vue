<script setup>
import { ref, computed } from 'vue'
import { useSeedStore } from '@/stores/seed'
import { useProjectStore } from '@/stores/project'
import { BarChart3, FileText, LayoutList, Download, Printer, AlertTriangle, CheckCircle2 } from 'lucide-vue-next'

const seedStore = useSeedStore()
const projectStore = useProjectStore()

const activeTab = ref('dashboard')

const progress = computed(() => projectStore.getProgress(seedStore.safeguards))

const functions = ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover']
const assets = ['Devices', 'Users', 'Applications', 'Data', 'Networks', 'Software', 'Documentation']

const getHeatmapData = (func, asset) => {
  const filtered = seedStore.safeguards.filter(s => 
    s.securityFunction === func && 
    s.assetType === asset &&
    (projectStore.project?.igTarget === 'IG3' || 
     (projectStore.project?.igTarget === 'IG2' && (s.igLevel === 'IG1' || s.igLevel === 'IG2')) ||
     (projectStore.project?.igTarget === 'IG1' && s.igLevel === 'IG1'))
  )
  
  if (filtered.length === 0) return null
  
  const stats = projectStore.getProgress(filtered)
  return stats.percent
}

const remediationActions = computed(() => {
  const all = []
  Object.entries(projectStore.evaluations).forEach(([id, ev]) => {
    if (ev.remediation && ev.remediation.length > 0) {
      ev.remediation.forEach(r => {
        all.push({
          ...r,
          safeguardId: id,
          safeguardTitle: seedStore.getSafeguard(id)?.title
        })
      })
    }
  })
  return all
})

const print = () => {
  window.print()
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10 print:p-0">
    <div class="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 print:hidden">
      <div>
        <h1 class="text-3xl font-bold mb-2">Reportes y Dashboard</h1>
        <p class="text-slate-500">Visualice el estado de cumplimiento y planes de acción</p>
      </div>
      
      <div class="flex gap-2">
        <button @click="print" class="btn-secondary">
          <Printer :size="18" class="mr-2" />
          Imprimir / PDF
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-slate-200 dark:border-slate-800 mb-8 print:hidden">
      <button 
        @click="activeTab = 'dashboard'"
        class="px-6 py-4 text-sm font-bold border-b-2 transition-all"
        :class="activeTab === 'dashboard' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
      >
        <div class="flex items-center gap-2">
          <BarChart3 :size="18" />
          Dashboard Ejecutivo
        </div>
      </button>
      <button 
        @click="activeTab = 'remediation'"
        class="px-6 py-4 text-sm font-bold border-b-2 transition-all"
        :class="activeTab === 'remediation' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
      >
        <div class="flex items-center gap-2">
          <LayoutList :size="18" />
          Plan de Remediación
          <span v-if="remediationActions.length > 0" class="ml-1 px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-[10px] rounded-full">
            {{ remediationActions.length }}
          </span>
        </div>
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-if="activeTab === 'dashboard'" class="space-y-10">
      <!-- Main KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section class="card p-8 flex flex-col items-center text-center">
          <div class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Cumplimiento Global</div>
          <div class="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg class="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="70" class="stroke-slate-100 dark:stroke-slate-800 fill-none stroke-[12]" />
              <circle 
                cx="80" cy="80" r="70" 
                class="stroke-primary-500 fill-none stroke-[12] transition-all duration-1000" 
                :stroke-dasharray="440" 
                :stroke-dashoffset="440 - (440 * progress.percent) / 100"
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-black">{{ progress.percent }}%</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase">{{ projectStore.project?.igTarget }}</span>
            </div>
          </div>
          <div class="text-xs text-slate-500">
            {{ progress.implemented }} de {{ progress.total }} salvaguardas implementadas
          </div>
        </section>

        <section class="card p-8 md:col-span-2">
          <h3 class="text-lg font-bold mb-6">Distribución por Control</h3>
          <div class="space-y-4 max-h-[300px] overflow-y-auto pr-4">
            <div v-for="c in seedStore.controls" :key="c.number" class="space-y-1">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-slate-700 dark:text-slate-300">{{ c.number }}. {{ c.name }}</span>
                <span class="font-black text-primary-600">{{ projectStore.getProgress(seedStore.getSafeguardsByControl(c.number)).percent }}%</span>
              </div>
              <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary-500 transition-all duration-500" 
                  :style="{ width: `${projectStore.getProgress(seedStore.getSafeguardsByControl(c.number)).percent}%` }"
                ></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Heatmap -->
      <section class="card p-8 overflow-x-auto">
        <h3 class="text-lg font-bold mb-6">Mapa de Calor: Función vs Activo</h3>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase text-slate-400">Activo / Función</th>
              <th v-for="f in functions" :key="f" class="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase text-slate-400">
                {{ f }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in assets" :key="a">
              <td class="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase text-slate-500">
                {{ a }}
              </td>
              <td v-for="f in functions" :key="f" class="p-2 border border-slate-200 dark:border-slate-800 text-center relative h-16 w-24">
                <div v-if="getHeatmapData(f, a) !== null" class="absolute inset-0 flex items-center justify-center font-bold text-sm"
                  :class="[
                    getHeatmapData(f, a) >= 80 ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                    getHeatmapData(f, a) >= 50 ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                    'bg-red-500/20 text-red-700 dark:text-red-400'
                  ]"
                >
                  {{ getHeatmapData(f, a) }}%
                </div>
                <div v-else class="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700 italic text-[10px]">
                  N/A
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Remediation Content -->
    <div v-if="activeTab === 'remediation'" class="space-y-6">
      <div v-if="remediationActions.length === 0" class="card p-20 text-center">
        <CheckCircle2 :size="48" class="mx-auto text-green-500 mb-4 opacity-20" />
        <h3 class="text-xl font-bold mb-2">No hay acciones pendientes</h3>
        <p class="text-slate-500">Todas las salvaguardas evaluadas parecen estar en orden o no tienen acciones registradas.</p>
      </div>

      <div v-else class="card overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th class="px-6 py-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]">ID</th>
              <th class="px-6 py-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]">Acción</th>
              <th class="px-6 py-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]">Responsable</th>
              <th class="px-6 py-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]">Fecha</th>
              <th class="px-6 py-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="action in remediationActions" :key="action.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="px-6 py-4 font-bold text-primary-600">{{ action.safeguardId }}</td>
              <td class="px-6 py-4">
                <p class="font-bold mb-1">{{ action.action }}</p>
                <p class="text-[10px] text-slate-500 uppercase">{{ action.safeguardTitle }}</p>
              </td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{{ action.owner || '-' }}</td>
              <td class="px-6 py-4 text-slate-500">{{ action.targetDate || '-' }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider"
                  :class="{
                    'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400': action.status === 'open',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400': action.status === 'in_progress',
                    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400': action.status === 'resolved'
                  }"
                >
                  {{ action.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Printable Report (Always present but hidden unless printing) -->
    <div class="hidden print:block space-y-8">
      <header class="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <div v-if="projectStore.project?.auditor.logoBase64" class="h-16 mb-4">
            <img :src="projectStore.project.auditor.logoBase64" class="h-full object-contain" />
          </div>
          <h1 class="text-4xl font-black uppercase tracking-tighter">Reporte de Cumplimiento</h1>
          <p class="text-lg font-bold text-slate-600">CIS Critical Security Controls&reg; v8.1</p>
        </div>
        <div class="text-right">
          <p class="font-bold">{{ projectStore.project?.orgName }}</p>
          <p class="text-sm text-slate-500">IG Target: {{ projectStore.project?.igTarget }}</p>
          <p class="text-sm text-slate-500">Fecha: {{ new Date().toLocaleDateString() }}</p>
        </div>
      </header>

      <section class="grid grid-cols-2 gap-8 mb-12">
        <div class="space-y-4">
          <h2 class="text-xl font-bold uppercase border-b border-slate-200 pb-2">Información del Proyecto</h2>
          <div class="grid grid-cols-2 gap-y-2 text-sm">
            <span class="font-bold">Auditor:</span> <span>{{ projectStore.project?.auditor.name }}</span>
            <span class="font-bold">Representante:</span> <span>{{ projectStore.project?.representative.name }}</span>
            <span class="font-bold">Inicio:</span> <span>{{ projectStore.project?.startedAt }}</span>
          </div>
        </div>
        <div class="card p-6 bg-slate-50">
          <h2 class="text-center font-bold text-sm uppercase mb-4 tracking-widest">Cumplimiento Global</h2>
          <div class="text-6xl font-black text-center text-primary-600">{{ progress.percent }}%</div>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-xl font-bold uppercase border-b border-slate-200 pb-2">Resumen por Control</h2>
        <div class="grid grid-cols-2 gap-x-12 gap-y-4">
          <div v-for="c in seedStore.controls" :key="c.number" class="flex justify-between items-center text-xs py-1 border-b border-slate-100">
            <span class="font-medium">{{ c.number }}. {{ c.name }}</span>
            <span class="font-bold">{{ projectStore.getProgress(seedStore.getSafeguardsByControl(c.number)).percent }}%</span>
          </div>
        </div>
      </section>

      <footer class="mt-20 pt-8 border-t border-slate-200 text-center">
        <p class="text-xs text-slate-500 leading-relaxed italic">
          Based on CIS Critical Security Controls&reg; v8.1 — &copy; Center for Internet Security, Inc. cisecurity.org/controls/
        </p>
      </footer>
    </div>
  </div>
</template>
