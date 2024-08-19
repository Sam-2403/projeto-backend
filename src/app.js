require('dotenv').config(); // Carregar variáveis de ambiente

const jwt = require('jsonwebtoken'); // Importar a biblioteca JWT

// Carregar as rotas da aplicação
require('./routes/authRoutes');
require('./routes/userRoutes');
require('./routes/productRoutes');
require('./routes/categoryRoutes');

// Carregar o arquivo principal do Express
const app = require('./routes/app-express');

// Definir a porta da aplicação
const PORT = process.env.PORT || 10000;

// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`); // Mensagem mais descritiva ao iniciar o servidor
});
