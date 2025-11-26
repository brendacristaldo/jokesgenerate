// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const xss = require('xss');
const winston = require('winston');
const expressWinston = require('express-winston');

// --- 1. REQUISITO DE PERFORMANCE: Compressão ---
const compression = require('compression'); 

// Importa nosso Cache Manual (que criamos no passo anterior)
const simpleCache = require('./middleware/cache');

const authRoutes = require('./routes/auth');
const jokeRoutes = require('./routes/jokes');
const database = require('./config/database');

const app = express();

// --- 1. CONFIGURAÇÃO DE LOGS (Monitoramento) ---
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'access.log' })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
}));

// --- ATIVA A COMPRESSÃO GZIP ---
// Deve vir antes das rotas para comprimir tudo o que for enviado
app.use(compression());

// Configurações padrão do Express
app.use(cors());
app.use(express.json());

// --- 2. MIDDLEWARE ANTI-XSS (Segurança) ---
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
      }
    }
  }
  next();
});

// Conexão com Banco de Dados
database.connectToDatabase();

// Rotas
app.use('/api/auth', authRoutes);

// --- 3. REQUISITO DE PERFORMANCE: Cache ---
// Usamos nosso simpleCache(5) -> Cache de 5 minutos na rota de piadas
app.use('/api/jokes', simpleCache(5), jokeRoutes);

// Rota básica de teste
app.get('/', (req, res) => {
  res.send('API de Piadas: Segura (HTTPS + XSS), Monitorada (Logs) e Rápida (Cache + Compressão)!');
});

// --- LOGS DE ERRO ---
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

// --- 4. INICIALIZAÇÃO HTTPS (Criptografia) ---
try {
  const httpsOptions = {
    key: fs.readFileSync(__dirname + '/server.key'),
    cert: fs.readFileSync(__dirname + '/server.cert')
  };

  const PORT = process.env.PORT || 3001;

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`🔒 Servidor HTTPS rodando na porta ${PORT}`);
    console.log(`   - Segurança: ATIVADA (HTTPS + XSS)`);
    console.log(`   - Performance: ATIVADA (Cache + Compressão)`);
    console.log(`   - Monitoramento: ATIVADO (Logs)`);
    console.log(`Acesse em: https://localhost:${PORT}`);
  });

} catch (error) {
  console.error("ERRO FATAL: Certificados SSL não encontrados.");
  process.exit(1);
}