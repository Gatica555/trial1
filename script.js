const tabs = document.querySelectorAll('.tab');
const emailGroup = document.getElementById('emailGroup');
const confirmGroup = document.getElementById('confirmGroup');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');

let currentMode = 'login';

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
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (currentMode === 'login') {
        alert(`🔐 LOGIN ATTEMPT\nUsername: ${username}\nAccess Key: ${password}`);
    } else {
        const email = document.getElementById('email').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (password !== confirm) {
            alert("❌ ACCESS_KEYS DO NOT MATCH");
            return;
        }

        alert(`✅ ACCOUNT CREATED\nUsername: ${username}\nEmail: ${email}`);
    }
});