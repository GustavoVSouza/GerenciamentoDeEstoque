const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db.js');
const { format } = require('date-fns');

const router = express.Router();

// Cria um novo usuário
router.post('/', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        const dataCriacao = new Date();
        const dataFormatada = format(dataCriacao, 'yyyy-MM-dd HH:mm:ss');

        const query = 'INSERT INTO usuarios (nome, email, senha, data_criacao) VALUES ($1, $2, $3, $4)';
        await db.query(query, [nome, email, hashedPassword, dataFormatada]);
        res.status(201).send('Usuário criado com sucesso');
    } catch (err) {
        console.error('Erro ao inserir usuário:', err);
        res.status(500).json({ error: 'Erro ao inserir usuário', details: err });
    }
});

// Deleta um usuário
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuarios WHERE id = $1';

    try {
        await db.query(query, [id]);
        res.status(200).send('Usuário deletado com sucesso');
    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        res.status(500).send('Erro ao deletar usuário');
    }
});

// Função para autenticar o usuário
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;


    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const rows = result.rows;

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, rows[0].senha);

        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        const token = jwt.sign({ id: rows[0].id }, 'secreta-chave', { expiresIn: '1h' });

        // Retorne status 200 e o token
        res.status(200).json({ token, user: { id: rows[0].id, nome: rows[0].nome, email: rows[0].email } });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

module.exports = router;
