<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { Lock, Unlock as UnlockIcon, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const projectStore = useProjectStore()

const password = ref('')
const error = ref('')
const loading = ref(false)

const handleUnlock = async () => {
  if (!password.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    await projectStore.unlock(password.value)
    router.push('/controls')
  } catch (e) {
    error.value = e.message
    password.value = ''
  } finally {
    loading.value = false
  }
}

const reset = () => {
  if (confirm('¿Está seguro? Se perderán todos los datos actuales. Esta acción no se puede deshacer.')) {
    projectStore.resetProject()
    router.push('/')
  }
}
</script>

<template>
  <!-- Backdrop blur overlay -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Blurred background -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>

    <!-- Modal card -->
    <div class="relative w-full max-w-md animate-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/30 border border-slate-200 dark:border-slate-800 overflow-hidden">

        <!-- Header gradient strip -->
        <div class="h-1.5 w-full bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>

        <div class="p-8 text-center">
          <!-- Icon -->
          <div class="inline-flex items-center justify-center w-16 h-16 mb-5 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl">
            <Lock v-if="!loading" :size="28" />
            <div v-else class="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Proyecto Bloqueado</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Ingrese su contraseña para desbloquear y acceder a la evaluación.
          </p>

          <form @submit.prevent="handleUnlock" class="space-y-4">
            <!-- Hidden username for accessibility -->
            <input type="text" name="username" value="auditor" autocomplete="username" class="hidden" aria-hidden="true" />
            
            <div class="relative">
              <input
                v-model="password"
                type="password"
                class="input w-full pr-12 py-3 text-center text-lg tracking-widest"
                placeholder="••••••••"
                required
                autofocus
                autocomplete="current-password"
              />
              <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600">
                <UnlockIcon :size="18" />
              </div>
            </div>

            <!-- Error message -->
            <div
              v-if="error"
              class="flex items-center justify-center gap-2 text-red-500 text-sm font-bold animate-fade-in py-2 px-4 bg-red-50 dark:bg-red-900/20 rounded-xl"
            >
              <AlertCircle :size="16" />
              {{ error }}
            </div>

            <button
              type="submit"
              class="btn-primary w-full py-3.5 text-base"
              :disabled="loading || !password"
            >
              <span v-if="!loading">Desbloquear</span>
              <span v-else>Verificando...</span>
              <ArrowRight v-if="!loading" class="ml-2" :size="18" />
            </button>
          </form>

          <!-- Divider & danger zone -->
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              @click="reset"
              class="text-xs font-semibold text-slate-400 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-widest transition-colors"
            >
              Olvidé mi contraseña / Borrar datos
            </button>
          </div>
        </div>

        <!-- Footer branding -->
        <div class="px-8 pb-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <ShieldCheck :size="12" />
          CIS Controls v8.1 Tracker · Cifrado AES-GCM
        </div>
      </div>
    </div>
  </div>
</template>
