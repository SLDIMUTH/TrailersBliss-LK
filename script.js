// 1. Loader අයින් කිරීම (පේජ් එක ලෝඩ් වුණාම)
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    setTimeout(function() {
        loader.classList.add('fade-out');
    }, 500); // තත්පර බාගයකින් ලෝඩර් එක අයින් වෙනවා
});

// 2. Theme Switcher (Dark & Light Mode)
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// කලින් සේව් කරපු Theme එක තියාගන්න (පේජ් එක රිෆ්‍රෙශ් කරත් පාට වෙනස් වෙන්නේ නෑ)
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
}

themeToggleBtn.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); // Light mode සේව් කිරීම
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); // Dark mode සේව් කිරීම
    }
});

// 3. Sidebar Active Link Highlighter
// (ලින්ක් එකක් ක්ලික් කළාම ඒක කහ පාට වෙලා පෙන්වන්න)
const premiumLinks = document.querySelectorAll('.premium-link');

premiumLinks.forEach(link => {
    link.addEventListener('click', function() {
        // දැනට තියෙන active class එක හැම එකෙන්ම අයින් කරනවා
        premiumLinks.forEach(l => l.classList.remove('active'));
        
        // ක්ලික් කරපු ලින්ක් එකට විතරක් active class එක දානවා
        this.classList.add('active');
    });
});