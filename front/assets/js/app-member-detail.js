// App frontend pour la page member-detail.html
// Charge le détail d'un membre depuis le backend via ODMApi

async function initMemberDetailPage() {
  const container = document.querySelector('.member-detail')
  if (!container) return

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')

  if (!id) {
    container.innerHTML = `
      <div class="error-message">
        <h2>Membre non trouvé</h2>
        <p>Le membre que vous recherchez n'existe pas ou l'identifiant est manquant.</p>
        <a href="members.html" class="btn">Retour à la liste des membres</a>
      </div>
    `
    return
  }

  const m = await window.ODMApi.fetchMember(id)
  if (!m) {
    container.innerHTML = `
      <div class="error-message">
        <h2>Membre non trouvé</h2>
        <p>Le membre que vous recherchez n'existe pas ou a été supprimé.</p>
        <a href="members.html" class="btn">Retour à la liste des membres</a>
      </div>
    `
    return
  }

  const fullName = `${m.prenom || ''} ${m.nom || ''}`.trim() || 'Nom indisponible'
  const role = m.role || 'Membre'
  const email = m.email || ''
  const phone = m.telephone || ''
  const ville = m.ville || ''
  const pays = m.pays || ''
  const adresse = m.adresse || ''
  const sexe = m.sexe || ''
  const birthday = m.date_naissance || ''
  const statut = m.statut || ''
  const img = window.ODMApi.imageUrl(m.photo_profil)

  document.title = `${fullName} | OpenDev Mada`

  container.innerHTML = `
    <div class="member-header">
      <img src="${img}" alt="${fullName}">
      <div class="member-info">
        <h1>${fullName}</h1>
        <span class="role">${role}</span>
        <div class="contact-info">
          <p><i class="fas fa-envelope"></i> ${email}</p>
          <p><i class="fas fa-phone"></i> ${phone}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${ville}${pays ? ', ' + pays : ''}</p>
        </div>
      </div>
    </div>
    <div class="member-bio">
      <h2>À propos</h2>
      <p>Aucune biographie disponible</p>
    </div>
    <div class="member-skills">
      <h2>Informations</h2>
      <div>Sexe: ${sexe || 'Non précisé'}</div>
      <div>Date de naissance: ${birthday || 'Non précisée'}</div>
      <div>Adresse: ${adresse || 'Non précisée'}</div>
      <div>Statut: ${statut || 'Non précisé'} | Rôle: ${role}</div>
    </div>
  `

  // Suppression du membre
  const deleteBtn = document.getElementById('deleteMemberBtn')
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async e => {
      e.preventDefault()
      const ok = confirm('Confirmer la suppression du membre ?')
      if (!ok) return

      const res = await window.ODMApi.deleteMember(id)
      if (res && (res.status === 'Succès' || res.status === 'success')) {
        alert('Membre supprimé avec succès')
        window.location.href = 'members.html'
        return
      }

      const msg = res && res.message ? res.message : 'Erreur inconnue'
      alert(`Echec de suppression: ${msg}`)
    })
  }

  // Edition du membre (modale)
  const editBtn = document.getElementById('editMemberBtn')
  const editModal = document.getElementById('editModal')
  const closeEditModal = document.getElementById('closeEditModal')
  const cancelEdit = document.getElementById('cancelEdit')
  const editForm = document.getElementById('editForm')

  function openModal() {
    if (!editModal) return
    // Pré-remplir les champs depuis m
    const emailEl = document.getElementById('editEmail')
    const phoneEl = document.getElementById('editPhone')
    const addressEl = document.getElementById('editAddress')
    const cityEl = document.getElementById('editCity')
    const roleEl = document.getElementById('editRole')
    const statusEl = document.getElementById('editStatus')
    const pwdEl = document.getElementById('editPassword')
    const imgEl = document.getElementById('editImage')

    if (emailEl) emailEl.value = m.email || ''
    if (phoneEl) phoneEl.value = m.telephone || ''
    if (addressEl) addressEl.value = m.adresse || ''
    if (cityEl) cityEl.value = m.ville || ''
    if (roleEl) roleEl.value = (m.role || 'membre').toLowerCase()
    if (statusEl) {
      const raw = (m.statut || '').toLowerCase()
      // Tolérer 'actif'/'inactif' et 'active'/'inactive'
      statusEl.value = raw === 'actif' ? 'active' : (raw === 'inactif' ? 'inactive' : (raw || 'active'))
      if (!['active','inactive'].includes(statusEl.value)) statusEl.value = 'active'
    }
    if (pwdEl) pwdEl.value = ''
    if (imgEl) imgEl.value = ''

    editModal.classList.remove('hidden')
    editModal.classList.add('flex')
  }

  function closeModal() {
    if (!editModal) return
    editModal.classList.add('hidden')
    editModal.classList.remove('flex')
  }

  if (editBtn) editBtn.addEventListener('click', e => { e.preventDefault(); openModal() })
  if (closeEditModal) closeEditModal.addEventListener('click', e => { e.preventDefault(); closeModal() })
  if (cancelEdit) cancelEdit.addEventListener('click', e => { e.preventDefault(); closeModal() })

  if (editForm) {
    editForm.addEventListener('submit', async e => {
      e.preventDefault()

      const email = document.getElementById('editEmail')?.value?.trim()
      const phone = document.getElementById('editPhone')?.value?.trim()
      const address = document.getElementById('editAddress')?.value?.trim()
      const city = document.getElementById('editCity')?.value?.trim()
      const role = document.getElementById('editRole')?.value?.trim()
      const statut = document.getElementById('editStatus')?.value?.trim()
      const password = document.getElementById('editPassword')?.value?.trim()
      const imageInput = document.getElementById('editImage')

      const fd = new FormData()
      if (email) fd.append('email', email)
      if (password) fd.append('password', password)
      if (address) fd.append('address', address)
      if (city) fd.append('city', city)
      if (phone) fd.append('phone', phone)
      if (role) fd.append('role', role)
      if (statut) fd.append('statut', statut)
      if (imageInput && imageInput.files && imageInput.files.length > 0) {
        fd.append('image', imageInput.files[0])
      }

      const res = await window.ODMApi.updateMember(id, fd)
      if (res && res.status === 'success') {
        alert('Membre mis à jour avec succès')
        // Recharger pour refléter les changements
        window.location.reload()
        return
      }

      const msg = res && res.message ? res.message : 'Erreur inconnue'
      alert(`Echec de la mise à jour: ${msg}`)
    })
  }
}

document.addEventListener('DOMContentLoaded', initMemberDetailPage)
