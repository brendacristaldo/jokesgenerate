const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// --- VALIDAÇÕES ---

// Regras básicas para Login
const loginValidationRules = [
  body('email', 'Por favor, inclua um email válido').isEmail(),
  body('password', 'A senha é obrigatória').exists(),
];

// Regras FORTES para Registro (Senha segura!)
const registerValidationRules = [
  body('email', 'Por favor, inclua um email válido').isEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('A senha deve ter no mínimo 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('A senha deve conter pelo menos uma letra maiúscula')
    .matches(/[a-z]/)
    .withMessage('A senha deve conter pelo menos uma letra minúscula')
    .matches(/[0-9]/)
    .withMessage('A senha deve conter pelo menos um número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('A senha deve conter pelo menos um caractere especial (!, @, #, etc.)'),
];

// --- ROTAS ---

/**
 * @route   POST /api/auth/login
 * @desc    Autentica o usuário e devolve o token
 */
router.post('/login', loginValidationRules, async (req, res) => {
  // Checa se passou na validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 1. Busca o usuário pelo email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // 2. Bate a senha enviada com o hash do banco
    // Preciso criar uma instância temporária porque o user do banco é só um objeto JSON
    const tempUser = new User(user.email, user.password);
    const isMatch = await tempUser.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // 3. Gera o Token JWT se tudo estiver certo
    const payload = {
      user: {
        id: user._id,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // O token vale por 5 horas
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Cria um novo usuário com senha forte
 */
router.post('/register', registerValidationRules, async (req, res) => {
  // Se a senha for fraca, o erro vai aparecer aqui
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Verifica se já existe alguém com esse email
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Cria e salva o novo usuário (o hash da senha é feito na classe User)
    const newUser = new User(email, password);
    await newUser.save();

    res.status(201).json({ msg: 'Usuário cadastrado com sucesso! Faça login.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;