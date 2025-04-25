document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLinks = document.querySelectorAll('.toggle-form');
    
    // Check URL parameters for initial form display
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'signup') {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    }

    // Redirect if already authenticated
    redirectIfAuthenticated();

    // Toggle form visibility when clicking the links
    toggleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.toggle('active');
            signupForm.classList.toggle('active');
            // Clear any error messages when switching forms
            document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        });
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '🔒';
        });
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[name="email"]').value;
        const password = this.querySelector('input[name="password"]').value;

        try {
            if (auth.login(email, password)) {
                window.location.href = 'dashboard.html';
            } else {
                showError('Invalid email or password');
            }
        } catch (error) {
            showError('Login failed. Please try again.');
        }
    });

    // Password validation function
    function validatePassword(password) {
        const errors = [];
        
        // Check if first letter is capitalized
        if (!/^[A-Z]/.test(password)) {
            errors.push("Password must start with a capital letter");
        }
        
        // Check if password contains at least one number
        if (!/\d/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        
        // Check if password contains at least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push("Password must contain at least one special character");
        }
        
        return errors;
    }
    
    // Add password validation on input
    const signupPasswordInput = signupForm.querySelector('input[name="password"]');
    signupPasswordInput.addEventListener('input', function() {
        // Remove any existing password validation messages
        const existingValidation = document.getElementById('password-validation');
        if (existingValidation) {
            existingValidation.remove();
        }
        
        const password = this.value;
        if (password.length > 0) {
            const errors = validatePassword(password);
            
            if (errors.length > 0) {
                // Create validation message container
                const validationDiv = document.createElement('div');
                validationDiv.id = 'password-validation';
                validationDiv.className = 'password-validation alert alert-warning mt-2';
                
                // Add each error as a separate line
                errors.forEach(error => {
                    const errorLine = document.createElement('p');
                    errorLine.className = 'mb-1';
                    errorLine.textContent = error;
                    validationDiv.appendChild(errorLine);
                });
                
                // Insert after password field
                this.parentNode.appendChild(validationDiv);
            }
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const password = this.querySelector('input[name="password"]').value;
        
        // Validate password before submission
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            showError('Please fix the password issues: ' + passwordErrors.join(', '));
            return;
        }

        try {
            if (auth.register(name, email, password)) {
                window.location.href = 'dashboard.html';
            } else {
                showError('Registration failed. Please check your inputs.');
            }
        } catch (error) {
            showError('Registration failed. Please try again.');
        }
    });
});

function showError(message) {
    // Remove any existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message alert alert-danger';
    errorDiv.textContent = message;
    
    // Insert the error message at the top of the active form
    const activeForm = document.querySelector('.auth-form.active');
    activeForm.insertBefore(errorDiv, activeForm.firstChild);
    
    // Remove the error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
