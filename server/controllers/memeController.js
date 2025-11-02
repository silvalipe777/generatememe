const OpenAI = require('openai');
const Meme = require('../models/Meme');
const Stats = require('../models/Stats');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Gerar meme com OpenAI
exports.generateMeme = async (req, res) => {
  try {
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
    const meme = new Meme({
      prompt,
      imageUrl,
      caption,
      author: req.body.author || 'Anon'
    });

    await meme.save();

    // Atualizar estatísticas
    await Stats.findOneAndUpdate(
      {},
      { $inc: { totalMemes: 1 }, $set: { lastUpdated: new Date() } },
      { upsert: true }
    );

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
    const { page = 1, limit = 20, sort = 'recent' } = req.query;

    let sortOption = {};
    if (sort === 'recent') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortOption = { likes: -1 };
    }

    const memes = await Meme.find()
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Meme.countDocuments();

    res.json({
      memes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
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
    const memes = await Meme.find()
      .sort({ likes: -1 })
      .limit(10)
      .exec();

    res.json({ memes });
  } catch (error) {
    console.error('Error fetching hall of fame:', error);
    res.status(500).json({ error: 'Erro ao buscar hall of fame' });
  }
};

// Dar like em um meme
exports.likeMeme = async (req, res) => {
  try {
    const { id } = req.params;

    const meme = await Meme.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!meme) {
      return res.status(404).json({ error: 'Meme não encontrado' });
    }

    res.json({ success: true, meme });
  } catch (error) {
    console.error('Error liking meme:', error);
    res.status(500).json({ error: 'Erro ao dar like' });
  }
};

// Incrementar visualizações
exports.viewMeme = async (req, res) => {
  try {
    const { id } = req.params;

    const meme = await Meme.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!meme) {
      return res.status(404).json({ error: 'Meme não encontrado' });
    }

    res.json({ success: true, meme });
  } catch (error) {
    console.error('Error viewing meme:', error);
    res.status(500).json({ error: 'Erro ao registrar visualização' });
  }
};

// Obter estatísticas
exports.getStats = async (req, res) => {
  try {
    let stats = await Stats.findOne();

    if (!stats) {
      stats = new Stats();
      await stats.save();
    }

    // Incrementar visitantes
    stats.totalVisitors += 1;
    await stats.save();

    res.json({
      totalMemes: stats.totalMemes,
      totalVisitors: stats.totalVisitors
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};
