const express = require('express');
const db = require('./db');
const { format } = require('date-fns');

const router = express.Router();

// Cria um novo produto
router.post('/', async (req, res) => {
    const { nome, descricao, preco, quantidade } = req.body;

    try {
        const dataCriacao = new Date();
        const dataFormatada = format(dataCriacao, 'yyyy-MM-dd HH:mm:ss');

        const query = 'INSERT INTO produtos (nome, descricao, preco, quantidade, data_criacao) VALUES ($1, $2, $3, $4, $5)';
        await db.query(query, [nome, descricao, preco, quantidade, dataFormatada]);
        res.status(201).send('Produto criado com sucesso');
    } catch (err) {
        console.error('Erro ao inserir produto:', err);
        res.status(500).json({ error: 'Erro ao inserir produto', details: err });
    }
});

// Atualiza um produto existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;

    try {
        const dataAtualizacao = new Date();
        const dataFormatada = format(dataAtualizacao, 'yyyy-MM-dd HH:mm:ss');

        const query = 'UPDATE produtos SET nome = $1, descricao = $2, preco = $3, quantidade = $4, data_atualizacao = $5 WHERE id = $6';
        await db.query(query, [nome, descricao, preco, quantidade, dataFormatada, id]);
        res.status(200).send('Produto atualizado com sucesso');
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).json({ error: 'Erro ao atualizar produto', details: err });
    }
});

// Deleta um produto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM produtos WHERE id = $1';

    try {
        await db.query(query, [id]);
        res.status(200).send('Produto deletado com sucesso');
    } catch (err) {
        console.error('Erro ao deletar produto:', err);
        res.status(500).json({ error: 'Erro ao deletar produto', details: err });
    }
});

// Busca todos os produtos
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM produtos');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

module.exports = router;
