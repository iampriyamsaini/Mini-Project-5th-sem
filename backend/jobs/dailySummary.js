const cron = require('node-cron');
const User = require('../models/User');
const EmotionRecord = require('../models/EmotionRecord');
const notificationService = require('../services/notificationService');

// Run daily at 8 PM
cron.schedule('0 20 * * *', async () => {
  console.log('📊 Running daily wellness summary job...');

  try {
    const users = await User.find({ 
      'preferences.notificationsEnabled': true 
    });

    for (const user of users) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const emotions = await EmotionRecord.find({
        userId: user._id,
        timestamp: { $gte: today }
      });

      if (emotions.length > 0) {
        const avgScore = emotions.reduce((sum, e) => sum + e.score, 0) / emotions.length;
        const emotionCounts = {};
        emotions.forEach(e => {
          emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
        });
        
        const mostFrequent = Object.keys(emotionCounts).reduce((a, b) => 
          emotionCounts[a] > emotionCounts[b] ? a : b
        );

        const analytics = {
          averageScore: Math.round(avgScore),
          mostFrequentEmotion: mostFrequent,
          totalRecords: emotions.length
        };

        await notificationService.sendDailySummary(user, analytics);
      }
    }

    console.log('✅ Daily summaries sent successfully');
  } catch (error) {
    console.error('❌ Error sending daily summaries:', error);
  }
});