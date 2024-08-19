const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes, QueryTypes } = require('sequelize');

const app = express();
const port = 10000;

// Conexão com o banco de dados PostgreSQL
const sequelize = new Sequelize('postgresql://postgres.hspsjnkdtvcaiuxplsov:chuchu-diego-araujo@aws-0-us-west-1.pooler.supabase.com:6543/postgres');

// Definição do modelo User
const User = sequelize.define('User', {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

// Definição do modelo Category
const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    use_in_menu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    timestamps: true
});

// Sincronizar os modelos com o banco de dados
sequelize.sync();

// Middleware
app.use(bodyParser.json()); // Suporte a JSON
app.use(cors()); // Habilitar CORS

// Rota principal
app.get('/', (req, res) => {
    res.send('Olá, mundo');
});

// CRUD - Ler usuário pelo ID
app.get('/v1/user/:id', async (req, res) => {
    console.log('request.url', req.url);
    console.log('request.params.id', req.params.id);

    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Erro ao buscar usuário' });
    }
});

// CRUD - Criar um novo usuário
app.post('/v1/user', async (req, res) => {
    console.log('request.url', req.url);
    console.log('request.body', req.body);

    try {
        const newUser = await User.create(req.body);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ error: 'Erro ao criar usuário' });
    }
});

// CRUD - Atualizar um usuário
app.put('/v1/user/:id', async (req, res) => {
    console.log('request.url', req.url);
    console.log('request.body', req.body);

    try {
        const [updated] = await User.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedUser = await User.findOne({ where: { id: req.params.id } });
            res.send(updatedUser);
        } else {
            res.status(404).send({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Erro ao atualizar usuário' });
    }
});

// CRUD - Deletar um usuário
app.delete('/v1/user/:id', async (req, res) => {
    console.log('request.url', req.url);

    try {
        const deleted = await User.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.send({ message: `Usuário ID ${req.params.id} deletado com sucesso` });
        } else {
            res.status(404).send({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Erro ao deletar usuário' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
