function showPage(id) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(id);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        const target = link.dataset.target || link.getAttribute('href')?.slice(1);
        link.classList.toggle('active', target === id);
    });
}

let currentMode = 'login';
let gameActive = false;
let score = 0;
let player = { x: 400, y: 400, size: 20 };
const keys = {};

function switchTab(mode) {
    currentMode = mode;
    const isSignup = currentMode === 'signup';
    document.getElementById('emailGroup').classList.toggle('auth-hidden', !isSignup);
    document.getElementById('confirmGroup').classList.toggle('auth-hidden', !isSignup);
    document.getElementById('tab-login').classList.toggle('active', !isSignup);
    document.getElementById('tab-signup').classList.toggle('active', isSignup);
}

function resetAuth() {
    document.getElementById('authForm').style.display = 'block';
    document.getElementById('successScreen').classList.remove('active');
}

function enterSystem() {
    showPage('game');
    gameActive = true;
    score = 0;
    document.getElementById('score').textContent = 'SCORE: 0000';
    startMatrixGame();
}

function exitGame() {
    gameActive = false;
    showPage('home');
}

function startMatrixGame() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cols = Math.floor(canvas.width / 20);
    const drops = Array.from({ length: cols }, () => 1);
    const symbols = [];
    const corrupted = [];

    function createSymbol() {
        symbols.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - 100,
            speed: 3 + Math.random() * 4,
            char: String.fromCharCode(0x30A0 + Math.random() * 96)
        });
    }

    function createCorrupted() {
        corrupted.push({
            x: Math.random() * canvas.width,
            y: -30,
            speed: 4 + Math.random() * 3
        });
    }

    function draw() {
        if (!gameActive) return;
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff9f';
        ctx.font = '16px monospace';
        drops.forEach((drop, i) => {
            const text = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(text, i * 20, drop * 20);
            if (drop * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        });

        for (let i = symbols.length - 1; i >= 0; i--) {
            const s = symbols[i];
            ctx.fillText(s.char, s.x, s.y);
            s.y += s.speed;
            if (Math.hypot(s.x - player.x, s.y - player.y) < 25) {
                score += 10;
                document.getElementById('score').textContent = `SCORE: ${score.toString().padStart(4, '0')}`;
                symbols.splice(i, 1);
            } else if (s.y > canvas.height) {
                symbols.splice(i, 1);
            }
        }

        ctx.fillStyle = '#ff0066';
        for (let i = corrupted.length - 1; i >= 0; i--) {
            const c = corrupted[i];
            ctx.fillText('☠', c.x, c.y);
            c.y += c.speed;
            if (Math.hypot(c.x - player.x, c.y - player.y) < 25) {
                alert('☠ SYSTEM CORRUPTED');
                exitGame();
                return;
            }
            if (c.y > canvas.height) {
                corrupted.splice(i, 1);
            }
        }

        ctx.fillStyle = '#00f2ea';
        ctx.fillRect(player.x - 12, player.y - 12, 24, 24);

        if (Math.random() < 0.4) createSymbol();
        if (Math.random() < 0.1) createCorrupted();

        requestAnimationFrame(draw);
    }

    function movePlayer() {
        if (!gameActive) return;
        if (keys['arrowleft'] || keys['a']) player.x -= 7;
        if (keys['arrowright'] || keys['d']) player.x += 7;
        if (keys['arrowup'] || keys['w']) player.y -= 7;
        if (keys['arrowdown'] || keys['s']) player.y += 7;

        player.x = Math.max(20, Math.min(780, player.x));
        player.y = Math.max(20, Math.min(480, player.y));
        requestAnimationFrame(movePlayer);
    }

    draw();
    movePlayer();
}

function bindEvents() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const target = link.dataset.target || link.getAttribute('href')?.slice(1);
            if (target) showPage(target);
        });
    });

    document.getElementById('btnOpenAuth').addEventListener('click', () => showPage('auth'));
    document.getElementById('tab-login').addEventListener('click', () => switchTab('login'));
    document.getElementById('tab-signup').addEventListener('click', () => switchTab('signup'));
    document.getElementById('btnPlay').addEventListener('click', enterSystem);
    document.getElementById('btnBack').addEventListener('click', resetAuth);
    document.getElementById('btnExit').addEventListener('click', exitGame);

    document.getElementById('authForm').addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('successScreen').classList.add('active');
        document.getElementById('successTitle').textContent = currentMode === 'login' ? 'CONNECTION ESTABLISHED' : 'ACCOUNT CREATED';
    });
}

window.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    switchTab('login');
    document.getElementById('successScreen').classList.remove('active');
    document.getElementById('authForm').style.display = 'block';
    showPage('home');
    document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
    document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
});
