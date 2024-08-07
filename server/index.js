const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://itsabhijitmore:Abhi9359@cluster0.v2xhxqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  
});

// Define schemas and models for different difficulty levels
const rankingSchema = new mongoose.Schema({
  time: Number, // time in milliseconds
});

const RankingEasy = mongoose.model('RankingEasy', rankingSchema);
const RankingMedium = mongoose.model('RankingMedium', rankingSchema);
const RankingHard = mongoose.model('RankingHard', rankingSchema);

// Get the model based on the difficulty level
const getRankingModel = (level) => {
  if (level === 'Easy') return RankingEasy;
  if (level === 'Medium') return RankingMedium;
  if (level === 'Hard') return RankingHard;
  throw new Error('Invalid difficulty level');
};

// Routes
app.post('/api/rankings', async (req, res) => {
  const { time, level } = req.body;
  try {
    const Ranking = getRankingModel(level);
    const newRanking = new Ranking({ time });
    await newRanking.save();
    res.json(newRanking);
    console.log(`Ranking saved for ${level}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculateRank', async (req, res) => {
  const { time, level } = req.body;
  try {
    const Ranking = getRankingModel(level);
    const count = await Ranking.countDocuments({ time: { $lt: time } });
    res.json({ rank: count + 1 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/rankings', async (req, res) => {
  const { level } = req.query;
  try {
    const Ranking = getRankingModel(level);
    const rankings = await Ranking.find().sort({ time: 1 }).limit(5); // Top 5 rankings
    res.json(rankings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
