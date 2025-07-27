// Filter functionality for members page
document.addEventListener('DOMContentLoaded', function() {
    // Get filter elements
    const roleFilter = document.getElementById('role-filter');
    const skillFilter = document.getElementById('skill-filter');
    const locationFilter = document.getElementById('location-filter');
    const searchInput = document.querySelector('.search-input');
    const memberCards = document.querySelectorAll('.member-card');
    const noResults = document.createElement('div');
    noResults.className = 'col-span-full text-center py-8 text-muted-foreground';
    noResults.textContent = 'Aucun membre ne correspond aux critères sélectionnés.';
    noResults.style.display = 'none';
    document.getElementById('member-list').parentNode.appendChild(noResults);

    // Apply filters function
    function applyFilters() {
        const roleValue = roleFilter ? roleFilter.value.toLowerCase() : '';
        const skillValue = skillFilter ? skillFilter.value.toLowerCase() : '';
        const locationValue = locationFilter ? locationFilter.value.toLowerCase() : '';
        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
        
        let hasVisibleCards = false;

        memberCards.forEach(card => {
            const role = card.getAttribute('data-role') || '';
            const skills = card.getAttribute('data-skills') || '';
            const location = card.getAttribute('data-location') || '';
            const name = card.querySelector('.member-name').textContent.toLowerCase();
            const description = card.querySelector('.member-role').textContent.toLowerCase();
            
            const matchesRole = !roleValue || role === roleValue || role.includes(roleValue);
            const matchesSkill = !skillValue || skills.includes(skillValue);
            const matchesLocation = !locationValue || location === locationValue || location.includes(locationValue);
            const matchesSearch = !searchValue || 
                name.includes(searchValue) || 
                description.includes(searchValue) ||
                skills.includes(searchValue);
            
            if (matchesRole && matchesSkill && matchesLocation && matchesSearch) {
                card.style.display = '';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        noResults.style.display = hasVisibleCards ? 'none' : 'block';
    }

    // Add event listeners
    if (roleFilter) roleFilter.addEventListener('change', applyFilters);
    if (skillFilter) skillFilter.addEventListener('change', applyFilters);
    if (locationFilter) locationFilter.addEventListener('change', applyFilters);
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        
        // Add search icon click handler
        const searchButton = searchInput.nextElementSibling;
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                searchInput.focus();
            });
        }
    }

    // Initialize filters
    applyFilters();
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
}

// Initialize theme based on user preference or system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
