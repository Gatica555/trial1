// ======================
// PAGE NAVIGATION
// ======================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(pageId);
    targetPage.style.display = 'block';
    setTimeout(() => targetPage.classList.add('active'), 10);
}

// ======================
// AUTH
// ======================
let currentMode = 'login';

function switchTab(n) {
    currentMode = n === 0 ? 'login' : 'signup';
    document.getElementById('emailGroup').style.display = currentMode === 'signup' ? 'block' : 'none';
    document.getElementById('confirmGroup').style.display = currentMode === 'signup' ? 'block' : 'none';
}

document.getElementById('authForm').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('authForm').style.display = 'none';
    document.getElementById('successScreen').style.display = 'flex';
});

function resetAuth() {
    document.getElementById('authForm').style.display = 'block';
    document.getElementById('successScreen').style.display = 'none';
}

// ======================
// MATRIX GAME + TOUCH SUPPORT
// ======================
let gameActive = false;
let score = 0;
let player = { x: 400, y: 400, size: 20 };

function enterSystem() {
    showPage('game');
    gameActive = true;
    score = 0;
    document.getElementById('score').textContent = 'SCORE: 999999999999';
    startMatrixGame();
}

function exitGame() {
    gameActive = false;
    showPage('home');
}

function startMatrixGame() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);
    let symbols = [], corrupted = [];

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
        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), i * 20, drops[i] * 20);
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }

        for (let i = symbols.length - 1; i >= 0; i--) {
            let s = symbols[i];
            ctx.fillText(s.char, s.x, s.y);
            s.y += s.speed;
            if (Math.hypot(s.x - player.x, s.y - player.y) < 25) {
                score += 10;
                document.getElementById('score').textContent = `SCORE: ${score.toString().padStart(4,'0')}`;
                symbols.splice(i, 1);
            }
            if (s.y > canvas.height) symbols.splice(i, 1);
        }

        ctx.fillStyle = '#ff0066';
        for (let i = corrupted.length - 1; i >= 0; i--) {
            let c = corrupted[i];
            ctx.fillText('☠', c.x, c.y);
            c.y += c.speed;
            if (Math.hypot(c.x - player.x, c.y - player.y) < 25) {
                alert("☠ SYSTEM CORRUPTED");
                exitGame();
                return;
            }
            if (c.y > canvas.height) corrupted.splice(i, 1);
        }

        ctx.fillStyle = '#00f2ea';
        ctx.fillRect(player.x - 12, player.y - 12, 24, 24);

        if (Math.random() < 0.4) createSymbol();
        if (Math.random() < 0.1) createCorrupted();

        requestAnimationFrame(draw);
    }

    // Keyboard Controls
    const keys = {};
    document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
    document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

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

    // ======================
    // TOUCH CONTROLS (Mobile)
    // ======================
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    canvas.addEventListener('touchmove', e => {
        if (!gameActive) return;
        e.preventDefault();

        const touchX = e.changedTouches[0].screenX;
        const touchY = e.changedTouches[0].screenY;

        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;

        player.x += deltaX * 0.8;
        player.y += deltaY * 0.8;

        player.x = Math.max(20, Math.min(780, player.x));
        player.y = Math.max(20, Math.min(480, player.y));

        touchStartX = touchX;
        touchStartY = touchY;
    });

    // Start everything
    draw();
    movePlayer();
}