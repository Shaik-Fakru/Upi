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
  if (currentUser && authLinksContainer) {
    // When logged in, show only the Logout button (Dashboard link is already in the main nav)
    authLinksContainer.innerHTML = `<button id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>`;
  } else if (authLinksContainer) {
    authLinksContainer.innerHTML = `<a href="register.html"><i class="fas fa-user-plus"></i> Register</a>
                                    <a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>`;
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

      // Save user info in localStorage (for demo purposes)
      const user = { name: fullName, email: email };
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Redirect to Dashboard
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
      // For demonstration, we skip password validation
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
        const predictionResult = document.getElementById('predictionResult');
        predictionResult.textContent = isFraud ? "Fraud Detected!" : "Legitimate Transaction";
        predictionResult.className = isFraud ? "fraud" : "legitimate";
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

// Display CSV preview for the uploaded dataset
function displayCSVPreview(data) {
  const preview = document.getElementById('datasetPreview');
  const rows = data.split('\n').slice(0, 5);
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
  // Adjust the divisor to control zoom speed (e.g., 1000 for subtle effect)
  const scaleVal = 1 + scrollPos / 1000;
  document.documentElement.style.setProperty('--bg-scale', scaleVal);
});
