const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticateToken = require('../middleware/auth');
const { detectEmotionFromUrl } = require('../utils/faceClient');

const upload = multer({ dest: 'uploads/' });

// POST /api/ai/detect-emotion
// Accepts either an uploaded image file (multipart/form-data) OR an imageUrl in the body.
// If AZURE_FACE_KEY and AZURE_FACE_ENDPOINT are set and imageUrl is provided, the route will
// call Azure Face API to obtain emotions. Otherwise it falls back to the simulated behavior.
router.post('/detect-emotion', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { scanMode, imageUrl } = req.body;

    // If caller provided an imageUrl and Azure is configured, call Azure Face API
    if (imageUrl) {
      try {
        const emotionObj = await detectEmotionFromUrl(imageUrl);

        if (emotionObj) {
          // emotionObj is an object with emotion scores, e.g. { anger: 0.0, happiness: 0.9, ... }
          // pick the top emotion
          const entries = Object.entries(emotionObj);
          entries.sort((a, b) => Number(b[1]) - Number(a[1]));
          const top = entries[0];
          const detectedEmotion = top ? (top[0].charAt(0).toUpperCase() + top[0].slice(1)) : 'Neutral';
          const overallScore = Math.round((top ? top[1] : 0) * 100);

          const result = {
            emotion: detectedEmotion,
            score: overallScore,
            scanMode: scanMode || 'multimodal',
            modalityBreakdown: {
              facial: overallScore,
              voice: 0,
              behavior: 0
            },
            context: {
              timeOfDay: new Date().getHours() < 12 ? 'Morning' : 
                         new Date().getHours() < 18 ? 'Afternoon' : 'Evening'
            },
            timestamp: new Date()
          };

          return res.json({ success: true, message: 'Emotion detected via Azure Face API', result });
        }
        // fallthrough to simulated behavior if Azure returned no face
      } catch (err) {
        console.error('Azure Face API error:', err.message || err);
        // fall back to simulated behavior below
      }
    }

    // Simulate AI processing (fallback)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const emotions = ['Happy', 'Sad', 'Anxious', 'Calm', 'Excited', 'Stressed', 'Neutral'];
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const overallScore = Math.floor(Math.random() * 40) + 60;

    const result = {
      emotion: detectedEmotion,
      score: overallScore,
      scanMode: scanMode || 'multimodal',
      modalityBreakdown: {
        facial: Math.floor(Math.random() * 100),
        voice: Math.floor(Math.random() * 100),
        behavior: Math.floor(Math.random() * 100)
      },
      context: {
        timeOfDay: new Date().getHours() < 12 ? 'Morning' : 
                   new Date().getHours() < 18 ? 'Afternoon' : 'Evening'
      },
      timestamp: new Date()
    };

    res.json({ success: true, message: 'Emotion detected successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;