const app = require('./app-express.js');
const { User } = require('../models/models.js');

// Rota para testar o funcionamento
app.get('/', (req, res) => {
    res.send('Olá, mundo');
});

// Buscar um usuário por ID
app.get('/v1/user/:id', async (req, res) => {
    try {
        console.log('request.url', req.url); // debug
        console.log('request.params.id', req.params.id);

        const user = await User.findOne({ where: { id: req.params.id } });
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ mensagem: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).send({ mensagem: 'Erro ao buscar usuário', erro: error });
    }
});

// Criar um novo usuário
app.post('/v1/user', async (req, res) => {
    try {
        console.log('request.url', req.url); // debug
        console.log('request.body', req.body);

        const newUser = await User.create(req.body);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ mensagem: 'Erro ao criar usuário', erro: error });
    }
});

// Atualizar um usuário por ID
app.put('/v1/user/:id', async (req, res) => {
    try {
        console.log('request.url', req.url); // debug
        console.log('request.body', req.body);

        const [updated] = await User.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            res.send({ mensagem: 'Usuário atualizado com sucesso' });
        } else {
            res.status(404).send({ mensagem: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).send({ mensagem: 'Erro ao atualizar usuário', erro: error });
    }
});

// Excluir um usuário por ID
app.delete('/v1/user/:id', async (req, res) => {
    try {
        console.log('request.url', req.url); // debug

        const deleted = await User.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.send({ mensagem: `Usuário excluído com sucesso. Quantidade de linhas afetadas: ${deleted}` });
        } else {
            res.status(404).send({ mensagem: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).send({ mensagem: 'Erro ao excluir usuário', erro: error });
    }
});
