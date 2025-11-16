// Carrega as variáveis de ambiente (precisa ser no topo)
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Importa nossas rotas
const authRoutes = require('./routes/auth');
const jokeRoutes = require('./routes/jokes');

// Cria a aplicação Express
const app = express();

// Configura o middleware para aceitar JSON no corpo das requisições
app.use(express.json());

// Configura o CORS para permitir requisições do seu frontend
// (No futuro, você pode restringir isso para 'http://localhost:3000')
app.use(cors());

// Define a porta do servidor
const PORT = process.env.PORT || 3001; // Usamos 3001 para não conflitar com o React (3000)

// --- Rotas da API ---
// Todas as rotas de autenticação (login) ficarão sob '/api/auth'
app.use('/api/auth', authRoutes);
app.use('/api/jokes', jokeRoutes);

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Acesse http://localhost:3001');
});