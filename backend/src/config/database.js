require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL;

// CONFIGURAÇÃO DO POOL DE CONEXÕES (EXPLÍCITA)
const client = new MongoClient(uri, {
  maxPoolSize: 10, // Mantém até 10 conexões ativas no pool
  minPoolSize: 2,  // Mantém pelo menos 2 conexões ativas
});

async function connectToDatabase() {
    // ... (o resto da função continua igual)
    try {
        await client.connect();
        console.log('Conectado ao MongoDB com sucesso!');
        const db = client.db('jokesdb');
        return { client, db };
      } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
      }
}

module.exports = { connectToDatabase };