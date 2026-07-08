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

