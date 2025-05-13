let token = '';

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    document.getElementById('reg-result').innerText = data.message;
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.token) {
        token = data.token;
        document.getElementById('login-result').innerText = 'Вход выполнен';
    } else {
        document.getElementById('login-result').innerText = data.message;
    }
}

async function getProtected() {
    const response = await fetch('/api/protected', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    document.getElementById('protected-result').innerText = data.message || 'Нет доступа';
}
