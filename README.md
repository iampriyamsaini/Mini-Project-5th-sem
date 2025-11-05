# AI-Based Emotion Recognition & Mental Health Monitoring

The AI-Based Emotion Recognition & Mental Health Monitoring system is an innovative application designed to detect and analyze human emotions in real time using Artificial Intelligence (AI), Computer Vision, and Natural Language Processing (NLP). The project aims to assist therapists, educators, and organizations by providing deeper insights into user emotions through facial expressions and voice analysis.


## 🚀 Core Features

* **👩‍💻 Facial Emotion Recognition:**
    * Detects faces in real-time (via webcam) or from static images.
    * Classifies faces into **7 emotions**: `Angry`, `Disgust`, `Fear`, `Happy`, `Neutral`, `Sad`, and `Surprise`.
    * Uses an OpenCV Haar Cascade for face detection and a 2D CNN for classification.
* **🎙️ Speech Emotion Recognition:**
    * Analyzes audio in real-time (via microphone) or from `.wav` files.
    * Classifies speech into **8 emotions**: `angry`, `calm`, `disgust`, `fearful`, `happy`, `neutral`, `sad`, and `surprised`.
    * Uses Librosa for MFCC feature extraction and a 1D CNN for classification.

## 📂 Project Structure

The repository is organized into three main components:

```
Mini-Project-5th-sem/
│
├── 📄 Documentations/
│   └── (Contains the project report, proposal, and other supporting documents)
│
├── 👩‍💻 FacialEmotionRecognition/
│   ├── train_fer_model.py
│   ├── predict_realtime.py
│   ├── predict_from_file.py
│   ├── haarcascade_frontalface_default.xml
│   └── README.md  <-- (Setup & usage guide for this module)
│
├── 🎙️ SpeechEmotionRecognition/
│   ├── train_ser_model.py
│   ├── predict_realtime.py
│   ├── predict_from_file.py
│   └── README.md  <-- (Setup & usage guide for this module)
│
└── README.md     (You are here!)
```

## 🛠️ Technology Stack

* **Python 3.x**
* **TensorFlow & Keras:** For building, training, and running both deep learning models.
* **OpenCV:** For face detection and real-time video processing.
* **Librosa:** For audio processing and MFCC (Mel-Frequency Cepstral Coefficients) extraction.
* **Scikit-learn:** For data preprocessing (e.g., `LabelEncoder`).
* **Numpy:** For numerical operations.
* **Sounddevice:** For real-time audio recording from the microphone.

## 🏃 Getting Started

To use this project, you can set up and run each module (Facial and Speech) independently. Each module has its own `README.md` file with detailed setup, dependency, and usage instructions.

### 1. Facial Emotion Recognition

To run the facial recognition model, please follow the setup instructions in its dedicated README:

➡️ [**Go to `FacialEmotionRecognition/README.md`**](./FacialEmotionRecognition/README.md)

### 2. Speech Emotion Recognition

To run the speech recognition model, please follow the setup instructions in its dedicated README:

➡️ [**Go to `SpeechEmotionRecognition/README.md`**](./SpeechEmotionRecognition/README.md)

## 🎯 Project Goal

The primary goal of this project is to create a robust system for understanding human emotion. By combining cues from both facial expressions and speech, the system can provide a more accurate and comprehensive emotional analysis. This technology serves as a foundation for potential applications in fields like mental health monitoring, user experience research, and more empathetic computing.

## 🧑‍💻 Author
  Priyam Saini
