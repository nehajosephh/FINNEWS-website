// Add this at the beginning of your script
let lastScrollTop = 0;

// Navigation scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    }
});

// Login button click handler
document.querySelector('.login-btn').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Login functionality would be implemented here');
});

// Get Started button click handler
document.querySelector('.get-started').addEventListener('click', function() {
    alert('Registration functionality would be implemented here');
});

// Search functionality
document.querySelector('.search-bar input').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        alert(Searching for: ${this.value});
    }
});

// Simple smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
