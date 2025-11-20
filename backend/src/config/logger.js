const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Salva erros em arquivo
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Salva tudo em arquivo
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Se não estiver em produção, mostra no console também de forma colorida
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;