<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { Shield, Users, User, ClipboardList, ArrowRight, Building2, Lock } from 'lucide-vue-next'

const router = useRouter()
const projectStore = useProjectStore()

const isEditing = computed(() => !!projectStore.project)

const form = reactive({
  orgName: projectStore.project?.orgName || '',
  country: projectStore.project?.country || '',
  sector: projectStore.project?.sector || '',
  sizeApprox: projectStore.project?.sizeApprox || '',
  representative: { 
    name: projectStore.project?.representative?.name || '', 
    role: projectStore.project?.representative?.role || '', 
    email: projectStore.project?.representative?.email || '' 
  },
  auditor: { 
    name: projectStore.project?.auditor?.name || '', 
    email: projectStore.project?.auditor?.email || '', 
    consultancy: projectStore.project?.auditor?.consultancy || '', 
    logoBase64: projectStore.project?.auditor?.logoBase64 || '' 
  },
  igTarget: projectStore.project?.igTarget || 'IG1',
  systemScope: projectStore.project?.systemScope || '',
  notes: projectStore.project?.notes || ''
})

const password = ref('')

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 200 * 1024) {
    alert('El logo debe ser menor a 200KB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.auditor.logoBase64 = e.target.result
  }
  reader.readAsDataURL(file)
}

const submit = async () => {
  if (!form.orgName || !form.representative.name || !form.auditor.name || !form.systemScope) {
    alert('Por favor complete los campos obligatorios.')
    return
  }

  if (isEditing.value) {
    projectStore.updateProject(form)
    router.push('/controls')
  } else {
    if (!password.value) {
      alert('La contraseña es obligatoria para nuevos proyectos.')
      return
    }
    await projectStore.createProject(form, password.value)
    router.push('/controls')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">{{ isEditing ? 'Editar Configuración' : 'Configuración del Proyecto' }}</h1>
      <p class="text-slate-500">{{ isEditing ? 'Actualice los datos de la organización o el alcance del proyecto.' : 'Defina el alcance y los objetivos de la evaluación CIS Controls v8.1' }}</p>
    </div>

    <form @submit.prevent="submit" class="space-y-8">
      <!-- Organizacion -->
      <section class="card p-8">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <Building2 class="text-primary-500" :size="24" />
          Organización en Evaluación
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre de la Organización *</label>
            <input v-model="form.orgName" type="text" class="input" placeholder="Ej. Acme Corp" required />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">País / Región</label>
            <input v-model="form.country" type="text" class="input" placeholder="Ej. México" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Sector</label>
            <input v-model="form.sector" type="text" class="input" placeholder="Ej. Financiero" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Tamaño Aproximado</label>
            <input v-model="form.sizeApprox" type="text" class="input" placeholder="Ej. 100-500 empleados" />
          </div>
        </div>
      </section>

      <!-- Representante -->
      <section class="card p-8">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <Users class="text-primary-500" :size="24" />
          Representante de la Organización
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre Completo *</label>
            <input v-model="form.representative.name" type="text" class="input" required />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Cargo / Rol</label>
            <input v-model="form.representative.role" type="text" class="input" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
            <input v-model="form.representative.email" type="email" class="input" />
          </div>
        </div>
      </section>

      <!-- Auditor -->
      <section class="card p-8">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <User class="text-primary-500" :size="24" />
          Auditor / Consultor
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre del Auditor *</label>
            <input v-model="form.auditor.name" type="text" class="input" required />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Empresa Consultora</label>
            <input v-model="form.auditor.consultancy" type="text" class="input" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Logo del Auditor (Max 200KB)</label>
            <div class="flex items-center gap-4">
              <div v-if="form.auditor.logoBase64" class="w-12 h-12 rounded border p-1 bg-white">
                <img :src="form.auditor.logoBase64" class="w-full h-full object-contain" />
              </div>
              <input type="file" accept="image/*" @change="handleLogoUpload" class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
            </div>
          </div>
        </div>
      </section>

      <!-- IG Target -->
      <section class="card p-8 border-primary-100 dark:border-primary-900/30">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield class="text-primary-500" :size="24" />
          Implementation Group Target *
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label 
            class="relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200"
            :class="form.igTarget === 'IG1' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
          >
            <input v-model="form.igTarget" type="radio" value="IG1" class="absolute opacity-0" />
            <div class="font-bold text-lg mb-1">IG1</div>
            <div class="text-xs text-slate-500 leading-snug">Higiene cibernética esencial. 56 salvaguardas.</div>
          </label>
          
          <label 
            class="relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200"
            :class="form.igTarget === 'IG2' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
          >
            <input v-model="form.igTarget" type="radio" value="IG2" class="absolute opacity-0" />
            <div class="font-bold text-lg mb-1">IG2</div>
            <div class="text-xs text-slate-500 leading-snug">Recursos moderados. 124 salvaguardas.</div>
          </label>

          <label 
            class="relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200"
            :class="form.igTarget === 'IG3' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
          >
            <input v-model="form.igTarget" type="radio" value="IG3" class="absolute opacity-0" />
            <div class="font-bold text-lg mb-1">IG3</div>
            <div class="text-xs text-slate-500 leading-snug">Infraestructura crítica. 153 salvaguardas.</div>
          </label>
        </div>
      </section>

      <!-- Seguridad -->
      <section v-if="!isEditing" class="card p-8 border-primary-100 dark:border-primary-900/30">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <Lock class="text-primary-500" :size="24" />
          Seguridad del Proyecto *
        </h2>
        <div class="space-y-4">
          <!-- Hidden username for accessibility -->
          <input type="text" name="username" :value="form.orgName" autocomplete="username" class="hidden" aria-hidden="true" />
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Contraseña de Cifrado</label>
            <input v-model="password" type="password" class="input" placeholder="Ingrese una contraseña para proteger sus datos" required autocomplete="new-password" />
            <p class="text-[10px] text-slate-500 italic">
              Esta contraseña se utiliza para cifrar los datos en su navegador. No la olvide, ya que no se puede recuperar.
            </p>
          </div>
        </div>
      </section>

      <!-- Scope -->
      <section class="card p-8">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <ClipboardList class="text-primary-500" :size="24" />
          Alcance del Sistema *
        </h2>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Descripción de los activos y sistemas en alcance</label>
            <textarea v-model="form.systemScope" class="input min-h-[120px] resize-none" placeholder="Ej. Todos los sistemas internos, red corporativa y servicios en la nube (AWS/Azure) que gestionan datos de clientes..." required></textarea>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Notas Adicionales</label>
            <textarea v-model="form.notes" class="input min-h-[80px] resize-none" placeholder="Cualquier otra observación relevante para el proyecto..."></textarea>
          </div>
        </div>
      </section>

      <div class="flex justify-end gap-4 pt-6">
        <button v-if="isEditing" type="button" @click="router.back()" class="btn-secondary px-8 py-4">Cancelar</button>
        <button type="submit" class="btn-primary text-lg px-10 py-4">
          {{ isEditing ? 'Guardar Cambios' : 'Comenzar Evaluación' }}
          <ArrowRight class="ml-2" :size="20" />
        </button>
      </div>
    </form>
  </div>
</template>
