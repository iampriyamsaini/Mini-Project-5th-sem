import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

class AIEmotionService {
  private model: any = null;
  private faceLandmarksModel: any = null;

  async initialize() {
    try {
      // Load face landmarks model
      this.faceLandmarksModel = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );
      
      console.log('✅ AI Models loaded successfully');
    } catch (error) {
      console.error('❌ Error loading AI models:', error);
      throw error;
    }
  }

  async detectEmotionFromImage(imageElement: HTMLImageElement | HTMLVideoElement): Promise<{
    emotion: string;
    score: number;
    facialAnalysis: number;
    voiceAnalysis: number;
    behaviorAnalysis: number;
  }> {
    try {
      if (!this.faceLandmarksModel) {
        await this.initialize();
      }

      // Detect face landmarks
      const predictions = await this.faceLandmarksModel.estimateFaces({
        input: imageElement
      });

      if (predictions.length === 0) {
        throw new Error('No face detected');
      }

      // Analyze facial features
      const faceData = predictions[0];
      const emotionScore = this.analyzeFacialExpression(faceData);

      return {
        emotion: emotionScore.emotion,
        score: emotionScore.confidence,
        facialAnalysis: emotionScore.confidence,
        voiceAnalysis: Math.random() * 100, // Placeholder for voice
        behaviorAnalysis: Math.random() * 100 // Placeholder for behavior
      };
    } catch (error) {
      console.error('Error detecting emotion:', error);
      throw error;
    }
  }

  private analyzeFacialExpression(faceData: any): { emotion: string; confidence: number } {
    // Simple emotion detection based on facial landmarks
    const keypoints = faceData.scaledMesh;
    
    // Mouth corners (indices 61, 291)
    const mouthLeft = keypoints[61];
    const mouthRight = keypoints[291];
    const mouthCenter = keypoints[13];
    
    // Eye positions
    const leftEye = keypoints[159];
    const rightEye = keypoints[386];
    
    // Calculate smile (mouth corners raised)
    const mouthWidth = Math.abs(mouthRight[0] - mouthLeft[0]);
    const mouthHeight = Math.abs(mouthCenter[1] - (mouthLeft[1] + mouthRight[1]) / 2);
    const smileRatio = mouthHeight / mouthWidth;
    
    // Calculate eye openness
    const eyeOpenness = (leftEye[1] + rightEye[1]) / 2;
    
    // Determine emotion based on features
    let emotion = 'Neutral';
    let confidence = 65;
    
    if (smileRatio > 0.15) {
      emotion = 'Happy';
      confidence = 85;
    } else if (smileRatio < 0.05) {
      emotion = 'Sad';
      confidence = 75;
    } else if (eyeOpenness > 0.3) {
      emotion = 'Surprised';
      confidence = 70;
    }
    
    return { emotion, confidence };
  }

  async detectEmotionFromVideo(videoElement: HTMLVideoElement): Promise<any> {
    return this.detectEmotionFromImage(videoElement);
  }
}

export const aiService = new AIEmotionService();
