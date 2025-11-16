const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth'); // Nosso "segurança"
const Joke = require('../models/Joke'); // Nosso modelo

const router = express.Router();

// --- REQUISITO 3: INSERÇÃO ---
// Esta rota SÓ FUNCIONARÁ se o usuário enviar um Token JWT válido

// Regras de validação para inserir uma piada [cite: 44]
const jokeValidationRules = [
  body('type', 'O tipo é obrigatório (single ou twopart)').isIn(['single', 'twopart']),
  body('category', 'A categoria é obrigatória').not().isEmpty(),
  // Validação condicional: se for 'single', 'joke' é obrigatório
  body('joke').if(body('type').equals('single')).not().isEmpty().withMessage('A piada é obrigatória para o tipo single'),
  // Se for 'twopart', 'setup' e 'delivery' são obrigatórios
  body('setup').if(body('type').equals('twopart')).not().isEmpty().withMessage('O setup é obrigatório para o tipo twopart'),
  body('delivery').if(body('type').equals('twopart')).not().isEmpty().withMessage('O delivery é obrigatório para o tipo twopart'),
];

/**
 * @route   POST /api/jokes
 * @desc    Cadastra uma nova piada
 * @access  Privado (precisa de token)
 */
router.post('/', [authMiddleware, jokeValidationRules], async (req, res) => {
  // Verifica os erros de validação [cite: 45]
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, category, joke, setup, delivery } = req.body;
  
  try {
    // Pegamos o ID do usuário que o middleware de autenticação colocou no 'req'
    const userId = req.user.id;

    // Criamos a nova piada
    const newJoke = new Joke(type, setup, delivery, joke, category, userId);
    
    // Salvamos no banco
    await newJoke.save();

    res.status(201).json({ msg: 'Piada inserida com sucesso!', joke: newJoke });
  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


// --- REQUISITO 2: BUSCA ---
// Esta rota também é protegida pelo mesmo middleware

/**
 * @route   GET /api/jokes
 * @desc    Busca todas as piadas (pode ser melhorado com filtros)
 * @access  Privado (precisa de token)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Por enquanto, busca todas as piadas.
    // No futuro, podemos adicionar filtros ex: /api/jokes?category=Programming
    const jokes = await Joke.find();
    
    // Se não houver piadas
    if (!jokes || jokes.length === 0) {
      return res.status(404).json({ msg: 'Nenhuma piada encontrada' });
    }

    res.json(jokes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;