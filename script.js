// User data storage (in a real app, this would be on a server)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Function to reload users from localStorage
function reloadUsers() {
    users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Users reloaded:', users);
}

// Create optimized snowflakes
function createSnow() {
    const snowContainer = document.getElementById('snowContainer');
    const snowflakeCount = 60;
    
    // Clear any existing snow
    snowContainer.innerHTML = '';
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Random properties for each snowflake
        const size = Math.random() * 4 + 1;
        const startPosition = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;
        const opacity = Math.random() * 0.5 + 0.3;
        const delay = Math.random() * 10;
        
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${startPosition}%`;
        snowflake.style.opacity = opacity;
        snowflake.style.animationDuration = `${animationDuration}s`;
        snowflake.style.animationDelay = `${delay}s`;
        
        snowContainer.appendChild(snowflake);
    }
}

// Show message
function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthElement = document.getElementById('passwordStrength');
    
    if (password.length === 0) {
        strengthElement.style.display = 'none';
        return;
    }
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    if (strength < 2) {
        feedback = 'Weak';
        strengthElement.className = 'password-strength strength-weak';
    } else if (strength < 4) {
        feedback = 'Medium';
        strengthElement.className = 'password-strength strength-medium';
    } else {
        feedback = 'Strong';
        strengthElement.className = 'password-strength strength-strong';
    }
    
    strengthElement.textContent = `Password strength: ${feedback}`;
    strengthElement.style.display = 'block';
}

// Setup password toggle functionality
function setupPasswordToggle(passwordId, toggleId) {
    const togglePassword = document.getElementById(toggleId);
    const passwordInput = document.getElementById(passwordId);
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

// Language selector functionality
function setupLanguageSelector() {
    const languageOptions = document.querySelectorAll('.language-option');
    
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options in the same container
            const container = this.closest('.language-selector');
            container.querySelectorAll('.language-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            this.classList.add('active');
        });
    });
}

// Form switching functionality
function setupFormSwitching() {
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const showLoginFromForgot = document.getElementById('showLoginFromForgot');
    const forgotPassword = document.getElementById('forgotPassword');
    
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const forgotCard = document.getElementById('forgotCard');
    
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginCard.classList.add('hidden');
        registerCard.classList.remove('hidden');
        forgotCard.classList.add('hidden');
    });
    
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
        forgotCard.classList.add('hidden');
        reloadUsers(); // RELOAD USERS WHEN SWITCHING TO LOGIN FORM
    });
    
    showLoginFromForgot.addEventListener('click', function(e) {
        e.preventDefault();
        forgotCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
        registerCard.classList.add('hidden');
        reloadUsers(); // RELOAD USERS WHEN SWITCHING TO LOGIN FORM
    });
    
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        loginCard.classList.add('hidden');
        registerCard.classList.add('hidden');
        forgotCard.classList.remove('hidden');
    });
}

// Login form functionality
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Always reload users before login attempt
        reloadUsers();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        console.log('Login attempt:', username, password);
        console.log('Available users:', users);
        
        // Simple validation
        if (!username || !password) {
            showMessage('loginMessage', 'Please fill in all fields', 'error');
            return;
        }
        
        // Check if user exists
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            showMessage('loginMessage', 'Login successful! Redirecting...', 'success');
            
            // Simulate redirect after 2 seconds
            setTimeout(() => {
                alert(`Welcome back, ${username}!`);
                loginForm.reset();
            }, 2000);
        } else {
            showMessage('loginMessage', 'Invalid username or password', 'error');
            console.log('Login failed - user not found or password mismatch');
        }
    });
}

// Registration form functionality
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    const registerPassword = document.getElementById('registerPassword');
    
    // Password strength indicator
    registerPassword.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (!username || !email || !password || !confirmPassword) {
            showMessage('registerMessage', 'Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('registerMessage', 'Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('registerMessage', 'Password must be at least 6 characters', 'error');
            return;
        }
        
        // Check if username already exists
        if (users.find(u => u.username === username)) {
            showMessage('registerMessage', 'Username already exists', 'error');
            return;
        }
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            showMessage('registerMessage', 'Email already registered', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            username,
            email,
            password
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage (in a real app, this would be a server call)
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('New user registered:', newUser);
        console.log('All users after registration:', users);
        
        showMessage('registerMessage', 'Registration successful! Redirecting to login...', 'success');
        
        // Simulate redirect to login after 2 seconds
        setTimeout(() => {
            registerForm.reset();
            document.getElementById('passwordStrength').style.display = 'none';
            
            // Switch to login form
            document.getElementById('registerCard').classList.add('hidden');
            document.getElementById('loginCard').classList.remove('hidden');
            
            document.getElementById('loginUsername').value = username;
            
            // RELOAD USERS AFTER REGISTRATION
            reloadUsers();
        }, 2000);
    });
}

// Forgot password functionality
function setupForgotForm() {
    const forgotForm = document.getElementById('forgotForm');
    
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reload users before checking
        reloadUsers();
        
        const email = document.getElementById('forgotEmail').value;
        
        if (!email) {
            showMessage('forgotMessage', 'Please enter your email', 'error');
            return;
        }
        
// Check if email exists
        const user = users.find(u => u.email === email);
        
        if (user) {
            showMessage('forgotMessage', 'Password reset link sent to your email', 'success');
            setTimeout(() => {
                alert(`Password reset link sent to ${email}`);
                forgotForm.reset();
                
// Switch to login form
                document.getElementById('forgotCard').classList.add('hidden');
                document.getElementById('loginCard').classList.remove('hidden');
            }, 2000);
        } else {
            showMessage('forgotMessage', 'Email not found in our system', 'error');
        }
    });
}

// Initialized everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    createSnow();
    setupPasswordToggle('loginPassword', 'toggleLoginPassword');
    setupPasswordToggle('registerPassword', 'toggleRegisterPassword');
    setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');
    setupLanguageSelector();
    setupFormSwitching();
    setupLoginForm();
    setupRegisterForm();
    setupForgotForm();
    
    console.log('Initial users loaded:', users);
});