<script setup>
import { useSeedStore } from '@/stores/seed'

const seedStore = useSeedStore()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 print:bg-white print:border-none">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span class="font-bold text-lg tracking-tight">CIS Tracker</span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Herramienta independiente de seguimiento para CIS Critical Security Controls®. No afiliada oficialmente con Center for Internet Security, Inc.
          </p>
        </div>
        
        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Legal</span>
            <a href="https://www.cisecurity.org/terms-of-use-for-non-member-cis-products" target="_blank" class="text-sm hover:text-primary-600">Términos de uso CIS</a>
            <span class="text-sm text-slate-500">Licencia: CC BY-NC-ND 4.0</span>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Desarrollo</span>
            <span class="text-sm text-slate-500">v1.0.0 — Offline Edition</span>
            <span class="text-sm text-slate-500">&copy; {{ currentYear }} — Built with &hearts;</span>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-slate-100 dark:border-slate-800">
        <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
          <p class="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Based on CIS Critical Security Controls&reg; v8.1 &mdash; &copy; Center for Internet Security, Inc. 
            <br class="md:hidden" />
            <a href="https://www.cisecurity.org/controls/" target="_blank" class="text-primary-600 hover:underline inline-flex items-center ml-1">
              cisecurity.org/controls/
            </a>
          </p>
          <p class="text-[10px] text-slate-400 mt-2">
            Esta aplicación utiliza textos verbatim de los controles y salvaguardas de CIS bajo la licencia Creative Commons BY-NC-ND 4.0.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
