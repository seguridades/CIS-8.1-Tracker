<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSeedStore } from '@/stores/seed'
import { useProjectStore } from '@/stores/project'
import { ChevronLeft, ChevronRight, Save, X, Plus, Trash2, ShieldAlert, Info, Paperclip, Download as DownloadIcon } from 'lucide-vue-next'
import { saveAttachment, getAttachmentsBySafeguard, deleteAttachment } from '@/lib/db'

const route = useRoute()
const router = useRouter()
const seedStore = useSeedStore()
const projectStore = useProjectStore()

const id = computed(() => route.params.id)
const safeguard = computed(() => seedStore.getSafeguard(id.value))
const control = computed(() => safeguard.value ? seedStore.getControl(safeguard.value.controlNumber) : null)

const binaryAttachments = ref([])

const evaluation = ref({
  status: 'not_assessed',
  maturity: { policy: 0, implementation: 0, automation: 0, reporting: 0 },
  implementationNotes: '',
  gapNotes: '',
  naJustification: '',
  riskAcceptedJustification: '',
  evidenceRefs: [],
  remediation: []
})

onMounted(async () => {
  const existing = projectStore.getEvaluation(id.value)
  if (existing) {
    evaluation.value = JSON.parse(JSON.stringify(existing))
    if (!evaluation.value.maturity) {
      evaluation.value.maturity = { policy: 0, implementation: 0, automation: 0, reporting: 0 }
    }
  }
  
  // Load binary attachments
  binaryAttachments.value = await getAttachmentsBySafeguard(id.value)
})

const setMaturity = (key, val) => {
  evaluation.value.maturity[key] = val
}

const maturityOptions = [
  { label: 'Ninguno', value: 0, color: 'bg-slate-200 text-slate-600' },
  { label: 'Parcial', value: 0.5, color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Completo', value: 1, color: 'bg-green-100 text-green-700' }
]

const maturityFields = [
  { key: 'policy', label: 'Política y Documentación', desc: '¿Está formalmente definido?' },
  { key: 'implementation', label: 'Implementación Técnica', desc: '¿Está configurado y en uso?' },
  { key: 'automation', label: 'Automatización', desc: '¿Funciona sin intervención humana?' },
  { key: 'reporting', label: 'Métricas y Reporte', desc: '¿Se mide su efectividad?' }
]

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const attachmentId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : (Date.now() + Math.random().toString(36).substring(2))
    const newAttachment = await saveAttachment(attachmentId, file, id.value)
    binaryAttachments.value.push(newAttachment)
  } catch (err) {
    alert('Error al guardar el archivo: ' + err.message)
  }
}

