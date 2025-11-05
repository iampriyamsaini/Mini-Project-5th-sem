# Facial Emotion Recognition (FER)😃😡😢😱

This project implements a system for recognizing human facial emotions from both static images and real-time video streams. It uses an OpenCV Haar Cascade classifier for face detection and a Convolutional Neural Network (CNN) built with Keras/TensorFlow to classify the detected face into one of 7 emotional categories.

## 🚀 Features

* **Face Detection:** Uses OpenCV's pre-trained **Haar Cascade** classifier to locate faces in an image or video frame.
* **Emotion Classification:** A **2D CNN model** built with `tensorflow.keras` classifies faces into 7 emotions.
* **Training:** Includes a full Python script (`train_fer_model.py`) to train the CNN model from scratch using `ImageDataGenerator` for data augmentation.
* **Two Prediction Modes:**
    * `predict_from_file.py`: Analyzes a single static image, draws bounding boxes around all detected faces, and labels them with the predicted emotion.
    * `predict_realtime.py`: Uses a live webcam feed to perform face detection and emotion recognition in real-time.
* **Emotions Classified (7):**
    * `Angry`
    * `Disgust`
    * `Fear`
    * `Happy`
    * `Neutral`
    * `Sad`
    * `Surprise`

## 📂 Project Structure

This is the recommended file structure for the project to run correctly.

```
FacialEmotionRecognition/
│
├── train/                  # Folder for training images
│   ├── angry/
│   ├── disgust/
│   ├── fear/
│   ├── happy/
│   ├── neutral/
│   ├── sad/
│   └── surprise/
│
├── test/                   # Folder for validation images
│   ├── angry/
│   ├── disgust/
│   └── ... (same as train)
│
├── train_fer_model.py      # Script to train the CNN model
├── predict_from_file.py    # Script to predict from a static image
├── predict_realtime.py     # Script to predict from live webcam
│
├── haarcascade_frontalface_default.xml # OpenCV file for face detection
├── model_file_30epochs.h5  # (Generated) The trained Keras model
└── faces-small.jpg         # An example image to test predict_from_file.py
```

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/iampriyamsaini/Mini-Project-5th-sem.git
cd FacialEmotionRecognition
```

### 2. Install Dependencies

It's highly recommended to use a virtual environment.

```bash
# Create a virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install the required libraries
pip install tensorflow opencv-python numpy
```

Or, you can create a `requirements.txt` file with this content and run `pip install -r requirements.txt`:

```txt
tensorflow
opencv-python
numpy
```

### 3. Download Required Assets

#### A. The Dataset (FER-2013)

The training script is designed to work with the **FER-2013 dataset** (or any dataset with the same structure).

1.  A popular version of this dataset is available on Kaggle: [FER-2013 on Kaggle](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data).
2.  You will need to download the `fer2013.csv` file.
3.  You must then pre-process this CSV file into the `train/` and `test/` directory structure shown in the **Project Structure** section. (This typically involves writing a separate script to read the CSV, convert the pixel strings to images, and save them in the correct `[usage]/[emotion]/` folder).

#### B. Haar Cascade File

The prediction scripts require the `haarcascade_frontalface_default.xml` file for face detection.

1.  You can download it directly from the OpenCV GitHub repository:
    [**Download haarcascade_frontalface_default.xml**](https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml)
2.  Save this file in the root directory of your project.

## 🏃‍♂️ How to Run

### 1. Train the Model

First, you must train the model using your `train` and `test` image folders.

```bash
python train_fer_model.py
```

This script will train the model for 30 epochs and save the result as `model_file.h5`.

### 2. Run Prediction on a Static Image

This script analyzes a single image file.

1.  Open `predict_from_file.py` and change the image path on **line 12**:
    ```python
    # line 12
    frame=cv2.imread("your_image_name.jpg") 
    ```
    (You can use the included `faces-small.jpg` to test).
2.  Run the script:
    ```bash
    python predict_from_file.py
    ```
3.  An OpenCV window will pop up showing the image with labeled faces. Press any key to close it.

### 3. Run Real-Time Prediction (Webcam)

This script uses your default webcam for live emotion recognition.

1.  Make sure your webcam is connected.
2.  Run the script:
    ```bash
    python predict_realtime.py
    ```
3.  A window will open showing your webcam feed with a bounding box and emotion label over any detected face.
4.  Press the **'q'** key on your keyboard (while the OpenCV window is active) to quit the program.

## 🧠 Model Details

* **Face Detection:** `cv2.CascadeClassifier` with `haarcascade_frontalface_default.xml`.
* **Image Preprocessing:** Detected faces are converted to grayscale, resized to **48x48 pixels**, and normalized (pixel values divided by 255.0).
* **Input Shape:** The CNN expects an input of `(1, 48, 48, 1)`.
* **Data Augmentation (Training):** To improve model robustness, the training script applies:
    * Rescaling
    * Rotation (30 degrees)
    * Shear (0.3)
    * Zoom (0.3)
    * Horizontal Flips
* **CNN Architecture:** The model consists of stacked `Conv2D`, `MaxPooling2D`, and `Dropout` layers, followed by `Flatten` and `Dense` layers, and a final `softmax` output layer with 7 units (one for each emotion).

 ## 🧑‍💻 Author
   Priyam Saini
