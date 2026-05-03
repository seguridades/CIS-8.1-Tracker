<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { ShieldCheck, Lock, Unlock as UnlockIcon, ArrowRight, AlertCircle } from 'lucide-vue-next'

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
  } finally {
    loading.value = false
  }
}

const reset = () => {
  if (confirm('¿Está seguro? Se perderán todos los datos actuales.')) {
    projectStore.resetProject()
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
    <div class="card w-full max-w-md p-8 text-center animate-fade-in shadow-2xl shadow-primary-500/10">
      <div class="inline-flex items-center justify-center p-4 mb-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-3xl">
        <Lock v-if="!loading" :size="32" />
        <div v-else class="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <h1 class="text-2xl font-bold mb-2">Proyecto Bloqueado</h1>
      <p class="text-slate-500 text-sm mb-8 leading-relaxed">
        Los datos están cifrados. Ingrese su contraseña para desbloquear el proyecto.
      </p>

      <form @submit.prevent="handleUnlock" class="space-y-4">
        <!-- Hidden username for accessibility -->
        <input type="text" name="username" value="admin" autocomplete="username" class="hidden" aria-hidden="true" />
        <div class="relative">
          <input 
            v-model="password" 
            type="password" 
            class="input pr-12 py-3 text-center text-lg" 
            placeholder="Contraseña"
            required
            autofocus
            autocomplete="current-password"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <UnlockIcon :size="20" />
          </div>
        </div>

        <div v-if="error" class="flex items-center justify-center gap-2 text-red-500 text-sm font-bold animate-fade-in">
          <AlertCircle :size="16" />
          {{ error }}
        </div>

        <button type="submit" class="btn-primary w-full py-4 text-lg" :disabled="loading">
          Desbloquear
          <ArrowRight class="ml-2" :size="20" />
        </button>
      </form>

      <div class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
        <button @click="reset" class="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
          Olvidé mi contraseña / Borrar datos
        </button>
      </div>
    </div>
  </div>
</template>
