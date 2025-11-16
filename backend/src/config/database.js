// Carrega as variáveis do .env para o process.env
require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB com sucesso!');

    const db = client.db('jokesdb'); // O nome do seu banco
    return { client, db };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra a aplicação se não conseguir conectar
  }
}

module.exports = { connectToDatabase };