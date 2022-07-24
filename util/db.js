const mysql = require("mysql2");

const db=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'KRITARTHsoni@12345',
    database: 'login'
});

module.exports = db;