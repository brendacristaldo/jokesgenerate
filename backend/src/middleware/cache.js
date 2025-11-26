// backend/src/middleware/cache.js
const cache = new Map();

// Função simples para limpar cache expirado (Executa a cada 10 min)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expiry < now) cache.delete(key);
  }
}, 10 * 60 * 1000);

const simpleCache = (durationInMinutes) => {
  return (req, res, next) => {
    // Só fazemos cache de requisições GET (leitura)
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    // 1. Se existir no cache e não expirou, devolve imediatamente
    if (cachedResponse) {
      if (Date.now() < cachedResponse.expiry) {
        console.log(`[CACHE] Recuperado da memória: ${key}`);
        res.setHeader('Content-Type', 'application/json');
        return res.send(cachedResponse.body);
      } else {
        cache.delete(key);
      }
    }

    // 2. Se não existir, interceptamos o envio original para salvar no cache
    const originalSend = res.send;
    res.send = function (body) {
      // Salva no cache antes de enviar
      cache.set(key, {
        body: body,
        expiry: Date.now() + (durationInMinutes * 60 * 1000)
      });
      // Chama a função original para responder ao usuário
      originalSend.call(this, body);
    };

    next();
  };
};

module.exports = simpleCache;