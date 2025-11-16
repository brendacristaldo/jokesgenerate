const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa nosso modelo

const router = express.Router();

// Define as regras de validação para o login [cite: 44]
const loginValidationRules = [
  body('email', 'Por favor, inclua um email válido').isEmail(),
  body('password', 'A senha é obrigatória').exists(),
];

/**
 * @route   POST /api/auth/login
 * @desc    Autentica o usuário e retorna um token
 * @access  Público
 */
router.post('/login', loginValidationRules, async (req, res) => {
  // 1. Verifica se a validação encontrou erros [cite: 44]
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Retorna a mensagem de validação do servidor [cite: 45]
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 2. Procura o usuário no banco de dados
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // 3. Compara a senha enviada com a senha criptografada no banco
    //    (Note que o 'user' que veio do banco não é uma instância da classe,
    //     então criamos uma instância temporária para usar o método)
    const tempUser = new User(user.email, user.password); 
    const isMatch = await tempUser.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // 4. Se a senha está correta, cria e retorna um JSON Web Token (JWT)
    const payload = {
      user: {
        id: user._id, // O ID do usuário no MongoDB
        email: user.email,
      },
    };

    // Assina o token. Use uma string secreta forte no seu .env!
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'meu-segredo-super-secreto', // Adicione JWT_SECRET no seu .env
      { expiresIn: '5h' }, // Token expira em 5 horas [cite: 50]
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Retorna o token para o frontend
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;