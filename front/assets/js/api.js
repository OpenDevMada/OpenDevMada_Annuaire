// API Hybride : utilise l'API réelle avec fallback sur données de test
// Cette version essaie l'API réelle d'abord, puis utilise les données mock en cas d'échec

// Configuration pour connexion avec le backend
const isDevelopment = window.location.hostname === '127.0.0.1' || 
                     window.location.hostname === 'localhost' ||
                     window.location.protocol === 'file:'

// Configuration des endpoints backend
const BACKEND_CONFIG = {
  // URL de l'API backend principale
  API_BASE: isDevelopment 
    ? 'http://localhost:8000/api/opendevmada'  // Backend local (PHP/Laravel ou Node.js)
    : 'https://opendevmadaannuaire.infinityfree.me/api/opendevmada',  // Production

  // URL des images/fichiers statiques
  IMG_BASE: isDevelopment
    ? 'http://localhost:8000/public/'  // Serveur local pour les images
    : 'https://opendevmadaannuaire.infinityfree.me/public/',

  // Configuration des en-têtes pour les requêtes
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },

  // Timeout pour les requêtes (en millisecondes)
  TIMEOUT: 10000
}

const API_BASE = BACKEND_CONFIG.API_BASE
const IMG_BASE = BACKEND_CONFIG.IMG_BASE

// Données de fallback enrichies (basées sur vos vraies données + données de test)
const FALLBACK_MEMBERS = [
  {
    id: 4,
    nom: "RADIMSON",
    prenom: "Landrosse",
    email: "landros00t@gmail.com",
    date_naissance: "2025-02-02",
    sexe: "Male",
    adresse: "Toamasina Tanamakoa",
    ville: "Toamasina",
    pays: "Madagascar",
    telephone: "0349626333",
    photo_profil: "images/RADIMSON/688e4c22e4f72_20241123_115936.jpg",
    date_inscription: "2025-08-02 10:34:26",
    role: "admin",
    statut: "Actif",
    poste: "Administrateur",
    experience: "Expert",
    competences: ["Administration", "Gestion de projet", "Leadership"],
    bio: "Administrateur principal de l'annuaire OpenDev Madagascar. Passionné par le développement de la communauté tech malgache."
  },
  {
    id: 1,
    nom: "Rakoto",
    prenom: "Jean",
    email: "jean.rakoto@opendev.mg",
    date_naissance: "1995-03-15",
    sexe: "Male",
    adresse: "Antananarivo Analakely",
    ville: "Antananarivo",
    pays: "Madagascar",
    telephone: "+261 34 12 345 67",
    photo_profil: "images/jean_rakoto.jpg",
    date_inscription: "2024-06-15 09:30:00",
    role: "membre",
    statut: "Actif",
    poste: "Développeur Full Stack",
    experience: "5 ans",
    competences: ["JavaScript", "React", "Node.js", "MongoDB", "HTML/CSS"],
    bio: "Développeur passionné par les technologies web modernes, j'aime créer des applications innovantes qui résolvent des problèmes concrets."
  },
  {
    id: 2,
    nom: "Rasoanirina",
    prenom: "Marie",
    email: "marie.rasoanirina@opendev.mg",
    date_naissance: "1992-08-22",
    sexe: "Female",
    adresse: "Antananarivo Itaosy",
    ville: "Antananarivo",
    pays: "Madagascar",
    telephone: "+261 34 55 888 99",
    photo_profil: "images/marie_rasoanirina.jpg",
    date_inscription: "2024-07-10 14:20:00",
    role: "membre",
    statut: "Actif",
    poste: "UX/UI Designer",
    experience: "4 ans",
    competences: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    bio: "Designer UX/UI créative, je transforme des idées complexes en interfaces intuitives et engageantes pour les utilisateurs."
  },
  {
    id: 3,
    nom: "Andriamihaja",
    prenom: "Paul",
    email: "paul.andriamihaja@opendev.mg",
    date_naissance: "1988-11-03",
    sexe: "Male",
    adresse: "Fianarantsoa Centre",
    ville: "Fianarantsoa",
    pays: "Madagascar",
    telephone: "+261 34 77 666 55",
    photo_profil: "images/paul_andriamihaja.jpg",
    date_inscription: "2024-07-25 11:15:00",
    role: "membre",
    statut: "Actif",
    poste: "Data Scientist",
    experience: "7 ans",
    competences: ["Python", "R", "Machine Learning", "TensorFlow", "SQL"],
    bio: "Spécialiste en science des données, j'explore les données pour extraire des insights précieux et développer des modèles prédictifs."
  },
  {
    id: 5,
    nom: "Razafy",
    prenom: "Hery",
    email: "hery.razafy@opendev.mg",
    date_naissance: "1990-05-18",
    sexe: "Male",
    adresse: "Mahajanga Mahabibo",
    ville: "Mahajanga",
    pays: "Madagascar",
    telephone: "+261 34 88 999 77",
    photo_profil: "images/hery_razafy.jpg",
    date_inscription: "2024-08-05 16:45:00",
    role: "membre",
    statut: "Actif",
    poste: "DevOps Engineer",
    experience: "6 ans",
    competences: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    bio: "Ingénieur DevOps expert en infrastructure cloud et automatisation des déploiements."
  }
]

