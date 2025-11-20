require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const logger = require('./config/logger');

// HTTPS Dependencies
const https = require('https');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const jokeRoutes = require('./routes/jokes');

const app = express();

// 1. LOGS com Winston
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// 2. SEGURANÇA DE HEADERS & CORS
app.use(helmet());
app.use(cors());

// 3. LIMITADOR DE TAXA (Rate Limit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Muitas requisições criadas a partir deste IP.'
});
app.use('/api/', limiter);

// 4. PARSER DE JSON
app.use(express.json());

// 5. SANITIZAÇÃO MANUAL COMBINADA (NoSQL Injection + XSS)
// Corrige o erro "Cannot set property query" alterando as propriedades diretamente
app.use((req, res, next) => {
  const clean = (data) => {
    if (typeof data === 'string') {
      // Proteção XSS: Converte caracteres perigosos em texto inofensivo
      return data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    if (data && typeof data === 'object') {
      for (const key in data) {
        // Proteção NoSQL: Remove chaves que começam com $ ou tem .
        if (key.startsWith('$') || key.includes('.')) {
          delete data[key];
        } else {
          // Recursão: limpa os valores dentro do objeto
          data[key] = clean(data[key]);
        }
      }
    }
    return data;
  };

  // Aplicamos a limpeza modificando o conteúdo, não o objeto em si
  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);
  
  next();
});

// 6. OTIMIZAÇÃO
app.use(compression());

// --- ROTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/jokes', jokeRoutes);

const PORT = process.env.PORT || 3001;

// Tenta iniciar em HTTPS, se falhar vai de HTTP mesmo (fallback)
try {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '../server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../server.cert')),
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    logger.info(`Servidor HTTPS seguro rodando na porta ${PORT}`);
  });
} catch (e) {
  logger.error("Erro ao iniciar HTTPS. Certificados não encontrados?");
  // Fallback para HTTP
  app.listen(PORT, () => {
    logger.info(`Servidor HTTP rodando na porta ${PORT}`);
  });
}