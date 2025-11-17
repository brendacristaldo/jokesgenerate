require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const jokeRoutes = require('./routes/jokes');

const app = express();

// 1. LOGS
app.use(morgan('dev'));

// 2. SEGURANÇA DE HEADERS
app.use(helmet());

// 3. CORS
app.use(cors());

// 4. LIMITADOR DE TAXA
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: 'Muitas requisições criadas a partir deste IP, por favor tente novamente após 15 minutos'
});
app.use('/api/', limiter);

// 5. PARSER DE JSON
app.use(express.json());

// 6. SANITIZAÇÃO MANUAL (Correção do erro)
// Impede NoSQL Injection removendo chaves com $ ou .
app.use((req, res, next) => {
  const clean = (data) => {
    if (data && typeof data === 'object') {
      for (const key in data) {
        if (key.startsWith('$') || key.includes('.')) {
          delete data[key];
        } else {
          clean(data[key]);
        }
      }
    }
    return data;
  };
  
  if (req.body) req.body = clean(req.body);
  if (req.query) req.query = clean(req.query);
  if (req.params) req.params = clean(req.params);
  
  next();
});

// 7. COMPRESSÃO
app.use(compression());

// --- Rotas da API ---
app.use('/api/auth', authRoutes);
app.use('/api/jokes', jokeRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor seguro rodando na porta ${PORT}`);
});