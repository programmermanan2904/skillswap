// Authentication state
let currentUser = null;

// Check if user is already logged in
function redirectIfAuthenticated() {
    if (currentUser) {
        window.location.href = 'dashboard.html';
    }
}

// Authentication functions
const auth = {
    login: function(email, password) {
        // TODO: Replace with actual API call
        if (email && password) {
            currentUser = {
                name: 'Alex Thompson',
                email: email,
                avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=1'
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        }
        return false;
    },

    register: function(name, email, password) {
        // TODO: Replace with actual API call
        if (name && email && password) {
            currentUser = {
                name: name,
                email: email,
                avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=' + Math.random()
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        }
        return false;
    },

    logout: function() {
        // Show confirmation dialog
        if (confirm("Are you sure you want to log out?")) {
            // Clear user data
            currentUser = null;
            
            // Clear all authentication data from localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('email');
            localStorage.removeItem('auth_data');
            
            // Clear entire localStorage if needed
            // localStorage.clear();
            
            // Redirect to login page
            window.location.href = 'login.html';
        }
    },

    getCurrentUser: function() {
        if (!currentUser) {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                currentUser = JSON.parse(storedUser);
            }
        }
        return currentUser;
    }
};

// Check authentication state on page load and set up logout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
    
    // Set up logout button functionality
    const logoutButtons = document.querySelectorAll('.logout, .nav-link.logout, a.logout, button.logout');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            auth.logout();
        });
    });
    
    // Check if current page requires authentication
    const protectedPages = [
        'dashboard.html', 'profile.html', 'settings.html', 
        'chat.html', 'matching.html', 'schedule.html',
        'feedback.html', 'requests.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    // If this is a protected page and user is not logged in, redirect to login
    if (protectedPages.includes(currentPage) && !auth.getCurrentUser()) {
        window.location.href = 'login.html';
    }
}); 