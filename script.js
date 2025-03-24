document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Toggle for Mobile Menu
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('active');
    });
  }

  // Update navigation bar based on login state
  const authLinksContainer = document.getElementById('authLinks');
  const currentUser = localStorage.getItem('currentUser');
  if (authLinksContainer) {
    if (currentUser) {
      // If on dashboard page, don't show duplicate dashboard link
      if (window.location.pathname.includes("dashboard.html")) {
        authLinksContainer.innerHTML = `<button id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>`;
      } else {
        authLinksContainer.innerHTML = `<a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a> <button id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>`;
      }
    } else {
      authLinksContainer.innerHTML = `<a href="register.html"><i class="fas fa-user-plus"></i> Register</a>
                                      <a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>`;
    }
  }

  // Logout button event listener
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = "index.html";
    });
  }

  // Registration Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = registerForm.elements[0].value;
      const email = registerForm.elements[1].value;
      const password = registerForm.elements[2].value;
      const confirmPassword = registerForm.elements[3].value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const user = { name: fullName, email: email };
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = "dashboard.html";
    });
  }

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.elements[0].value;
      const password = loginForm.elements[1].value;
      const user = { email: email };
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = "dashboard.html";
    });
  }

  // Dashboard functionality
  if (window.location.pathname.includes("dashboard.html")) {
    showSection('upload');

    const datasetInput = document.getElementById('datasetInput');
    if (datasetInput) {
      datasetInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            displayCSVPreview(e.target.result);
          };
          reader.readAsText(file);
        }
      });
    }

    // Prediction Form in Dashboard
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
      predictionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isFraud = Math.random() < 0.3;
        if (isFraud) {
          showPopup("Fraud Detected!", "error");
        } else {
          showPopup("Legitimate Transaction", "success");
        }
      });
    }
  }
});

// Function to switch between dashboard sections
function showSection(sectionId) {
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add('active');
  }
}

// Evaluate and show model accuracy in Dashboard
function showAccuracy() {
  const modelSelect = document.getElementById('modelSelect');
  const accuracyResult = document.getElementById('accuracyResult');
  const model = modelSelect.value;
  const accuracies = {
    rf: '95% Accuracy',
    lr: '90% Accuracy',
    svm: '85% Accuracy'
  };
  accuracyResult.textContent = accuracies[model];
}

// Updated displayCSVPreview: Show all rows
function displayCSVPreview(data) {
  const preview = document.getElementById('datasetPreview');
  const rows = data.split('\n');
  let html = '<table>';
  rows.forEach(row => {
    html += '<tr>';
    row.split(',').forEach(cell => {
      html += `<td>${cell}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  preview.innerHTML = html;
}

// Background Zoom Effect on Scroll
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY;
  const scaleVal = 1 + scrollPos / 1000;
  document.documentElement.style.setProperty('--bg-scale', scaleVal);
});

// New function to show popup message
function showPopup(message, type) {
  let popup = document.getElementById('popupMessage');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'popupMessage';
    document.body.appendChild(popup);
  }
  popup.textContent = message;
  popup.className = type; // "success" or "error"
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}

// --- New Code for Password Validation (Registration Page) ---
const passwordInput = document.getElementById('password');
if (passwordInput) {
  const conditions = {
    length: { regex: /.{8,}/, element: document.getElementById('lengthCondition') },
    uppercase: { regex: /[A-Z]/, element: document.getElementById('uppercaseCondition') },
    lowercase: { regex: /[a-z]/, element: document.getElementById('lowercaseCondition') },
    number: { regex: /[0-9]/, element: document.getElementById('numberCondition') },
    special: { regex: /[!@#$%^&*(),.?":{}|<>]/, element: document.getElementById('specialCondition') }
  };

  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    Object.keys(conditions).forEach(key => {
      const condition = conditions[key];
      if (condition.regex.test(value)) {
        condition.element.classList.add('valid');
        condition.element.classList.remove('invalid');
      } else {
        condition.element.classList.add('invalid');
        condition.element.classList.remove('valid');
      }
    });
  });
}
