// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const memberList = document.getElementById('member-list');
const memberForm = document.getElementById('member-form');

// Toggle mobile menu
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Load members list
function loadMembers() {
  if (!memberList) return;
  
  const members = getAllMembers();
  memberList.innerHTML = members.map(member => `
    <div class="member-card">
      <img src="images/${member.image}" alt="${member.firstName} ${member.lastName}">
      <div class="member-info">
        <h3>${member.firstName} ${member.lastName}</h3>
        <p class="role">${member.role}</p>
        <a href="member-detail.html?id=${member.id}" class="btn">Voir le profil</a>
      </div>
    </div>
  `).join('');
}

// Load member details
function loadMemberDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get('id');
  
  if (memberId) {
    const member = getMemberById(memberId);
    if (member) {
      document.title = `${member.firstName} ${member.lastName} | OpenDev Mada`;
      document.querySelector('.member-detail').innerHTML = `
        <div class="member-header">
          <img src="images/${member.image}" alt="${member.firstName} ${member.lastName}">
          <div class="member-info">
            <h1>${member.firstName} ${member.lastName}</h1>
            <p class="role">${member.role}</p>
            <div class="contact-info">
              <p><i class="fas fa-envelope"></i> ${member.email}</p>
              <p><i class="fas fa-phone"></i> ${member.phone}</p>
              <p><i class="fas fa-calendar-alt"></i> Membre depuis ${member.joinDate}</p>
            </div>
          </div>
        </div>
        <div class="member-bio">
          <h2>À propos</h2>
          <p>${member.bio}</p>
        </div>
        <div class="member-skills">
          <h2>Compétences</h2>
          <div class="skills-list">
            ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      `;
      return;
    }
  }
  // If no member found or no ID provided
  document.querySelector('.member-detail').innerHTML = `
    <div class="error-message">
      <h2>Membre non trouvé</h2>
      <p>Le membre que vous recherchez n'existe pas ou a été supprimé.</p>
      <a href="members.html" class="btn">Retour à la liste des membres</a>
    </div>
  `;
}

// Handle form submission
if (memberForm) {
  memberForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(memberForm);
    const newMember = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      role: formData.get('role'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      bio: formData.get('bio'),
      skills: formData.get('skills').split(',').map(skill => skill.trim())
    };
    
    addMember(newMember);
    alert('Membre ajouté avec succès !');
    memberForm.reset();
    window.location.href = 'members.html';
  });
}

// Initialize page based on current URL
function initPage() {
  const path = window.location.pathname;
  
  if (path.endsWith('members.html') || path.endsWith('index.html')) {
    loadMembers();
  } else if (path.endsWith('member-detail.html')) {
    loadMemberDetails();
  }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);
