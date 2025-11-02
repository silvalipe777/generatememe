const express = require('express');
const router = express.Router();
const memeController = require('../controllers/memeController');

// Rotas de memes
router.post('/generate', memeController.generateMeme);
router.get('/', memeController.getMemes);
router.get('/hall-of-fame', memeController.getHallOfFame);
router.post('/:id/like', memeController.likeMeme);
router.post('/:id/view', memeController.viewMeme);

// Estatísticas
router.get('/stats/info', memeController.getStats);

module.exports = router;
