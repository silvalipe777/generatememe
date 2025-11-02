const OpenAI = require('openai');
const MemeModel = require('../models/Meme');
const StatsModel = require('../models/Stats');
const { Op } = require('sequelize');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Obter modelos
let Meme, Stats;

const initModels = () => {
  if (!Meme) Meme = MemeModel();
  if (!Stats) Stats = StatsModel();
};

// Gerar meme com OpenAI
exports.generateMeme = async (req, res) => {
  try {
    initModels();
    const { prompt, style = 'meme' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    // Gerar imagem com DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a funny meme image: ${prompt}. Style: internet meme, humorous, viral content`,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    const imageUrl = imageResponse.data[0].url;

    // Gerar caption com GPT
    const captionResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a witty meme caption writer. Create short, funny captions for memes. Keep it under 100 characters."
        },
        {
          role: "user",
          content: `Create a funny caption for this meme concept: ${prompt}`
        }
      ],
      max_tokens: 100
    });

    const caption = captionResponse.choices[0].message.content.trim();

    // Salvar no banco de dados
    const meme = await Meme.create({
      prompt,
      imageUrl,
      caption,
      author: req.body.author || 'Anon'
    });

    // Atualizar estatísticas
    const [stats, created] = await Stats.findOrCreate({
      where: { id: 1 },
      defaults: { totalMemes: 1, totalVisitors: 0 }
    });

    if (!created) {
      await stats.increment('totalMemes');
    }

    res.status(201).json({
      success: true,
      meme
    });
  } catch (error) {
    console.error('Error generating meme:', error);
    res.status(500).json({
      error: 'Erro ao gerar meme',
      details: error.message
    });
  }
};

// Buscar todos os memes
exports.getMemes = async (req, res) => {
  try {
    initModels();
    const { page = 1, limit = 20, sort = 'recent' } = req.query;

    let order = [];
    if (sort === 'recent') {
      order = [['createdAt', 'DESC']];
    } else if (sort === 'popular') {
      order = [['likes', 'DESC']];
    }

    const offset = (page - 1) * limit;

    const { count, rows: memes } = await Meme.findAndCountAll({
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      memes,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Error fetching memes:', error);
    res.status(500).json({ error: 'Erro ao buscar memes' });
  }
};

// Hall of Fame (memes mais populares)
exports.getHallOfFame = async (req, res) => {
  try {
    initModels();
    const memes = await Meme.findAll({
      order: [['likes', 'DESC']],
      limit: 10
    });

    res.json({ memes });
  } catch (error) {
    console.error('Error fetching hall of fame:', error);
    res.status(500).json({ error: 'Erro ao buscar hall of fame' });
  }
};

// Dar like em um meme
exports.likeMeme = async (req, res) => {
  try {
    initModels();
    const { id } = req.params;

    const meme = await Meme.findByPk(id);

    if (!meme) {
      return res.status(404).json({ error: 'Meme não encontrado' });
    }

    await meme.increment('likes');
    await meme.reload();

    res.json({ success: true, meme });
  } catch (error) {
    console.error('Error liking meme:', error);
    res.status(500).json({ error: 'Erro ao dar like' });
  }
};

// Incrementar visualizações
exports.viewMeme = async (req, res) => {
  try {
    initModels();
    const { id } = req.params;

    const meme = await Meme.findByPk(id);

    if (!meme) {
      return res.status(404).json({ error: 'Meme não encontrado' });
    }

    await meme.increment('views');
    await meme.reload();

    res.json({ success: true, meme });
  } catch (error) {
    console.error('Error viewing meme:', error);
    res.status(500).json({ error: 'Erro ao registrar visualização' });
  }
};

// Obter estatísticas
exports.getStats = async (req, res) => {
  try {
    initModels();
    const [stats, created] = await Stats.findOrCreate({
      where: { id: 1 },
      defaults: { totalMemes: 0, totalVisitors: 0 }
    });

    // Incrementar visitantes
    await stats.increment('totalVisitors');
    await stats.reload();

    res.json({
      totalMemes: stats.totalMemes,
      totalVisitors: stats.totalVisitors
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};
