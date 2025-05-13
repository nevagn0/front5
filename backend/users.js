// backend/users.js

const users = [];

// Найти пользователя по имени
function findUser(username) {
    return users.find(user => user.username === username);
}

// Добавить пользователя
function addUser(username, password) {
    users.push({ username, password });
}

module.exports = { findUser, addUser };
