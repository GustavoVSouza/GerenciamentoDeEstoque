const express = require('express');
const db = require('../config/db.js');
const { format } = require('date-fns');

const router = express.Router();

// Cria um novo cliente
router.post('/', async (req, res) => {
    const { nome, email, telefone } = req.body;

    try {
        const dataCriacao = new Date();
        const dataFormatada = format(dataCriacao, 'yyyy-MM-dd HH:mm:ss');

        const query = 'INSERT INTO clientes (nome, email, telefone, data_criacao) VALUES ($1, $2, $3, $4)';
        await db.query(query, [nome, email, telefone, dataFormatada]);
        res.status(201).send('Cliente criado com sucesso');
    } catch (err) {
        console.error('Erro ao inserir cliente:', err);
        res.status(500).json({ error: 'Erro ao inserir cliente', details: err });
    }
});

// Deleta um cliente
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id = $1';

    try {
        await db.query(query, [id]);
        res.status(200).send('Cliente deletado com sucesso');
    } catch (err) {
        console.error('Erro ao deletar cliente:', err);
        res.status(500).send('Erro ao deletar cliente');
    }
});

// Busca todos os clientes
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

module.exports = router;
