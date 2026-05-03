import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const usePrefsStore = defineStore('prefs', () => {
  const theme = ref(localStorage.getItem('cisv81-theme') || 'system')
  const showOutsideTarget = ref(localStorage.getItem('cisv81-showOutsideTarget') === 'true')
  const locale = ref('es')

  watch(theme, (newTheme) => {
    localStorage.setItem('cisv81-theme', newTheme)
    applyTheme()
  })

  watch(showOutsideTarget, (val) => {
    localStorage.setItem('cisv81-showOutsideTarget', val)
  })

  function applyTheme() {
    const isDark = theme.value === 'dark' || 
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    if (theme.value === 'light') theme.value = 'dark'
    else if (theme.value === 'dark') theme.value = 'system'
    else theme.value = 'light'
  }

  return {
    theme,
    showOutsideTarget,
    locale,
    applyTheme,
    toggleTheme
  }
})
