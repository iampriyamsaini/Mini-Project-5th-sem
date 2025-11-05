# Facial Emotion Recognition 😃😡😢😱

This project detects human facial emotions using deep learning and computer vision.  
It includes a trained CNN model capable of recognizing seven emotions from facial expressions — both in static images and real-time webcam input.

---

## 📁 Project Structure

FacialEmotionRecognition/
│
├── train/ # Training dataset
├── test/ # Validation dataset
│
├── train_fer_model.py # Script to train the CNN model
├── predict_from_file.py # Predict emotion from a static image
├── predict_realtime.py # Real-time webcam emotion detection
│
├── haarcascade_frontalface_default.xml # Face detection classifier
├── model_file.h5 # Trained emotion recognition model
│
├── faces-small.jpg # Sample test image
├── requirements.txt # Python dependencies
└── README.md # Project documentation


## 🧠 Model Overview

The model is built using **TensorFlow/Keras** and trained on grayscale facial images (48×48).  
It classifies each face into one of the following emotion categories:

| Label | Emotion   |
|:------|:-----------|
| 0     | Angry      |
| 1     | Disgust    |
| 2     | Fear       |
| 3     | Happy      |
| 4     | Neutral    |
| 5     | Sad        |
| 6     | Surprise   |

### 🏗️ Architecture Summary
- **Convolutional Layers (Conv2D):** For feature extraction  
- **MaxPooling2D:** For dimensionality reduction  
- **Dropout:** To prevent overfitting  
- **Dense Layers:** For final classification (Softmax output)

The model is trained for **30 epochs** using the **Adam optimizer** and **categorical cross-entropy** loss.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository:
git clone https://github.com/iampriyamsaini/Mini-Project-5th-sem.git
cd Mini-Project-5th-sem/FacialEmotionRecognition

### 2️⃣ Install dependencies:
pip install -r requirements.txt

Required Libraries:
tensorflow==2.12.0
keras==2.12.0
numpy==1.23.5
opencv-python==4.8.0.76


### 🧩 Training the Model
To train the CNN model on the dataset:

python train_fer_model.py
The script loads training and testing images from train/ and test/ directories.

After training, it saves the model as model_file.h5.


### 📸 Predict Emotion from Image
To test on a single image:
python predict_from_file.py
The script detects a face in faces-small.jpg and displays the emotion label.

You can replace the image path in the code with your own image.


### 🎥 Real-time Emotion Detection
To run the webcam-based detector:
python predict_realtime.py
Press 'q' to quit the window.
The script detects faces using haarcascade_frontalface_default.xml and classifies emotions live.

🧑‍💻 Author
Priyam Saini
