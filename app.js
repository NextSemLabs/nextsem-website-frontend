// Application Data
const appData = {
  subjects: {
    semester1: [
      {"name": "Engineering Physics", "code": "BT101"},
      {"name": "Engineering Chemistry", "code": "BT102"},
      {"name": "Mathematics-I", "code": "BT103"},
      {"name": "Basic Computer Engineering", "code": "BT104"},
      {"name": "English Communication", "code": "BT105"},
      {"name": "Workshop Practice", "code": "BT106"}
    ],
    semester2: [
      {"name": "Engineering Physics-II", "code": "BT201"},
      {"name": "Mathematics-II", "code": "BT202"},
      {"name": "Basic Mechanical Engineering", "code": "BT203"},
      {"name": "Basic Civil Engineering", "code": "BT204"},
      {"name": "Basic Electrical Engineering", "code": "BT205"},
      {"name": "Language Lab", "code": "BT206"}
    ]
  },
  branches: {
    groupA: ["CS", "IT", "EE", "EX", "EI", "FT", "AT", "MI", "BT", "BM"],
    groupB: ["AU", "ME", "IP", "CE", "IEM", "TX", "EC", "CM"]
  },
  years: ["2023", "2022", "2021", "2020"],
  paperTypes: ["End Semester", "Supplementary"]
};

// Application State
let currentState = {
  currentSection: 'home',
  selectedYear: null,
  selectedGroup: null,
  currentSemester: 1,
  subjectFilter: '',
  yearFilter: '',
  papers: []
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  generatePapers();
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  console.log('Initializing app...');
  // Set initial section as active
  showSection('home');
  
  // Set initial semester tab as active
  const firstTab = document.querySelector('.tab-btn[data-semester="1"]');
  if (firstTab) {
    firstTab.classList.add('active');
  }
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = link.dataset.section;
      console.log('Nav clicked:', targetSection);
      showSection(targetSection);
      updateNavigation(targetSection);
    });
  });

  // Brand title click to go home
  const brandTitle = document.querySelector('.brand-title');
  if (brandTitle) {
    brandTitle.addEventListener('click', () => {
      showSection('home');
      updateNavigation('home');
    });
    brandTitle.style.cursor = 'pointer';
  }

  // Year card selection
  const yearCards = document.querySelectorAll('.year-card.clickable');
  yearCards.forEach(card => {
    card.addEventListener('click', () => {
      const year = card.dataset.year;
      console.log('Year card clicked:', year);
      if (year === '1') {
        currentState.selectedYear = year;
        showSection('choice');
      } else {
        showNotification('This year is not available yet. Coming soon!', 'info');
      }
    });
  });

  // Group card selection
  const groupCards = document.querySelectorAll('.group-card');
  groupCards.forEach(card => {
    card.addEventListener('click', () => {
      const group = card.dataset.group;
      console.log('Group card clicked:', group);
      currentState.selectedGroup = group;
      showSection('pyqs');
      populateFilters();
      renderPapers();
    });
  });

  // Back buttons
  const backBtns = document.querySelectorAll('.back-btn');
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSection = btn.dataset.target;
      console.log('Back button clicked:', targetSection);
      showSection(targetSection);
    });
  });

  // Semester tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const semester = parseInt(btn.dataset.semester);
      console.log('Semester tab clicked:', semester);
      
      // Update active tab
      tabBtns.forEach(tab => tab.classList.remove('active'));
      btn.classList.add('active');
      
      // Update state and render
      currentState.currentSemester = semester;
      populateFilters();
      renderPapers();
    });
  });

  // Filter changes
  const subjectFilter = document.getElementById('subject-filter');
  const yearFilter = document.getElementById('year-filter');
  
  if (subjectFilter) {
    subjectFilter.addEventListener('change', (e) => {
      currentState.subjectFilter = e.target.value;
      console.log('Subject filter changed:', e.target.value);
      renderPapers();
    });
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', (e) => {
      currentState.yearFilter = e.target.value;
      console.log('Year filter changed:', e.target.value);
      renderPapers();
    });
  }

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }

  // Notification close
  const notificationClose = document.querySelector('.notification-close');
  if (notificationClose) {
    notificationClose.addEventListener('click', hideNotification);
  }

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  console.log('Event listeners setup complete');
}

function showSection(sectionId) {
  console.log('Showing section:', sectionId);
  
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    currentState.currentSection = sectionId;
    console.log('Section shown:', sectionId);
  } else {
    console.error('Section not found:', sectionId);
  }

  // Update navigation
  updateNavigation(sectionId);
}

function updateNavigation(sectionId) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === sectionId) {
      link.classList.add('active');
    }
  });
}

function populateFilters() {
  const subjectFilter = document.getElementById('subject-filter');
  const yearFilter = document.getElementById('year-filter');
  
  if (!subjectFilter || !yearFilter) {
    console.log('Filters not found');
    return;
  }

  const currentSemesterKey = `semester${currentState.currentSemester}`;
  const subjects = appData.subjects[currentSemesterKey] || [];

  // Clear and populate subject filter
  subjectFilter.innerHTML = '<option value="">All Subjects</option>';
  subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject.code;
    option.textContent = `${subject.name} (${subject.code})`;
    subjectFilter.appendChild(option);
  });

  // Reset filter values
  currentState.subjectFilter = '';
  currentState.yearFilter = '';
  subjectFilter.value = '';
  yearFilter.value = '';
  
  console.log('Filters populated for semester:', currentState.currentSemester);
}