// Fonction de fetch améliorée pour la connexion backend
async function fetchJSON(url, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_CONFIG.TIMEOUT)

  try {
    const defaultOptions = {
      method: 'GET',
      headers: {
        ...BACKEND_CONFIG.HEADERS,
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
      },
      signal: controller.signal,
      ...options
    }
    
    const res = await fetch(url, defaultOptions)
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      return { ok: false, data: null, error: `HTTP ${res.status}`, useFallback: true }
    }
    
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return { ok: false, data: null, error: 'Invalid content type', useFallback: true }
    }
    
    const data = await res.json()
    return { ok: res.ok, data }
    
  } catch (e) {
    clearTimeout(timeoutId)
    return { ok: false, data: null, error: e.message, useFallback: true }
  }
}

// Récupérer la liste des membres avec fallback
async function fetchMembers() {
  const { ok, data, useFallback } = await fetchJSON(`${API_BASE}/membres`)
  
  if (useFallback || !ok || !data || data.status !== 'success') {
    return FALLBACK_MEMBERS
  }
  
  return Array.isArray(data.data) ? data.data : []
}

// Récupérer un membre par ID avec fallback
async function fetchMember(id) {
  const { ok, data, useFallback } = await fetchJSON(`${API_BASE}/membre/${id}`)
  
  if (useFallback || !ok || !data || data.status !== 'success') {
    const member = FALLBACK_MEMBERS.find(m => m.id == id)
    return member || null
  }
  
  return data.data || null
}

// Construire l'URL d'image avec fallback intelligent
function imageUrl(path) {
  if (!path) return 'https://via.placeholder.com/200x200?text=OpenDev'
  
  // Avatars de fallback réalistes
  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616c9d58a13?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f0d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face'
  ]
  
  // En mode développement sans backend, utiliser directement les avatars de fallback
  if (isDevelopment) {
    // Utiliser un avatar basé sur un hash du chemin pour la cohérence
    const hash = path.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
    return avatars[Math.abs(hash) % avatars.length]
  }
  
  // En production, essayer le backend d'abord
  if (path.startsWith('images/')) {
    return `${IMG_BASE}${path}`
  }
  
  // Fallback final
  const hash = path.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
  return avatars[Math.abs(hash) % avatars.length]
}



// Exposer l'API pour l'application
window.ODMApi = {
  // Fonctions principales
  fetchMembers,
  fetchMember,
  imageUrl
}

// Initialisation silencieuse
console.log('� OpenDev Madagascar - Annuaire des Développeurs')