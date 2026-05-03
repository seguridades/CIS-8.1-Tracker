<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { usePrefsStore } from '@/stores/prefs'
import { Trash2, AlertTriangle, Download, Upload, Shield, Lock, CheckCircle2, XCircle } from 'lucide-vue-next'

const router = useRouter()
const projectStore = useProjectStore()
const prefsStore = usePrefsStore()

const resetProject = () => {
  if (confirm('¿Está seguro de que desea borrar todos los datos del proyecto? Esta acción no se puede deshacer.')) {
    projectStore.resetProject()
    router.push('/')
  }
}

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

// ── Import flow (critical fix) ───────────────────────────────────
const pendingImport = ref(null)       // parsed JSON data waiting for password
const importPassword = ref('')
const importError = ref('')
const importSuccess = ref(false)
const importLoading = ref(false)

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return

  importError.value = ''
  importSuccess.value = false
  importPassword.value = ''

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.format !== 'cisv81-tracker-export') {
        importError.value = 'Formato de archivo inválido. Solo se aceptan exports de este sistema.'
        return
      }
      pendingImport.value = data
    } catch {
      importError.value = 'Error al leer el archivo. Asegúrese de que sea un JSON válido.'
    }
  }
  reader.readAsText(file)
}

const confirmImport = async () => {
  if (!pendingImport.value || !importPassword.value) return

  importLoading.value = true
  importError.value = ''

  try {
    await projectStore.importProject(
      pendingImport.value.project,
      pendingImport.value.evaluations,
      importPassword.value
    )
    importSuccess.value = true
    pendingImport.value = null
    importPassword.value = ''
    // Navigate to dashboard after a brief moment
    setTimeout(() => router.push('/controls'), 1500)
  } catch (err) {
    importError.value = 'Error al importar: ' + err.message
  } finally {
    importLoading.value = false
  }
}

const cancelImport = () => {
  pendingImport.value = null
  importPassword.value = ''
  importError.value = ''
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-bold mb-8">Configuración y Mantenimiento</h1>

    <div class="space-y-8">
      <!-- Apariencia -->
      <section class="card p-8">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield class="text-primary-500" :size="24" />
          Apariencia
        </h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-bold">Tema de la interfaz</p>
            <p class="text-sm text-slate-500">Cambie entre modo claro, oscuro o automático</p>
          </div>
          <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              v-for="mode in ['light', 'dark', 'system']" 
              :key="mode"
              @click="prefsStore.theme = mode"
              class="px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all"
              :class="prefsStore.theme === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'"
            >
              {{ mode === 'light' ? 'Claro' : mode === 'dark' ? 'Oscuro' : 'Auto' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Organización -->
      <section class="card p-8">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield class="text-primary-500" :size="24" />
          Datos de la Organización
        </h2>
        <div class="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div>
            <p class="font-bold">Información y Alcance</p>
            <p class="text-sm text-slate-500">Edite los datos de la organización, auditor o el alcance del proyecto.</p>
          </div>
          <button @click="router.push('/setup')" class="btn-secondary">
            Editar Configuración
          </button>
        </div>
      </section>

      <!-- Respaldo -->
      <section class="card p-8">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <Download class="text-primary-500" :size="24" />
          Respaldo y Portabilidad
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 class="font-bold mb-2">Exportar Evaluación</h3>
            <p class="text-xs text-slate-500 mb-6 leading-relaxed">
              Descargue un archivo JSON con todos los datos de su evaluación. Este es su único respaldo.
            </p>
            <button @click="exportJson" class="btn-primary w-full">
              <Download class="mr-2" :size="18" />
              Descargar JSON
            </button>
          </div>
          
          <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 class="font-bold mb-2">Importar Evaluación</h3>
            <p class="text-xs text-slate-500 mb-4 leading-relaxed">
              Cargue una evaluación previa. Los datos se re-cifrarán con la contraseña que indique.
            </p>

            <!-- Step 1: File selector (hidden when file is loaded) -->
            <label v-if="!pendingImport && !importSuccess" class="btn-secondary w-full cursor-pointer">
              <Upload class="mr-2" :size="18" />
              Seleccionar Archivo
              <input type="file" class="hidden" accept=".json" @change="onFileSelected" />
            </label>

            <!-- Step 2: Password confirmation panel -->
            <div v-if="pendingImport" class="space-y-3 animate-fade-in">
              <div class="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <Lock :size="14" />
                Archivo listo: <span class="font-normal truncate max-w-[140px]">{{ pendingImport.project?.orgName }}</span>
              </div>
              <input
                v-model="importPassword"
                type="password"
                class="input text-sm"
                placeholder="Ingrese una contraseña para re-cifrar"
                autocomplete="new-password"
              />
              <div class="flex gap-2">
                <button @click="confirmImport" :disabled="!importPassword || importLoading" class="btn-primary flex-1 py-2 text-sm">
                  <span v-if="importLoading">Importando...</span>
                  <span v-else>Confirmar Import</span>
                </button>
                <button @click="cancelImport" class="btn-secondary px-3 py-2">
                  <XCircle :size="16" />
                </button>
              </div>
            </div>

            <!-- Success state -->
            <div v-if="importSuccess" class="flex items-center gap-2 text-green-600 font-bold animate-fade-in text-sm">
              <CheckCircle2 :size="18" />
              ¡Importado! Redirigiendo...
            </div>

            <!-- Error message -->
            <p v-if="importError" class="mt-2 text-xs text-red-600 font-semibold animate-fade-in">{{ importError }}</p>
          </div>
        </div>
      </section>

      <!-- Zona de Peligro -->
      <section class="card p-8 border-red-100 dark:border-red-900/30">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-red-600">
          <AlertTriangle :size="24" />
          Zona de Peligro
        </h2>
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
          <div>
            <p class="font-bold text-red-800 dark:text-red-400">Reiniciar Proyecto</p>
            <p class="text-sm text-red-700/70 dark:text-red-500/60">Borra permanentemente todos los datos de la evaluación actual.</p>
          </div>
          <button @click="resetProject" class="btn bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20">
            <Trash2 class="mr-2" :size="18" />
            Borrar Todo
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
