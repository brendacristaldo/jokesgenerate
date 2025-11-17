const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Joke = require('../models/Joke');
const apicache = require('apicache'); // Importa o cache

const router = express.Router();
const cache = apicache.middleware; // Cria o middleware de cache

// --- Regras de validação para nova piada ---
const jokeValidationRules = [
  body('type', 'O tipo é obrigatório (single ou twopart)').isIn(['single', 'twopart']),
  body('category', 'A categoria é obrigatória').not().isEmpty(),
  body('joke').if(body('type').equals('single')).not().isEmpty().withMessage('A piada é obrigatória para o tipo single'),
  body('setup').if(body('type').equals('twopart')).not().isEmpty().withMessage('O setup é obrigatório para o tipo twopart'),
  body('delivery').if(body('type').equals('twopart')).not().isEmpty().withMessage('O delivery é obrigatório para o tipo twopart'),
];

/**
 * @route   POST /api/jokes
 * @desc    Cadastra uma nova piada (Requisito 3)
 * @access  Privado
 */
router.post('/', [authMiddleware, jokeValidationRules], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, category, joke, setup, delivery } = req.body;
  
  try {
    const userId = req.user.id;
    const newJoke = new Joke(type, setup, delivery, joke, category, userId);
    await newJoke.save();

    // Opcional: Limpar o cache quando uma nova piada é adicionada para que ela apareça na busca
    // apicache.clear(req.originalUrl); 

    res.status(201).json({ msg: 'Piada inserida com sucesso!', joke: newJoke });
  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

/**
 * @route   GET /api/jokes
 * @desc    Busca todas as piadas (Requisito 2)
 * @access  Privado + Cacheado
 */
// AQUI ENTRA O CACHE: Ele fica entre o authMiddleware e a função async
router.get('/', authMiddleware, cache('5 minutes'), async (req, res) => {
  try {
    const jokes = await Joke.find();
    
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