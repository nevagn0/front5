const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const users = require('./users');
const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersecretkey';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Главная страница - форма регистрации
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Маршрут регистрации
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Имя пользователя и пароль обязательны' });
    }
    if (users.findUser(username)) {
        return res.status(409).json({ message: 'Пользователь уже существует' });
    }
    users.addUser(username, password);
    res.json({ message: 'Пользователь зарегистрирован' });
});

// Маршрут входа
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.findUser(username);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Неверные имя пользователя или пароль' });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware для проверки JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Защищенный маршрут
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: `Привет, ${req.user.username}! Это защищенные данные.` });
});

app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
