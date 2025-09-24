// Gestion du formulaire d'ajout de membre
// Construit un FormData conforme à l'API backend et envoie la requête

function toFrDate(iso) {
  // Transforme AAAA-MM-JJ en JJ/MM/AAAA
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

async function handleSubmitCreate(e) {
  // Exécute avant les autres écouteurs potentiels et bloque l'alerte existante
  e.preventDefault()
  e.stopPropagation()
  if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()

  const form = e.target

  const firstName = form.querySelector('#firstName')?.value?.trim()
  const lastName = form.querySelector('#lastName')?.value?.trim()
  const email = form.querySelector('#email')?.value?.trim()
  const phone = form.querySelector('#phone')?.value?.trim()
  // Le champ #role dans le formulaire correspond à un rôle MÉTIER (frontend),
  // qui n'est pas stocké côté backend. Le backend attend un rôle de compte
  // (admin/staff/membre). On force donc membre par défaut.
  const password = form.querySelector('#password')?.value?.trim()
  const birthdayIso = form.querySelector('#birthday')?.value?.trim()
  const sexe = form.querySelector('#sexe')?.value?.trim()
  const address = form.querySelector('#address')?.value?.trim()
  const city = form.querySelector('#city')?.value?.trim()
  const contry = form.querySelector('#contry')?.value?.trim()
  const statut = form.querySelector('#statut')?.value?.trim() || 'Actif'
  const imageInput = form.querySelector('#image')

  // Validations minimales côté client (doit correspondre aux champs requis backend)
  if (!firstName || !lastName) {
    alert('Veuillez renseigner le prénom et le nom')
    return
  }
  if (!phone) {
    alert('Veuillez renseigner le numéro de téléphone')
    return
  }
  if (!password) {
    alert('Veuillez renseigner un mot de passe')
    return
  }
  if (!imageInput || !imageInput.files || imageInput.files.length === 0) {
    alert('Veuillez sélectionner une image de profil')
    return
  }

  const fd = new FormData()
  // Mappage des champs frontend -> backend
  fd.append('prenom', firstName)
  fd.append('nom', lastName)
  if (email) fd.append('email', email)
  fd.append('phone', phone)
  fd.append('password', password)
  fd.append('role', 'membre')

  const birthday = toFrDate(birthdayIso)
  if (birthday) fd.append('birthday', birthday)
  if (sexe) fd.append('sexe', sexe)
  if (address) fd.append('address', address)
  if (city) fd.append('city', city)
  if (contry) fd.append('contry', contry)
  if (statut) fd.append('statut', statut)

  // Fichier image
  fd.append('image', imageInput.files[0])

  try {
    const res = await fetch(`${window.ODMApi.API_BASE}/membre-create`, {
      method: 'POST',
      body: fd
    })
    const data = await res.json()

    if (data && data.status === 'success') {
      alert('Membre créé avec succès')
      window.location.href = 'members.html'
      return
    }

    const msg = data && data.message ? data.message : 'Erreur inconnue'
    alert(`Echec de création: ${msg}`)
  } catch (err) {
    console.error(err)
    alert('Erreur réseau lors de la création du membre')
  }
}

function initAddMemberPage() {
  const form = document.getElementById('member-form')
  if (!form) return
  // Ajout d'un listener en phase de capture pour superséder les handlers existants
  form.addEventListener('submit', handleSubmitCreate, true)
}

document.addEventListener('DOMContentLoaded', initAddMemberPage)
