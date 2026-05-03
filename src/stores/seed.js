import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSeedStore = defineStore('seed', () => {
  const controls = ref([])
  const safeguards = ref([])
  const metadata = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function loadSeed() {
    if (controls.value.length > 0) return

    loading.value = true
    try {
      // In a real file:// environment, we might need to fetch or bundle these
      const controlsRes = await fetch('./seed/controls.json')
      const safeguardsRes = await fetch('./seed/safeguards.json')
      
      const controlsData = await controlsRes.json()
      const safeguardsData = await safeguardsRes.json()

      controls.value = controlsData.controls
      safeguards.value = safeguardsData.safeguards
      metadata.value = {
        seedVersion: controlsData.seedVersion,
        frameworkVersion: controlsData.frameworkVersion,
        attribution: controlsData.attribution,
        license: controlsData.license
      }
    } catch (err) {
      console.error('Error loading seed data:', err)
      error.value = 'No se pudo cargar la base de datos de CIS Controls.'
    } finally {
      loading.value = false
    }
  }

  function getControl(number) {
    return controls.value.find(c => c.number === parseInt(number))
  }

  function getSafeguard(id) {
    return safeguards.value.find(s => s.id === id)
  }

  function getSafeguardsByControl(controlNumber) {
    return safeguards.value.filter(s => s.controlNumber === parseInt(controlNumber))
  }

  return {
    controls,
    safeguards,
    metadata,
    loading,
    error,
    loadSeed,
    getControl,
    getSafeguard,
    getSafeguardsByControl
  }
})
