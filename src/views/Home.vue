<script setup>
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { Rocket, ShieldCheck, FileJson, BookOpen, ExternalLink, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const projectStore = useProjectStore()

const startNew = () => {
  router.push('/setup')
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-12 md:py-20">
    <!-- Hero Section -->
    <header class="text-center mb-16 animate-fade-in">
      <div class="inline-flex items-center justify-center p-3 mb-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl">
        <ShieldCheck :size="40" />
      </div>
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
        CIS Controls v8.1 <span class="text-primary-600">Compliance Tracker</span>
      </h1>
      <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
        Herramienta profesional para el seguimiento, evaluación y reporte del cumplimiento de los Controles Críticos de Seguridad de CIS.
      </p>
      
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <button @click="startNew" class="btn-primary text-lg px-8 py-4">
          Comenzar Evaluación
          <Rocket class="ml-2" :size="20" />
        </button>
      </div>
    </header>

    <!-- Bento Grid Info Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
      <div class="card p-8 md:col-span-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <BookOpen class="mr-3 text-primary-500" />
          ¿Qué son los CIS Controls?
        </h2>
        <div class="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            Los CIS Critical Security Controls® son un conjunto prioritario de buenas prácticas de ciberseguridad que se utilizan para mitigar los ciberataques más comunes contra sistemas y redes.
          </p>
          <p>
            La versión 8.1 (publicada en 2024) incluye 18 Controles y 153 Salvaguardas, diseñados a partir de datos reales de ataques. Esta herramienta le permite llevar un seguimiento granular de su implementación.
          </p>
        </div>
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div class="text-2xl font-bold text-primary-600">18</div>
            <div class="text-xs uppercase tracking-wider font-semibold text-slate-500">Controles</div>
          </div>
          <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div class="text-2xl font-bold text-primary-600">153</div>
            <div class="text-xs uppercase tracking-wider font-semibold text-slate-500">Salvaguardas</div>
          </div>
          <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div class="text-2xl font-bold text-primary-600">6</div>
            <div class="text-xs uppercase tracking-wider font-semibold text-slate-500">Funciones</div>
          </div>
          <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div class="text-2xl font-bold text-primary-600">7</div>
            <div class="text-xs uppercase tracking-wider font-semibold text-slate-500">Activos</div>
          </div>
        </div>
      </div>

      <div class="card p-8 flex flex-col justify-between border-primary-100 dark:border-primary-900/20 bg-primary-50/50 dark:bg-primary-950/10">
        <div>
          <h3 class="text-xl font-bold mb-3">Privacidad Total</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Esta aplicación es 100% "client-side". Sus datos no viajan a ningún servidor. Todo se almacena localmente en su navegador.
          </p>
        </div>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span class="text-sm font-medium">Local Storage</span>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span class="text-sm font-medium">Exportación JSON</span>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span class="text-sm font-medium">Cero Cookies</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Implementation Groups Section -->
    <section class="mb-20">
      <h2 class="text-3xl font-bold mb-8 text-center">Implementation Groups (IG)</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card p-8 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span class="text-6xl font-black">1</span>
          </div>
          <h3 class="text-xl font-bold mb-4 text-blue-600">IG1: Higiene Básica</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Higiene cibernética esencial. Diseñado para organizaciones pequeñas con recursos limitados.
          </p>
          <div class="text-3xl font-bold mb-2">56</div>
          <div class="text-xs uppercase text-slate-500 font-bold">Salvaguardas</div>
        </div>
        
        <div class="card p-8 relative overflow-hidden group border-primary-200 dark:border-primary-800">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span class="text-6xl font-black">2</span>
          </div>
          <h3 class="text-xl font-bold mb-4 text-primary-600">IG2: Recursos Moderados</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Para organizaciones que gestionan datos sensibles y tienen recursos dedicados a seguridad.
          </p>
          <div class="text-3xl font-bold mb-2">124</div>
          <div class="text-xs uppercase text-slate-500 font-bold">Salvaguardas (incl. IG1)</div>
        </div>

        <div class="card p-8 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span class="text-6xl font-black">3</span>
          </div>
          <h3 class="text-xl font-bold mb-4 text-indigo-600">IG3: Infraestructura Crítica</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Para organizaciones con datos altamente sensibles o sujetas a ataques dirigidos.
          </p>
          <div class="text-3xl font-bold mb-2">153</div>
          <div class="text-xs uppercase text-slate-500 font-bold">Salvaguardas (Total)</div>
        </div>
      </div>
    </section>

    <!-- Links Section -->
    <section class="mb-20 text-center">
      <h2 class="text-2xl font-bold mb-8">Recursos Oficiales</h2>
      <div class="flex flex-wrap justify-center gap-6">
        <a href="https://www.cisecurity.org/controls/v8-1" target="_blank" class="flex items-center text-primary-600 hover:underline font-medium">
          CIS Controls v8.1
          <ExternalLink class="ml-1" :size="16" />
        </a>
        <a href="https://www.cisecurity.org/insights/white-papers/cis-critical-security-controls-v8-1" target="_blank" class="flex items-center text-primary-600 hover:underline font-medium">
          White Paper v8.1
          <ExternalLink class="ml-1" :size="16" />
        </a>
        <a href="https://controls-assessment-specification.readthedocs.io/" target="_blank" class="flex items-center text-primary-600 hover:underline font-medium">
          CIS CAS Guide
          <ExternalLink class="ml-1" :size="16" />
        </a>
      </div>
    </section>
  </div>
</template>
