const express = require('express');
const app = require('./app-express.js');
const jwt = require('jsonwebtoken');

// Middleware para autenticar o token
const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ mensagem: 'Token não fornecido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ mensagem: 'Token inválido ou expirado' });
        req.usuario = usuario;
        next();
    });
};

// Rota de login para gerar o token
app.post('/login', (req, res) => {
    const dados = req.body;

    // Gera o token JWT
    const tokenDeAcesso = jwt.sign(dados, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Opcionalmente decodifica o token para fins de depuração ou exibição
    const decodificado = jwt.verify(tokenDeAcesso, process.env.JWT_SECRET);
    
    res.json({ tokenDeAcesso, decodificado });
});

// Rota protegida usando o middleware autenticarToken
app.get('/meus-pedidos', autenticarToken, (req, res) => {
    res.json({ mensagem: "Recurso protegido", usuario: req.usuario });
});

// Tratamento global de erros (opcional para melhorar a exibição de erros)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensagem: 'Algo deu errado!' });
});
