const app = require('./app-express.js');
const { Category } = require('../models/models.js');

// Rota para teste de funcionamento
app.get('/', (req, res) => {
    res.send('Olá, mundo');
});

// Buscar uma categoria por ID
app.get('/v1/category/:id', (request, res) => {
    console.log('request.url', request.url); // debug
    console.log('request.params.id', request.params.id);

    Category.findOne({ where: { id: request.params.id } })
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.status(404).send({ mensagem: 'Categoria não encontrada' });
            }
        })
        .catch((error) => res.status(500).send({ mensagem: 'Erro ao buscar categoria', erro: error }));
});

// Criar uma nova categoria
app.post('/v1/category', (request, res) => {
    console.log('request.url', request.url); // debug
    console.log('request.body', request.body);

    Category.create(request.body)
        .then((result) => res.status(201).send(result))
        .catch((error) => res.status(400).send({ mensagem: 'Erro ao criar categoria', erro: error }));
});

// Atualizar uma categoria existente por ID
app.put('/v1/category/:id', (request, res) => {
    console.log('request.url', request.url); // debug
    console.log('request.body', request.body);

    Category.update(request.body, { where: { id: request.params.id } })
        .then((result) => {
            if (result[0] > 0) {
                res.send({ mensagem: 'Categoria atualizada com sucesso' });
            } else {
                res.status(404).send({ mensagem: 'Categoria não encontrada' });
            }
        })
        .catch((error) => res.status(500).send({ mensagem: 'Erro ao atualizar categoria', erro: error }));
});

// Excluir uma categoria por ID
app.delete('/v1/category/:id', (request, res) => {
    console.log('request.url', request.url); // debug

    Category.destroy({ where: { id: request.params.id } })
        .then((result) => {
            if (result > 0) {
                res.send({ mensagem: `Excluí com sucesso ${result} categoria(s)` });
            } else {
                res.status(404).send({ mensagem: 'Categoria não encontrada' });
            }
        })
        .catch((error) => res.status(500).send({ mensagem: 'Erro ao excluir categoria', erro: error }));
});
