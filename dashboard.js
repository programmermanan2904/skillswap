/**
 * SkillSwap - Dashboard Navigation System
 * Handles navigation and sidebar functionality with performance optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle for mobile
    initializeSidebarToggle();
    
    // Initialize user profile dropdown
    initializeUserProfile();
    
    // Initialize active navigation item
    setActiveNavigationItem();
    
    // Optimize navigation performance
    optimizeNavigationPerformance();
});

/**
 * Initialize sidebar toggle for mobile
 */
function initializeSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.add('show');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            sidebar.classList.remove('show');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992 && 
            sidebar.classList.contains('show') && 
            !sidebar.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });
}

/**
 * Initialize user profile dropdown
 */
function initializeUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    
    if (userProfile) {
        // Make the user profile clickable to navigate to profile page
        userProfile.style.cursor = 'pointer';
        userProfile.addEventListener('click', function() {
            // If there's a dropdown, toggle it
            const dropdown = document.querySelector('.profile-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('show');
            } else {
                // If no dropdown, navigate to profile page
                window.location.href = 'profile.html';
            }
        });
        
        // Update user information from localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            
            // Update username if available
            const userNameElement = userProfile.querySelector('.user-info h6');
            if (userNameElement && user.name) {
                userNameElement.textContent = user.name;
            }
            
            // Update avatar if available
            if (user.photo) {
                const avatarElement = userProfile.querySelector('.avatar');
                if (avatarElement) {
                    avatarElement.src = user.photo;
                }
            } else {
                // Check if there's a profilePhoto in localStorage
                const profilePhoto = localStorage.getItem('profilePhoto');
                if (profilePhoto) {
                    const avatarElement = userProfile.querySelector('.avatar');
                    if (avatarElement) {
                        avatarElement.src = profilePhoto;
                    }
                }
            }
        }
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.profile-dropdown');
        if (dropdown && dropdown.classList.contains('show') && !userProfile.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

/**
 * Set active navigation item based on current page
 */
function setActiveNavigationItem() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Find the navigation link that matches the current page
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    // First, remove active class from all nav items
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Then find and activate the current page's nav item
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Skip if it's not a page link
        if (linkHref === '#' || link.classList.contains('logout')) {
            return;
        }
        
        // Check if this link points to the current page
        if (currentPath.includes(linkHref)) {
            // Add active class to the current item
            link.closest('.nav-item').classList.add('active');
        }
    });
}

/**
 * Show error message
 */
function showError(message) {
    // Create error alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alert.style.zIndex = '9999';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    }, 5000);
}

/**
 * Optimize navigation performance
 */
function optimizeNavigationPerformance() {
    // Preload pages on hover
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip if it's not a page link or is the current page
        if (!href || href === '#' || href.startsWith('http') || 
            window.location.pathname.endsWith(href) || 
            link.classList.contains('logout')) {
            return;
        }
        
        // Preload page on hover
        link.addEventListener('mouseenter', function() {
            const linkElement = document.createElement('link');
            linkElement.rel = 'prefetch';
            linkElement.href = href;
            document.head.appendChild(linkElement);
        });
        
        // Add smooth transition class
        link.classList.add('smooth-transition');
    });
    
    // Add active state feedback
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
            const navLink = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');
            
            // Skip if it's not a page link or is the logout link
            if (navLink.getAttribute('href') === '#' || navLink.classList.contains('logout')) {
                return;
            }
            
            // Add active state
            navLink.classList.add('clicked');
            
            // Remove active state after transition
            setTimeout(() => {
                navLink.classList.remove('clicked');
            }, 300);
        }
    });
}
