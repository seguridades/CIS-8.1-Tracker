import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { encrypt, decrypt, hashPassword } from '@/lib/crypto'
import { clearDB } from '@/lib/db'

export const useProjectStore = defineStore('project', () => {
  const project = ref(null)
  const evaluations = ref({})
  const lastSavedAt = ref(null)
  const exportedAt = ref(null)
  const sessionPassword = ref(null)
  const isLocked = ref(false)
  const passwordHash = ref(localStorage.getItem('cisv81-auth-hash'))

  // Initialization
  function init() {
    const hasData = !!localStorage.getItem('cisv81-project')
    if (hasData) {
      isLocked.value = true
    }
  }

  async function unlock(password) {
    const encryptedData = localStorage.getItem('cisv81-project')
    if (!encryptedData) return true

    try {
      const decrypted = await decrypt(encryptedData, password)
      const data = JSON.parse(decrypted)
      
      project.value = data.project
      evaluations.value = data.evaluations || {}
      lastSavedAt.value = data.lastSavedAt
      exportedAt.value = data.exportedAt
      sessionPassword.value = password
      isLocked.value = false
      return true
    } catch (e) {
      throw new Error('Contraseña incorrecta')
    }
  }

  // Persistence logic (autosave with debounce)
  let saveTimeout = null
  function save() {
    if (!sessionPassword.value && !project.value) return // Don't save if not initialized or unlocked

    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
      const data = {
        schemaVersion: 1,
        project: project.value,
        evaluations: evaluations.value,
        lastSavedAt: new Date().toISOString(),
        exportedAt: exportedAt.value
      }

      if (sessionPassword.value) {
        const encrypted = await encrypt(JSON.stringify(data), sessionPassword.value)
        localStorage.setItem('cisv81-project', encrypted)
        
        // Save a hash of the password to verify on future sessions
        const hash = await hashPassword(sessionPassword.value)
        localStorage.setItem('cisv81-auth-hash', hash)
        passwordHash.value = hash
      } else {
        // Fallback for non-encrypted (should not happen with new logic but for safety during dev)
        localStorage.setItem('cisv81-project', JSON.stringify(data))
      }
      
      lastSavedAt.value = data.lastSavedAt
    }, 500)
  }

  // Actions
  async function createProject(newProject, password) {
    project.value = {
      ...newProject,
      startedAt: new Date().toISOString().split('T')[0]
    }
    evaluations.value = {}
    sessionPassword.value = password
    isLocked.value = false
    
    // Save hash immediately
    const hash = await hashPassword(password)
    localStorage.setItem('cisv81-auth-hash', hash)
    passwordHash.value = hash
    
    save()
  }

  function updateProject(updatedProject) {
    project.value = { ...project.value, ...updatedProject }
    save()
  }

  function resetProject() {
    project.value = null
    evaluations.value = {}
    sessionPassword.value = null
    isLocked.value = false
    localStorage.removeItem('cisv81-project')
    localStorage.removeItem('cisv81-auth-hash')
    clearDB()
  }

  function markAsExported() {
    exportedAt.value = new Date().toISOString()
    save()
  }

  function updateEvaluation(safeguardId, evaluationData) {
    evaluations.value[safeguardId] = {
      ...(evaluations.value[safeguardId] || {}),
      ...evaluationData,
      updatedAt: new Date().toISOString()
    }
    save()
  }

  function getEvaluation(safeguardId) {
    return evaluations.value[safeguardId] || {
      status: 'not_assessed',
      maturity: { policy: 0, implementation: 0, automation: 0, reporting: 0 },
      implementationNotes: '',
      gapNotes: '',
      naJustification: '',
      riskAcceptedJustification: '',
      evidenceRefs: [],
      remediation: []
    }
  }

  // Progress logic
  const isProjectActive = computed(() => !!project.value)
  
  function getProgress(allSafeguards) {
    if (!project.value) return { total: 0, completed: 0, percent: 0 }
    
    const target = project.value.igTarget // IG1, IG2, IG3
    const inScope = allSafeguards.filter(s => {
      if (target === 'IG1') return s.igLevel === 'IG1'
      if (target === 'IG2') return s.igLevel === 'IG1' || s.igLevel === 'IG2'
      return true // IG3
    })

    let totalScore = 0
    let assessedCount = 0

    inScope.forEach(s => {
      const ev = evaluations.value[s.id]
      if (!ev || ev.status === 'not_assessed') return

      assessedCount++
      
      if (ev.status === 'implemented') {
        totalScore += 1
      } else if (ev.status === 'partially_implemented') {
        // If maturity levels are set, use them. Otherwise fallback to 0.5
        const m = ev.maturity || { policy: 0, implementation: 0, automation: 0, reporting: 0 }
        const mScore = (m.policy + m.implementation + m.automation + m.reporting) / 4
        totalScore += mScore > 0 ? mScore : 0.5
      } else if (ev.status === 'not_implemented') {
        totalScore += 0
      } else if (ev.status === 'not_applicable' || ev.status === 'risk_accepted') {
        // These don't count towards the score (neither in total nor in achieved)
        // or they count as 100% of their "reduced" scope? 
        // Standard CIS: N/A items are excluded from denominator.
      }
    })

    // Adjust denominator for N/A and Risk Accepted
    const adjustedTotal = inScope.filter(s => {
      const ev = evaluations.value[s.id]
      return !ev || (ev.status !== 'not_applicable' && ev.status !== 'risk_accepted')
    }).length

    const percent = adjustedTotal > 0 ? Math.round((totalScore / adjustedTotal) * 100) : 0

    return {
      total: inScope.length,
      adjustedTotal,
      score: totalScore,
      percent: percent,
      assessed: assessedCount
    }
  }

  return {
    project,
    evaluations,
    lastSavedAt,
    exportedAt,
    sessionPassword,
    isLocked,
    passwordHash,
    isProjectActive,
    init,
    unlock,
    save,
    createProject,
    updateProject,
    resetProject,
    markAsExported,
    updateEvaluation,
    getEvaluation,
    getProgress
  }
})
