<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSeedStore } from '@/stores/seed'
import { useProjectStore } from '@/stores/project'
import { usePrefsStore } from '@/stores/prefs'
import { ChevronLeft, ChevronRight, Edit3, ShieldAlert, CircleCheck, Circle, Clock, MinusCircle, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const seedStore = useSeedStore()
const projectStore = useProjectStore()
const prefsStore = usePrefsStore()

const controlNumber = computed(() => parseInt(route.params.number))
const control = computed(() => seedStore.getControl(controlNumber.value))
const allSafeguards = computed(() => seedStore.getSafeguardsByControl(controlNumber.value))

const target = computed(() => projectStore.project?.igTarget)

const isInBuffer = (igLevel) => {
  if (target.value === 'IG1') return igLevel === 'IG1'
  if (target.value === 'IG2') return igLevel === 'IG1' || igLevel === 'IG2'
  return true // IG3
}

const filteredSafeguards = computed(() => {
  if (prefsStore.showOutsideTarget) return allSafeguards.value
  return allSafeguards.value.filter(s => isInBuffer(s.igLevel))
})

const getStatus = (id) => projectStore.getEvaluation(id).status

const statusMap = {
  not_assessed: { label: 'No Evaluado', color: 'text-slate-400', icon: Circle },
  implemented: { label: 'Cumple', color: 'text-green-500', icon: CircleCheck },
  partially_implemented: { label: 'Parcial', color: 'text-yellow-500', icon: Clock },
  not_implemented: { label: 'No Cumple', color: 'text-red-500', icon: ShieldAlert },
  not_applicable: { label: 'N/A', color: 'text-blue-400', icon: MinusCircle },
  risk_accepted: { label: 'Riesgo Aceptado', color: 'text-orange-500', icon: AlertCircle },
  planned: { label: 'Planeado', color: 'text-purple-500', icon: Clock },
}

const editSafeguard = (id) => {
  router.push(`/safeguards/${id}`)
}
</script>

<template>
  <div v-if="control" class="max-w-7xl mx-auto px-6 py-10">
    <nav class="mb-8">
      <button @click="router.push('/controls')" class="flex items-center text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
        <ChevronLeft :size="20" class="mr-1" />
        Volver a Controles
      </button>
    </nav>

    <header class="mb-12">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-600/20">
          {{ control.number.toString().padStart(2, '0') }}
        </div>
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ control.name }}</h1>
          <p class="text-slate-500 font-medium">Salvaguardas CIS v8.1</p>
        </div>
      </div>
      <div class="card p-6 bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed italic">
          "{{ control.description }}"
        </p>
      </div>
    </header>

    <!-- Safeguards List -->
    <div class="space-y-4">
      <div 
        v-for="s in filteredSafeguards" 
        :key="s.id"
        class="card p-6 flex flex-col md:flex-row md:items-center gap-6 group transition-all duration-300"
        :class="[!isInBuffer(s.igLevel) ? 'opacity-60 grayscale-[0.5]' : '', 'hover:border-primary-300 dark:hover:border-primary-800']"
      >
        <div class="flex-grow">
          <div class="flex flex-wrap items-center gap-3 mb-2">
            <span class="font-black text-lg text-primary-600">{{ s.id }}</span>
            <div class="flex gap-2">
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">
                {{ s.igLevel }}
              </span>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">
                {{ s.assetType }}
              </span>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">
                {{ s.securityFunction }}
              </span>
            </div>
            <div v-if="!isInBuffer(s.igLevel)" class="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/30 uppercase tracking-tighter">
              Fuera de Target ({{ target }})
            </div>
          </div>
          <h4 class="font-bold text-slate-900 dark:text-white mb-2">{{ s.title }}</h4>
          <p class="text-sm text-slate-500 line-clamp-2">{{ s.description }}</p>
        </div>

        <div class="flex items-center justify-between md:justify-end gap-6 min-w-[240px]">
          <div class="flex items-center gap-2">
            <component :is="statusMap[getStatus(s.id)].icon" :size="20" :class="statusMap[getStatus(s.id)].color" />
            <span class="text-sm font-bold uppercase tracking-wider" :class="statusMap[getStatus(s.id)].color">
              {{ statusMap[getStatus(s.id)].label }}
            </span>
          </div>

          <button @click="editSafeguard(s.id)" class="btn-secondary p-3 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all">
            <Edit3 :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
