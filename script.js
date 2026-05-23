// 1. Firebase ලයිබ්‍රරි එක import කරගන්න (CDN හරහා)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. ඔයාගේ Firebase Config එක (ඔයාගේ පින්තූරේ තියෙන විස්තර)
const firebaseConfig = {
  apiKey: "AIzaSyDRPro7oeI4z3faIUGoqW_xLZGF2dH-PwA",
  authDomain: "trailersbliss.firebaseapp.com",
  projectId: "trailersbliss",
  storageBucket: "trailersbliss.firebasestorage.app",
  messagingSenderId: "363232415056",
  appId: "1:363232415056:web:c832a34c61619c4e7a3055",
  measurementId: "G-NSXBVWL28C"
};

// 3. Firebase Initialize කිරීම
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// දැන් db කියන එක පාවිච්චි කරලා ඔයාට trailers add කරන්න පුළුවන්
console.log("Firebase සම්බන්ධ වුණා!");

// ==========================================
// ඔයාගේ මුල් කෝඩ් එක මෙතැන් සිට ආරම්භ වේ
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. Theme Toggle (Dark/Light Mode) Script
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
            }
        });
    }

    // ==========================================
    // 2. SCROLL BLUR EFFECT SCRIPT
    // ==========================================
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('mainNavbar');
        if (navbar) {
            // පහළට පික්සල් 50ක් ගිය ගමන් Blur effect එක On වෙනවා
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // ==========================================
    // 3. ADMIN SYSTEM SCRIPT
    // ==========================================

    const loginBtn = document.getElementById('loginBtn');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    const addTrailerForm = document.getElementById('addTrailerForm');
    const dynamicTrailers = document.getElementById('dynamic-trailers');

    // Page එක ලෝඩ් වෙද්දි Firebase එකෙන් ට්‍රේලර්ස් පෙන්නන්න
    loadTrailersFromFirebase();

    // Admin Login එකේ Password එක Check කිරීම
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const password = adminPasswordInput.value;
            
            // ඔයාගේ Admin Password එක (adminyenuka)
            if (password === 'adminyenuka') { 
                
                // Password හරි නම් Error එක හංගන්න
                loginError.classList.add('d-none');
                
                // Login Modal එක වහන්න
                const loginModalEl = document.getElementById('adminLoginModal');
                const loginModal = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
                loginModal.hide();
                
                // Password කොටුව හිස් කරන්න
                adminPasswordInput.value = '';

                // Dashboard (Add Trailer) Modal එක ඕපන් කරන්න
                const dashboardModal = new bootstrap.Modal(document.getElementById('adminDashboardModal'));
                dashboardModal.show();
                
            } else {
                // Password වැරදි නම් Error එක පෙන්නන්න
                loginError.classList.remove('d-none');
            }
        });
    }

    // අලුත් ට්‍රේලර් එකක් Publish කිරීම
    if (addTrailerForm) {
        // Firebase එකට දාන්න වෙලාව යන නිසා මෙතනට 'async' එකතු කළා
        addTrailerForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Page එක රීලෝඩ් වෙන එක නවත්තනවා

            // ෆෝම් එකෙන් විස්තර ටික ගන්නවා
            const title = document.getElementById('movieTitle').value;
            const year = document.getElementById('movieYear').value;
            const image = document.getElementById('movieImage').value;
            const trailer = document.getElementById('movieTrailer').value;

            // අලුත් ට්‍රේලර් Object එකක් හදනවා
            const newTrailer = { title, year, image, trailer };

            // Website එකේ පේන්න Add කරනවා (මුලින්ම UI එකට දානවා)
            addTrailerToUI(newTrailer);

            // ඒක Firebase Database එකේ Save කරනවා
            await saveTrailerToFirebase(newTrailer);

            // ෆෝම් එක හිස් කරලා Modal එක වහනවා
            addTrailerForm.reset();
            const dashboardModalEl = document.getElementById('adminDashboardModal');
            const dashboardModal = bootstrap.Modal.getInstance(dashboardModalEl);
            dashboardModal.hide();
            
            alert('Trailer Added Successfully! 🎉');
        });
    }

    // ==========================================
    // 4. FIREBASE DATABASE FUNCTIONS
    // ==========================================

    // Firebase එකට Save කරන Function එක
    async function saveTrailerToFirebase(trailer) {
        try {
            await addDoc(collection(db, "trailers"), trailer);
            console.log("Trailer saved to Firebase successfully!");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    // Firebase එකෙන් අරන් පෙන්නන Function එක
    async function loadTrailersFromFirebase() {
        try {
            const querySnapshot = await getDocs(collection(db, "trailers"));
            querySnapshot.forEach((doc) => {
                addTrailerToUI(doc.data());
            });
        } catch (e) {
            console.error("Error loading trailers: ", e);
        }
    }

    // HTML එකට අලුත් Movie Card එකක් එකතු කරන Function එක
    function addTrailerToUI(trailer) {
        if (!dynamicTrailers) return;

        const colDiv = document.createElement('div');
        colDiv.className = 'col-6 col-md-4 col-lg-3';
        
        colDiv.innerHTML = `
            <a href="${trailer.trailer}" class="movie-card" target="_blank">
                <div class="year-badge">${trailer.year}</div>
                <div class="sub-badge">SINHALA SUB</div>
                <img src="${trailer.image}" alt="Movie Poster">
                <div class="movie-info">
                    <h5 class="movie-title">${trailer.title}</h5>
                </div>
            </a>
        `;
        
        // අලුතින්ම දාන එක මුලටම එන්න ඕනේ නිසා prepend() පාවිච්චි කරනවා
        dynamicTrailers.prepend(colDiv);
    }

});