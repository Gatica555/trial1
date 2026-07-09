// ======================
// NAVIGATION
// ======================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${pageId}'`)) {
            link.classList.add('active');
        }
    });
}

// ======================
// AUTHENTICATION + PLAY BUTTON
// ======================
let currentMode = 'login';

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const emailGroup = document.getElementById('emailGroup');
    const confirmGroup = document.getElementById('confirmGroup');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const authForm = document.getElementById('authForm');
    const successScreen = document.getElementById('successScreen');

    if (!tabs.length) return;

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            currentMode = tab.dataset.mode;

            if (currentMode === 'signup') {
                emailGroup.style.display = 'block';
                confirmGroup.style.display = 'block';
                btnText.textContent = 'CREATE_ACCOUNT';
                submitBtn.setAttribute('data-text', 'CREATE_ACCOUNT');
            } else {
                emailGroup.style.display = 'none';
                confirmGroup.style.display = 'none';
                btnText.textContent = 'INITIATE_CONNECTION';
                submitBtn.setAttribute('data-text', 'INITIATE_CONNECTION');
            }
        });
    });

    // Form submission
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                alert("⚠️ ACCESS DENIED: Missing credentials");
                return;
            }

            // Success → Show PLAY Button
            authForm.style.display = 'none';
            successScreen.style.display = 'flex';

            if (currentMode === 'login') {
                document.getElementById('successTitle').textContent = "CONNECTION ESTABLISHED";
            } else {
                document.getElementById('successTitle').textContent = "ACCOUNT CREATED";
            }
        });
    }
});

// Go back to auth form (optional)
function resetAuth() {
    document.getElementById('authForm').style.display = 'block';
    document.getElementById('successScreen').style.display = 'none';
}