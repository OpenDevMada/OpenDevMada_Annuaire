// Client API pour OpenDev Madagascar (frontend)
// - Pas de préfixe d'URL image: le backend renvoie une URL absolue
// - Fallback vers l'API distante si le backend local est indisponible

(function(){
  const isDevelopment = (
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost' ||
    window.location.protocol === 'file:'
  )

  const REMOTE_API_BASE = 'https://api-opendev-mada-members.vercel.app/api/opendevmada'
  const API_BASE = isDevelopment
    ? 'http://localhost:3000/api/opendevmada'
    : REMOTE_API_BASE

  const HEADERS = {
    'Accept': 'application/json'
  }

  const TIMEOUT = 10000

  async function fetchJSON(url, options = {}){
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), TIMEOUT)
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { ...HEADERS, ...(options.headers || {}) },
        signal: controller.signal,
        ...options
      })
      clearTimeout(t)
      const data = await res.json().catch(() => null)
      return { ok: res.ok, status: res.status, data }
    } catch(e){
      clearTimeout(t)
      return { ok: false, status: 0, data: null, error: e.message }
    }
  }

  // Membres
  async function fetchMembers(){
    let r = await fetchJSON(`${API_BASE}/membres`)
    if ((!r.ok || !r.data || r.data.status !== 'success') && API_BASE !== REMOTE_API_BASE){
      r = await fetchJSON(`${REMOTE_API_BASE}/membres`)
    }
    if (!r.ok || !r.data || r.data.status !== 'success'){
      throw new Error('Erreur API: liste des membres')
    }
    return Array.isArray(r.data.data) ? r.data.data : []
  }

  async function fetchMember(id){
    let r = await fetchJSON(`${API_BASE}/membre/${id}`)
    if ((!r.ok || !r.data || r.data.status !== 'success') && API_BASE !== REMOTE_API_BASE){
      r = await fetchJSON(`${REMOTE_API_BASE}/membre/${id}`)
    }
    if (!r.ok || !r.data || r.data.status !== 'success'){
      return null
    }
    return r.data.data || null
  }

  // Upload / CRUD (multipart)
  async function postForm(url, formData){
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), TIMEOUT)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: HEADERS,
        body: formData,
        signal: controller.signal
      })
      clearTimeout(t)
      const data = await res.json().catch(()=>null)
      return { ok: res.ok, data }
    } catch(e){
      clearTimeout(t)
      return { ok: false, data: null, error: e.message }
    }
  }

  async function createMember(formData){
    // Essaie API_BASE puis, hors dev uniquement, fallback vers REMOTE
    let r = await postForm(`${API_BASE}/membre-create`, formData)
    if ((!r.ok || !r.data || r.data.status !== 'success') && API_BASE !== REMOTE_API_BASE){
      if (!isDevelopment) {
        r = await postForm(`${REMOTE_API_BASE}/membre-create`, formData)
      }
    }
    return r
  }

  async function updateMember(id, formData){
    let r = await postForm(`${API_BASE}/membre-update/${id}`, formData)
    if ((!r.ok || !r.data || (r.data.status !== 'success' && r.data.status !== 'Succès')) && API_BASE !== REMOTE_API_BASE){
      if (!isDevelopment) {
        r = await postForm(`${REMOTE_API_BASE}/membre-update/${id}`, formData)
      }
    }
    return r
  }

  async function deleteMember(id){
    let r = await fetchJSON(`${API_BASE}/membre-delete/${id}`, { method: 'DELETE' })
    if ((!r.ok || !r.data) && API_BASE !== REMOTE_API_BASE){
      if (!isDevelopment) {
        r = await fetchJSON(`${REMOTE_API_BASE}/membre-delete/${id}`, { method: 'DELETE' })
      }
    }
    return { ok: r.ok, data: r.data }
  }

  // Images: retourner la valeur telle quelle (ou un placeholder)
  function imageUrl(path){
    if (!path) return 'https://via.placeholder.com/200x200?text=OpenDev'
    return String(path)
  }

  window.ODMApi = {
    fetchMembers,
    fetchMember,
    createMember,
    updateMember,
    deleteMember,
    imageUrl
  }

  console.log('OpenDevMada Front API prêt')
})()
