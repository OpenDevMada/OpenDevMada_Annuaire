// App frontend pour la page members.html
// Charge la liste des membres depuis le backend et applique la recherche/filtre

// Sélection des éléments de l'UI
const memberListEl = document.getElementById('member-list')
const searchInput = document.getElementById('searchInput')
const roleFilter = document.getElementById('roleFilter')
const skillFilter = document.getElementById('skillFilter')
const locationFilter = document.getElementById('locationFilter')

// État en mémoire pour la liste et les filtres
let allMembers = []

// Rendu d'une carte membre
function renderMemberCard(m) {
  const fullName = `${m.prenom || ''} ${m.nom || ''}`.trim() || 'Nom indisponible'
  const role = m.role || 'Membre'
  const location = m.ville || ''
  const img = window.ODMApi.imageUrl(m.photo_profil)

  return `
    <div class="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 member-card" data-role="${role}" data-location="${location}">
      <div class="p-5">
        <div class="flex items-center space-x-4 mb-4">
          <div class="relative">
            <img src="${img}" alt="${fullName}" class="w-16 h-16 rounded-full border-2 border-primary/20 object-cover">
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></span>
          </div>
          <div>
            <h3 class="font-semibold text-lg text-foreground member-name">${fullName}</h3>
            <p class="text-sm text-muted-foreground member-role">${role}</p>
            <div class="flex items-center mt-1">
              <i class="fas fa-map-marker-alt text-xs text-muted-foreground mr-1"></i>
              <span class="text-xs text-muted-foreground">${location}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <a href="member-detail.html?id=${m.id}" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-1.5">
            Voir le profil
          </a>
        </div>
      </div>
    </div>
  `
}

// Rendu de la liste filtrée
function renderList() {
  if (!memberListEl) return

  const q = (searchInput?.value || '').toLowerCase()
  const role = (roleFilter?.value || '').toLowerCase()
  const skill = (skillFilter?.value || '').toLowerCase() // non utilisé, backend ne renvoie pas les skills
  const location = (locationFilter?.value || '').toLowerCase()

  const filtered = allMembers.filter(m => {
    const name = `${m.prenom || ''} ${m.nom || ''}`.toLowerCase()
    const mRole = (m.role || '').toLowerCase()
    const mLoc = (m.ville || '').toLowerCase()

    const matchesSearch = !q || name.includes(q) || mRole.includes(q) || mLoc.includes(q)
    const matchesRole = !role || mRole.includes(role)
    const matchesLocation = !location || mLoc.includes(location)
    return matchesSearch && matchesRole && matchesLocation
  })

  if (filtered.length === 0) {
    memberListEl.innerHTML = `
      <div class="col-span-full text-center py-8 text-muted-foreground">
        Aucun membre ne correspond aux critères sélectionnés.
      </div>
    `
    return
  }

  memberListEl.innerHTML = filtered.map(renderMemberCard).join('')
}

// Chargement initial
async function initMembersPage() {
  if (!memberListEl) return

  const data = await window.ODMApi.fetchMembers()
  allMembers = Array.isArray(data) ? data : []
  renderList()

  // Écouteurs
  if (searchInput) searchInput.addEventListener('input', renderList)
  if (roleFilter) roleFilter.addEventListener('change', renderList)
  if (locationFilter) locationFilter.addEventListener('change', renderList)
}

document.addEventListener('DOMContentLoaded', initMembersPage)
