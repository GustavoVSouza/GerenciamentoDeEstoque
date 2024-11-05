const express = require('express');
const db = require('./db.js');
const { format } = require('date-fns');

const router = express.Router();

// Cria um novo pedido
router.post('/', async (req, res) => {
    const { usuario_id, produto_id, quantidade, status } = req.body;

    try {
        const dataCriacao = new Date();
        const dataFormatada = format(dataCriacao, 'yyyy-MM-dd HH:mm:ss');

        const query = 'INSERT INTO pedidos (usuario_id, produto_id, quantidade, status, data_criacao) VALUES ($1, $2, $3, $4, $5)';
        await db.query(query, [usuario_id, produto_id, quantidade, status, dataFormatada]);
        res.status(201).send('Pedido criado com sucesso');
    } catch (err) {
        console.error('Erro ao inserir pedido:', err);
        res.status(500).json({ error: 'Erro ao inserir pedido', details: err });
    }
});

// Deleta um pedido
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pedidos WHERE id = $1';

    try {
        await db.query(query, [id]);
        res.status(200).send('Pedido deletado com sucesso');
    } catch (err) {
        console.error('Erro ao deletar pedido:', err);
        res.status(500).send('Erro ao deletar pedido');
    }
});

// Busca todos os pedidos
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM pedidos');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
});

module.exports = router;
