// Client API centralisé pour le backend OpenDev Mada
// Respecte la règle JS du projet: pas de point-virgule et commentaires clairs

// URL de base du backend (adapter le port si nécessaire)
const API_BASE = 'http://localhost:2001/api/opendevmada'

// Préfixe pour servir les images stockées côté backend
const IMG_BASE = 'http://localhost:2001/public/'

// Fonction utilitaire: effectue un fetch JSON avec gestion d'erreur
async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, options)
    const data = await res.json()
    return { ok: res.ok, data }
  } catch (e) {
    console.error('Erreur réseau/API', e)
    return { ok: false, data: null }
  }
}

// Récupérer la liste des membres
async function fetchMembers() {
  const { ok, data } = await fetchJSON(`${API_BASE}/membres`)
  if (!ok || !data || data.status !== 'success') return []
  return Array.isArray(data.data) ? data.data : []
}

// Récupérer un membre par ID
async function fetchMember(id) {
  const { ok, data } = await fetchJSON(`${API_BASE}/membre/${id}`)
  if (!ok || !data || data.status !== 'success') return null
  return data.data || null
}

// Construire l'URL d'image complète à partir du chemin renvoyé par le backend
function imageUrl(path) {
  if (!path) return 'https://via.placeholder.com/128x128?text=OD'
  // Les images sont stockées dans backend/public/images/... et le backend peut les servir via /public/...
  return `${IMG_BASE}${path}`
}

// Exposer un namespace global pour utilisation simple côté pages HTML
window.ODMApi = {
  API_BASE,
  IMG_BASE,
  fetchMembers,
  fetchMember,
  imageUrl
}

// Créer un membre (multipart/form-data)
async function createMember(formData) {
  try {
    const res = await fetch(`${API_BASE}/membre-create`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Erreur création membre', e)
    return { status: 'error', message: 'Erreur réseau' }
  }
}

// Supprimer un membre
async function deleteMember(id) {
  try {
    const res = await fetch(`${API_BASE}/membre-delete/${id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Erreur suppression membre', e)
    return { status: 'error', message: 'Erreur réseau' }
  }
}

// Étendre le namespace après définition
window.ODMApi.createMember = createMember
window.ODMApi.deleteMember = deleteMember

// Mettre à jour un membre (multipart/form-data)
async function updateMember(id, formData) {
  try {
    const res = await fetch(`${API_BASE}/membre-update/${id}`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Erreur mise à jour membre', e)
    return { status: 'error', message: 'Erreur réseau' }
  }
}

window.ODMApi.updateMember = updateMember
