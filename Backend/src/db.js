const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres', // ou o usuário que você configurou
  password: 'Viruz@2003', // sua senha
  database: 'synthex', // o nome do seu banco de dados PostgreSQL
  port: 5432, // porta padrão do PostgreSQL
});

module.exports = pool;
