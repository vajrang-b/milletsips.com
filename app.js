// Remove Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('page_preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 400); // Small delay to enjoy premium visual loader
  }
});

// Toast system
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Modal Toggle Logic
function openKioskModal() {
  document.getElementById('kioskModal').classList.add('open');
  setActiveNavItem(0);
}

function closeKioskModal() {
  document.getElementById('kioskModal').classList.remove('open');
}

function openFranchiseModal() {
  document.getElementById('franchiseModal').classList.add('open');
}

function closeFranchiseModal() {
  document.getElementById('franchiseModal').classList.remove('open');
}

// Franchise Form Submit
function submitFranchiseForm(event) {
  event.preventDefault();
  const name = document.getElementById('partnerName').value;
  const email = document.getElementById('partnerEmail').value;
  const city = document.getElementById('partnerCity').value;
  
  if (name && email && city) {
    closeFranchiseModal();
    showToast(`Success! Franchise Kit sent to ${email}`);
    // Clear form
    document.getElementById('franchiseForm').reset();
  }
}

// Ingredients Drawer Toggle Logic
function toggleIngredients(cardElement) {
  // Prevent double trigger if clicking internal items specifically if they have individual events
  const content = cardElement.querySelector('.ingredients-content');
  const trigger = cardElement.querySelector('.ingredients-trigger');
  
  if (content && trigger) {
    const isOpen = content.classList.contains('open');
    
    // Close other drawers first
    document.querySelectorAll('.ingredients-content').forEach(c => {
      c.classList.remove('open');
    });
    document.querySelectorAll('.ingredients-trigger').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      content.classList.add('open');
      trigger.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
    }
  }
}

// Sticky Nav Highlighting
function setActiveNavItem(index) {
  const items = document.querySelectorAll('.nav-item');
  items.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Attach listeners for sticky navigation items
document.querySelectorAll('.nav-item').forEach((item, index) => {
  item.addEventListener('click', (e) => {
    // Only set active if it's not opening modals which have their own state
    if (item.getAttribute('href') === '#menu') {
      setActiveNavItem(index);
    }
  });
});

// Toggle Mobile Nav Drawer overlay
function toggleMobileNav(state) {
  const overlay = document.getElementById('mobileNav');
  if (overlay) {
    if (state) {
      overlay.classList.add('open');
    } else {
      overlay.classList.remove('open');
    }
  }
}

// Filter Menu Items
function filterMenuItems() {
  const query = document.getElementById('menuSearch').value.toLowerCase();
  const category = document.getElementById('menuFilter').value;
  const cards = document.querySelectorAll('#menuGrid .product-card');

  cards.forEach(card => {
    const title = card.querySelector('.product-title').innerText.toLowerCase();
    const benefit = card.querySelector('.product-benefit').innerText.toLowerCase();
    const cat = card.getAttribute('data-category');

    const matchesQuery = title.includes(query) || benefit.includes(query);
    const matchesCategory = category === 'all' || cat === category;

    if (matchesQuery && matchesCategory) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Partnership Page Form Submit
function submitPartnerForm(event) {
  event.preventDefault();
  const name = document.getElementById('pName').value;
  const email = document.getElementById('pEmail').value;
  const city = document.getElementById('pCity').value;

  if (name && email && city) {
    showToast(`Application submitted! Thank you, ${name}.`);
    document.getElementById('partnerPageForm').reset();
  }
}

// Header Search Bar Logic
function toggleHeaderSearch(show) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;
  
  if (show === undefined) {
    dropdown.classList.toggle('active');
  } else if (show) {
    dropdown.classList.add('active');
  } else {
    dropdown.classList.remove('active');
    const suggestions = document.getElementById('searchSuggestionsBox');
    if (suggestions) suggestions.classList.remove('active');
  }
  
  if (dropdown.classList.contains('active')) {
    const input = document.getElementById('headerSearchInput');
    if (input) {
      input.focus();
      initSuggestions();
    }
  }
}

function handleHeaderSearch(event) {
  if (event.key === 'Enter') {
    const query = event.target.value.trim();
    if (query) {
      const isInSubfolder = window.location.pathname.includes('/blog/');
      const basePath = isInSubfolder ? '../' : '';
      window.location.href = `${basePath}menu.html?search=${encodeURIComponent(query)}`;
    }
  }
}

// Autocomplete and live sync logic
const menuProducts = [
  { name: 'Ragi Elaichi Chai', category: 'warm', tags: ['ragi', 'elaichi', 'chai', 'tea', 'cardamom', 'hot'] },
  { name: 'Kangni Lemon Sharbat', category: 'cold', tags: ['foxtail', 'lemon', 'sharbat', 'mint', 'lemonade', 'cold'] },
  { name: 'Bajra Coco Lassi', category: 'cold', tags: ['pearl', 'bajra', 'coco', 'lassi', 'coconut', 'yogurt', 'cold'] }
];

function initSuggestions() {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;
  
  let box = document.getElementById('searchSuggestionsBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'searchSuggestionsBox';
    box.className = 'search-suggestions';
    dropdown.appendChild(box);
  }
  
  const input = document.getElementById('headerSearchInput');
  if (!input) return;
  
  input.removeEventListener('input', handleHeaderSearchInput);
  input.addEventListener('input', handleHeaderSearchInput);
}

function handleHeaderSearchInput(e) {
  const query = e.target.value.toLowerCase().trim();
  const box = document.getElementById('searchSuggestionsBox');
  if (!box) return;
  
  // Sync live search if we are on menu.html
  const menuSearch = document.getElementById('menuSearch');
  if (menuSearch) {
    menuSearch.value = e.target.value;
    filterMenuItems();
  }
  
  if (!query) {
    box.classList.remove('active');
    return;
  }
  
  const matches = menuProducts.filter(prod => 
    prod.name.toLowerCase().includes(query) || 
    prod.tags.some(tag => tag.includes(query))
  );
  
  if (matches.length === 0) {
    box.classList.remove('active');
    return;
  }
  
  box.innerHTML = '';
  matches.forEach(prod => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    
    const isInSubfolder = window.location.pathname.includes('/blog/');
    const basePath = isInSubfolder ? '../' : '';
    
    item.innerHTML = `
      <span>${prod.name}</span>
      <span class="suggestion-category">${prod.category}</span>
    `;
    item.addEventListener('click', () => {
      window.location.href = `${basePath}menu.html?search=${encodeURIComponent(prod.name)}`;
    });
    box.appendChild(item);
  });
  
  box.classList.add('active');
}

// Close suggestions on outside clicks
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('searchDropdown');
  const box = document.getElementById('searchSuggestionsBox');
  if (box && dropdown && !dropdown.contains(e.target)) {
    box.classList.remove('active');
  }
});

// Handle incoming search query parameter on load
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQueries = urlParams.get('search');
  if (searchQueries) {
    const menuSearch = document.getElementById('menuSearch');
    if (menuSearch) {
      menuSearch.value = decodeURIComponent(searchQueries);
      filterMenuItems();
    }
  }
});