const removeBinaryAttachment = async (attachmentId, index) => {
  if (confirm('¿Eliminar este adjunto?')) {
    try {
      await deleteAttachment(attachmentId)
      binaryAttachments.value.splice(index, 1)
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }
}

const downloadAttachment = (attachment) => {
  const url = URL.createObjectURL(attachment.data)
  const a = document.createElement('a')
  a.href = url
  a.download = attachment.name
  a.click()
  URL.revokeObjectURL(url)
}

const save = () => {
  if (evaluation.value.status === 'not_applicable' && !evaluation.value.naJustification) {
    alert('Debe proporcionar una justificación para el estado No Aplicable.')
    return
  }
  if (evaluation.value.status === 'risk_accepted' && !evaluation.value.riskAcceptedJustification) {
    alert('Debe proporcionar una justificación para el riesgo aceptado.')
    return
  }

  projectStore.updateEvaluation(id.value, evaluation.value)
  router.push(`/controls/${safeguard.value.controlNumber}`)
}

const addEvidence = () => {
  evaluation.value.evidenceRefs.push({ label: '', ref: '', notes: '' })
}

const removeEvidence = (index) => {
  evaluation.value.evidenceRefs.splice(index, 1)
}

const addRemediation = () => {
  evaluation.value.remediation.push({
    id: crypto.randomUUID(),
    action: '',
    owner: '',
    targetDate: '',
    status: 'open',
    resources: ''
  })
}

const removeRemediation = (index) => {
  evaluation.value.remediation.splice(index, 1)
}

const statuses = [
  { value: 'not_assessed', label: 'No Evaluado', color: 'bg-slate-400' },
  { value: 'implemented', label: 'Cumple', color: 'bg-green-500' },
  { value: 'partially_implemented', label: 'Parcialmente Implementado', color: 'bg-yellow-500' },
  { value: 'not_implemented', label: 'No Cumple', color: 'bg-red-500' },
  { value: 'not_applicable', label: 'No Aplicable', color: 'bg-blue-400' },
  { value: 'risk_accepted', label: 'Riesgo Aceptado', color: 'bg-orange-500' },
  { value: 'planned', label: 'Planeado', color: 'bg-purple-500' },
]

const target = computed(() => projectStore.project?.igTarget)
const isOutsideTarget = computed(() => {
  if (!safeguard.value) return false
  if (target.value === 'IG1') return safeguard.value.igLevel !== 'IG1'
  if (target.value === 'IG2') return safeguard.value.igLevel === 'IG3'
  return false
})
</script>

<template>
  <div v-if="safeguard" class="max-w-7xl mx-auto px-6 py-10">
    <nav class="mb-8 flex justify-between items-center">
      <button @click="router.push(`/controls/${safeguard.controlNumber}`)" class="flex items-center text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
        <ChevronLeft :size="20" class="mr-1" />
        Volver al Control {{ safeguard.controlNumber }}
      </button>
      <div class="flex gap-2">
        <button @click="router.push(`/controls/${safeguard.controlNumber}`)" class="btn-secondary px-6">Cancelar</button>
        <button @click="save" class="btn-primary px-8">
          <Save :size="18" class="mr-2" />
          Guardar Evaluación
        </button>
      </div>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Columna Izquierda: Referencia -->
      <aside class="lg:col-span-5 space-y-6">
        <section class="card p-8 bg-primary-600 text-white border-none shadow-xl shadow-primary-600/20">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl font-black">{{ safeguard.id }}</span>
            <div class="flex gap-1">
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-white/20 text-white uppercase">{{ safeguard.igLevel }}</span>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-white/20 text-white uppercase">{{ safeguard.assetType }}</span>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-white/20 text-white uppercase">{{ safeguard.securityFunction }}</span>
            </div>
          </div>
          <h1 class="text-xl font-bold mb-6 leading-tight">{{ safeguard.title }}</h1>
          <div class="p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
            <p class="text-sm font-medium leading-relaxed italic">
              {{ safeguard.description }}
            </p>
          </div>
        </section>

        <section v-if="isOutsideTarget" class="card p-6 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30">
          <div class="flex gap-3">
            <ShieldAlert class="text-amber-600 flex-shrink-0" />
            <div class="text-sm">
              <p class="font-bold text-amber-800 dark:text-amber-400 mb-1">Fuera de Target</p>
              <p class="text-amber-700 dark:text-amber-500/80">
                Este Safeguard aplica a partir de {{ safeguard.igLevel }}; su target es {{ target }}. 
                Su evaluación es opcional y no afecta el % de cumplimiento principal.
              </p>
            </div>
          </div>
        </section>

        <section class="card p-6 bg-slate-50 dark:bg-slate-900/50">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Info :size="14" />
            Contexto del Control
          </h3>
          <p class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{{ control?.name }}</p>
          <p class="text-xs text-slate-500 leading-relaxed">{{ control?.description }}</p>
        </section>
      </aside>

      <!-- Columna Derecha: Evaluación -->
      <div class="lg:col-span-7 space-y-8">
        <!-- Estado -->
        <section class="card p-8">
          <h2 class="text-lg font-bold mb-6">Estado de la Salvaguarda</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              v-for="s in statuses" 
              :key="s.value"
              @click="evaluation.status = s.value"
              class="flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200"
              :class="evaluation.status === s.value ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
            >
              <div class="w-4 h-4 rounded-full" :class="s.color"></div>
              <span class="text-sm font-bold">{{ s.label }}</span>
            </button>
          </div>
        </section>

        <!-- Niveles de Madurez -->
        <section v-if="evaluation.status === 'partially_implemented'" class="card p-8 animate-fade-in border-primary-100 dark:border-primary-900/30">
          <div class="flex items-center gap-2 mb-6">
            <h2 class="text-lg font-bold">Niveles de Madurez</h2>
            <span class="text-[10px] font-black px-2 py-0.5 bg-primary-600 text-white rounded uppercase">Auditoría Pro</span>
          </div>
          
          <div class="space-y-6">
            <div v-for="field in maturityFields" :key="field.key" class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div>
                <p class="text-sm font-bold">{{ field.label }}</p>
                <p class="text-[10px] text-slate-500 italic">{{ field.desc }}</p>
              </div>
              <div class="flex gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button 
                  v-for="opt in maturityOptions" 
                  :key="opt.value"
                  type="button"
                  @click="setMaturity(field.key, opt.value)"
                  class="px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all"
                  :class="evaluation.maturity[field.key] === opt.value ? opt.color : 'text-slate-400 hover:text-slate-600'"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
            
            <div class="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/30">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-primary-700 dark:text-primary-400">Puntuación Calculada</span>
                <span class="text-xl font-black text-primary-600">
                  {{ Math.round(((evaluation.maturity.policy + evaluation.maturity.implementation + evaluation.maturity.automation + evaluation.maturity.reporting) / 4) * 100) }}%
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Notas -->
        <section class="card p-8 space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-600 dark:text-slate-400">Notas de Implementación</label>
            <textarea v-model="evaluation.implementationNotes" class="input min-h-[100px] resize-none" placeholder="¿Cómo se está cumpliendo este control hoy?"></textarea>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-600 dark:text-slate-400">Gaps Identificados</label>
            <textarea v-model="evaluation.gapNotes" class="input min-h-[100px] resize-none" placeholder="¿Qué falta para cumplir plenamente?"></textarea>
          </div>
          
          <div v-if="evaluation.status === 'not_applicable'" class="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 animate-fade-in">
            <label class="text-sm font-bold text-blue-700 dark:text-blue-400">Justificación N/A *</label>
            <textarea v-model="evaluation.naJustification" class="input bg-white dark:bg-slate-900 min-h-[80px] resize-none" placeholder="¿Por qué no aplica este control a la organización?"></textarea>
          </div>

          <div v-if="evaluation.status === 'risk_accepted'" class="space-y-2 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/30 animate-fade-in">
            <label class="text-sm font-bold text-orange-700 dark:text-orange-400">Justificación de Riesgo Aceptado *</label>
            <textarea v-model="evaluation.riskAcceptedJustification" class="input bg-white dark:bg-slate-900 min-h-[80px] resize-none" placeholder="¿Por qué se decide aceptar el riesgo de no implementar este control?"></textarea>
          </div>
        </section>

        <!-- Evidencias -->
        <section class="card p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold">Referencias a Evidencias</h2>
            <button @click="addEvidence" class="btn-secondary py-2 px-4 text-xs font-bold">
              <Plus :size="14" class="mr-1" /> Agregar
            </button>
          </div>
          
          <div v-if="evaluation.evidenceRefs.length === 0" class="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p class="text-sm text-slate-500">No hay evidencias registradas.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="(ev, index) in evaluation.evidenceRefs" :key="index" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 relative group/ev">
              <button @click="removeEvidence(index)" class="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover/ev:opacity-100 transition-opacity">
                <Trash2 :size="16" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">Etiqueta</label>
                  <input v-model="ev.label" type="text" class="input text-sm py-1.5" placeholder="Ej. Inventario de Activos" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">Referencia / Ruta / URL</label>
                  <input v-model="ev.ref" type="text" class="input text-sm py-1.5" placeholder="Ej. /share/docs/inventario.pdf" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Adjuntos Binarios (IndexedDB) -->
        <section class="card p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold">Adjuntos (Evidencias)</h2>
            <label class="btn-secondary py-2 px-4 text-xs font-bold cursor-pointer">
              <Plus :size="14" class="mr-1" /> Subir Archivo
              <input type="file" class="hidden" @change="handleFileUpload" />
            </label>
          </div>

          <div v-if="binaryAttachments.length === 0" class="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p class="text-sm text-slate-500">No hay archivos adjuntos.</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="(att, index) in binaryAttachments" :key="att.id" class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center">
                  <Paperclip :size="18" />
                </div>
                <div>
                  <p class="text-sm font-bold truncate max-w-[200px]">{{ att.name }}</p>
                  <p class="text-[10px] text-slate-500">{{ (att.size / 1024).toFixed(1) }} KB · {{ new Date(att.createdAt).toLocaleDateString() }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="downloadAttachment(att)" class="p-2 text-slate-400 hover:text-primary-600 transition-colors" title="Descargar">
                  <DownloadIcon :size="18" />
                </button>
                <button @click="removeBinaryAttachment(att.id, index)" class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Eliminar">
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Remediación -->
        <section class="card p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold">Plan de Remediación</h2>
            <button @click="addRemediation" class="btn-secondary py-2 px-4 text-xs font-bold">
              <Plus :size="14" class="mr-1" /> Agregar Acción
            </button>
          </div>

          <div v-if="evaluation.remediation.length === 0" class="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p class="text-sm text-slate-500">No hay acciones de remediación planificadas.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="(rem, index) in evaluation.remediation" :key="rem.id" class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 relative group/rem">
              <button @click="removeRemediation(index)" class="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover/rem:opacity-100 transition-opacity">
                <Trash2 :size="16" />
              </button>
              <div class="space-y-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">Acción de Remediación</label>
                  <input v-model="rem.action" type="text" class="input text-sm" placeholder="Ej. Implementar herramienta de descubrimiento de activos" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase">Responsable</label>
                    <input v-model="rem.owner" type="text" class="input text-sm py-1.5" placeholder="Nombre/Rol" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase">Fecha Objetivo</label>
                    <input v-model="rem.targetDate" type="date" class="input text-sm py-1.5" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase">Estado</label>
                    <select v-model="rem.status" class="input text-sm py-1.5">
                      <option value="open">Abierto</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="risk_accepted">Riesgo Aceptado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
