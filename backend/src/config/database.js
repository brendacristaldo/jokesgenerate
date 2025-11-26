// backend/src/config/database.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL;

// --- IMPLEMENTAÇÃO DE PERFORMANCE (Pool de Conexões) ---
// Definimos maxPoolSize: 10 para garantir que o servidor reaproveite conexões
// em vez de abrir e fechar uma nova a cada requisição.
const client = new MongoClient(uri, {
  maxPoolSize: 10, // Mantém até 10 conexões abertas prontas para uso
  minPoolSize: 1,  // Mantém pelo menos 1 conexão sempre aberta
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB com sucesso (Pool Configurado)!');

    const db = client.db('jokesdb');
    return { client, db };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };