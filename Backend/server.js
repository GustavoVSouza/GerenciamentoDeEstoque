const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/db.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Rotas
const usuariosRouter = require('./src/usuarios.js');
const produtosRouter = require('./src/produtos.js');
const pedidosRouter = require('./src/pedidos.js');

app.use('/usuarios', usuariosRouter);
app.use('/produtos', produtosRouter);
app.use('/pedidos', pedidosRouter);

// Inicie o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
