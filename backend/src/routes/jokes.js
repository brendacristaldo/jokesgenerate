const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth'); // Nosso segurança da porta
const Joke = require('../models/Joke');

const router = express.Router();

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
 * @access  Privado (Precisa de token!)
 */
router.post('/', [authMiddleware, jokeValidationRules], async (req, res) => {
  // Se a validação falhar, retorna erro 400
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, category, joke, setup, delivery } = req.body;
  
  try {
    // Pego o ID do usuário de dentro do token (req.user)
    const userId = req.user.id;

    // Crio a nova piada
    const newJoke = new Joke(type, setup, delivery, joke, category, userId);
    
    // Salvo no Mongo
    await newJoke.save();

    res.status(201).json({ msg: 'Piada inserida com sucesso!', joke: newJoke });
  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


/**
 * @route   GET /api/jokes
 * @desc    Busca todas as piadas (Requisito 2)
 * @access  Privado (Precisa de token!)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Busca tudo que tem na coleção de piadas
    const jokes = await Joke.find();
    
    // Se não tiver nada, avisa
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