function generatePapers() {
  const papers = [];
  
  // Generate papers for both semesters
  [1, 2].forEach(semester => {
    const semesterKey = `semester${semester}`;
    const subjects = appData.subjects[semesterKey] || [];
    
    subjects.forEach(subject => {
      appData.years.forEach(year => {
        appData.paperTypes.forEach(type => {
          papers.push({
            id: `${subject.code}-${year}-${type.replace(' ', '')}-S${semester}`,
            subject: subject.name,
            code: subject.code,
            year: year,
            type: type,
            semester: semester,
            filename: `${subject.code}_${type.replace(' ', '_')}_${year}.pdf`
          });
        });
      });
    });
  });

  currentState.papers = papers;
  console.log('Generated', papers.length, 'papers');
}

function renderPapers() {
  const papersGrid = document.getElementById('papers-grid');
  if (!papersGrid) {
    console.log('Papers grid not found');
    return;
  }

  const currentSemesterPapers = currentState.papers.filter(paper => 
    paper.semester === currentState.currentSemester
  );

  // Apply filters
  let filteredPapers = currentSemesterPapers;

  if (currentState.subjectFilter) {
    filteredPapers = filteredPapers.filter(paper => 
      paper.code === currentState.subjectFilter
    );
  }

  if (currentState.yearFilter) {
    filteredPapers = filteredPapers.filter(paper => 
      paper.year === currentState.yearFilter
    );
  }

  // Clear grid
  papersGrid.innerHTML = '';

  if (filteredPapers.length === 0) {
    papersGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--color-gray-medium);">
        <h3>No papers found</h3>
        <p>Try adjusting your filters to see more results.</p>
      </div>
    `;
    return;
  }

  // Render paper cards
  filteredPapers.forEach(paper => {
    const paperCard = createPaperCard(paper);
    papersGrid.appendChild(paperCard);
  });
  
  console.log('Rendered', filteredPapers.length, 'papers');
}

function createPaperCard(paper) {
  const card = document.createElement('div');
  card.className = 'paper-card';
  
  card.innerHTML = `
    <h3 class="paper-title">${paper.subject}</h3>
    <div class="paper-code">${paper.code}</div>
    <div class="paper-meta">
      <span>Year: ${paper.year}</span>
      <span>Type: ${paper.type}</span>
    </div>
    <button class="download-btn" data-paper-id="${paper.id}">
      Download PDF
    </button>
  `;

  // Add download functionality
  const downloadBtn = card.querySelector('.download-btn');
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    downloadPaper(paper);
  });

  return card;
}

function downloadPaper(paper) {
  // Simulate download process
  showNotification(`Downloading ${paper.subject} (${paper.year}) - ${paper.type}...`, 'info');
  
  console.log(`Downloading: ${paper.filename}`);
  
  // Simulate download delay
  setTimeout(() => {
    showNotification(`Download completed: ${paper.filename}`, 'success');
  }, 1500);
}

function handleContactForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  // Validate form
  if (!name || !email || !message) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate form submission
  showNotification('Sending message...', 'info');
  
  setTimeout(() => {
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
  }, 1500);
  
  console.log('Contact form submitted:', { name, email, message });
}

function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  if (!notification) {
    console.log('Notification element not found');
    return;
  }

  const messageElement = notification.querySelector('.notification-message');
  if (messageElement) {
    messageElement.textContent = message;
  }

  // Remove existing type classes
  notification.className = 'notification';
  
  // Add new type class
  if (type !== 'info') {
    notification.classList.add(`notification--${type}`);
  }
  
  // Show notification
  notification.classList.remove('hidden');
  
  console.log('Notification shown:', message, type);

  // Auto-hide after 4 seconds
  setTimeout(() => {
    hideNotification();
  }, 4000);
}

function hideNotification() {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.classList.add('hidden');
  }
}

// Keyboard navigation enhancements
document.addEventListener('keydown', (e) => {
  // Escape key handling
  if (e.key === 'Escape') {
    hideNotification();
  }
});

// Make cards focusable for accessibility
function makeCardsFocusable() {
  const yearCards = document.querySelectorAll('.year-card.clickable');
  const groupCards = document.querySelectorAll('.group-card');
  
  [...yearCards, ...groupCards].forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.style.outline = 'none';
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
    
    card.addEventListener('focus', () => {
      card.style.outline = '2px solid var(--color-gold-primary)';
      card.style.outlineOffset = '2px';
    });
    
    card.addEventListener('blur', () => {
      card.style.outline = 'none';
    });
  });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(makeCardsFocusable, 100);
});

// Debug helper
window.debugApp = {
  currentState,
  showSection,
  appData,
  generatePapers,
  renderPapers
};

console.log('NextSem.in app loaded successfully');