const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Pega o token do cabeçalho 'Authorization'
  // O formato é "Bearer <token>"
  const authHeader = req.header('Authorization');

  // Se não houver cabeçalho, recusa o acesso
  if (!authHeader) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada' });
  }

  try {
    // O header vem como "Bearer <token>", então pegamos só o token
    const token = authHeader.split(' ')[1];

    // Se não houver token após o "Bearer"
    if (!token) {
       return res.status(401).json({ msg: 'Formato de token inválido' });
    }

    // Verifica se o token é válido usando o nosso segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o usuário (que estava dentro do token) ao objeto 'req'
    // para que as próximas rotas possam usá-lo
    req.user = decoded.user;
    next(); // Passa para a próxima etapa (a rota principal)
  } catch (err) {
    res.status(401).json({ msg: 'Token não é válido' });
  }
};