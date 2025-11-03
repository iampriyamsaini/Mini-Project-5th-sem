const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email transporter
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send email notification
async function sendEmailAlert(to, subject, html) {
  if (process.env.ENABLE_EMAIL_ALERTS !== 'true') {
    console.log('Email alerts disabled');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
}

// Send SMS notification
async function sendSMSAlert(to, message) {
  if (process.env.ENABLE_SMS_ALERTS !== 'true') {
    console.log('SMS alerts disabled');
    return;
  }

  try {
    const sms = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    console.log('✅ SMS sent:', sms.sid);
    return sms;
  } catch (error) {
    console.error('❌ SMS error:', error);
    throw error;
  }
}

// Send low wellness alert to caregiver
async function sendLowWellnessAlert(user, emotionRecord, caregivers) {
  const emailSubject = `🚨 MindCare AI Alert: Low Wellness Score for ${user.name}`;
  
  const emailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px; }
          .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
          .details { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧠 MindCare AI Alert</h1>
            <p>Low Wellness Score Detected</p>
          </div>
          
          <div class="alert">
            <h2>⚠️ Immediate Attention Required</h2>
            <p><strong>${user.name}</strong> has recorded a low wellness score that requires your attention.</p>
          </div>
          
          <div class="details">
            <h3>Patient Details:</h3>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Care Mode:</strong> ${user.careMode}</p>
            
            <h3>Emotion Record:</h3>
            <p><strong>Emotion:</strong> ${emotionRecord.emotion}</p>
            <p><strong>Wellness Score:</strong> ${emotionRecord.score}%</p>
            <p><strong>Time:</strong> ${new Date(emotionRecord.timestamp).toLocaleString()}</p>
            <p><strong>Context:</strong> ${emotionRecord.context?.location || 'Unknown'}</p>
            ${emotionRecord.note ? `<p><strong>Note:</strong> ${emotionRecord.note}</p>` : ''}
          </div>
          
          <p>Please reach out to ${user.name} to provide support and assess their wellbeing.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/caregiver/dashboard" class="button">
            View Full Dashboard →
          </a>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            This is an automated alert from MindCare AI. For urgent matters, please contact ${user.name} directly or emergency services.
          </p>
        </div>
      </body>
    </html>
  `;

  const smsMessage = `🚨 MindCare Alert: ${user.name} recorded low wellness score (${emotionRecord.score}%). Emotion: ${emotionRecord.emotion}. Please check in with them.`;

  // Send to all caregivers
  const notifications = [];
  
  for (const caregiver of caregivers) {
    // Send email
    if (caregiver.email) {
      notifications.push(
        sendEmailAlert(caregiver.email, emailSubject, emailHTML)
      );
    }
    
    // Send SMS if phone number available
    if (caregiver.profileData?.emergencyContact?.phone) {
      notifications.push(
        sendSMSAlert(caregiver.profileData.emergencyContact.phone, smsMessage)
      );
    }
  }

  await Promise.allSettled(notifications);
}

// Send daily wellness summary
async function sendDailySummary(user, analytics) {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px; }
          .stat-card { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .stat-value { font-size: 32px; font-weight: bold; color: #6366f1; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Your Daily Wellness Summary</h1>
            <p>Hello ${user.name}!</p>
          </div>
          
          <p>Here's your emotional wellness summary for today:</p>
          
          <div class="stat-card">
            <h3>Average Wellness Score</h3>
            <div class="stat-value">${analytics.averageScore}%</div>
          </div>
          
          <div class="stat-card">
            <h3>Most Frequent Emotion</h3>
            <div class="stat-value">${analytics.mostFrequentEmotion}</div>
          </div>
          
          <div class="stat-card">
            <h3>Total Check-ins</h3>
            <div class="stat-value">${analytics.totalRecords}</div>
          </div>
          
          <p style="margin-top: 30px;">Keep track of your emotional wellbeing and remember to take care of yourself!</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View Full Dashboard →
          </a>
        </div>
      </body>
    </html>
  `;

  await sendEmailAlert(
    user.email,
    '📊 Your Daily Wellness Summary - MindCare AI',
    emailHTML
  );
}

module.exports = {
  sendEmailAlert,
  sendSMSAlert,
  sendLowWellnessAlert,
  sendDailySummary
};