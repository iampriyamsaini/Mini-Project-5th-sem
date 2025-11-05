# Speech Emotion Recognition (SER)

This project implements a system for recognizing human emotions from speech using a 1D Convolutional Neural Network (CNN). The model is trained on the RAVDESS dataset and can classify speech into 8 different emotional categories.

The project provides scripts to:
* Train the emotion recognition model from scratch.
* Predict the emotion from a pre-recorded `.wav` audio file.
* Predict the emotion in real-time using your computer's microphone.

## 🚀 Features

* **Feature Extraction:** Uses **MFCCs (Mel-Frequency Cepstral Coefficients)** from audio files, processed with `librosa`.
* **Model:** A 1D CNN built with `tensorflow.keras`.
* **Training:** Full training script for the RAVDESS dataset.
* **Prediction:**
    * **File-based:** Analyze a single `.wav` file.
    * **Real-time:** Capture 3-second audio clips from a microphone for live prediction.
* **Emotions Classified:** The model is trained to recognize 8 emotions:
    * `angry`
    * `calm`
    * `disgust`
    * `fearful`
    * `happy`
    * `neutral`
    * `sad`
    * `surprised`

## 📂 Project Structure

```
SpeechEmotionRecognition/
│
├── dataset/                 # Folder to store the RAVDESS dataset (actors)
│   ├── Actor_01/
│   ├── Actor_02/
│   └── ...
│
├── TESS(for validation)/    # (Optional) Your folder for validation files
│   └── ...
│
├── train_ser_model.py       # Script to train the model
├── predict_from_file.py     # Script to predict emotion from a .wav file
├── predict_realtime.py      # Script to predict emotion from the microphone
│
├── ser_model.h5             # (Generated) The trained Keras model
└── label_encoder.pkl        # (Generated) The saved label encoder
```

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/iampriyamsaini/Mini-Project-5th-sem.git
cd Mini-Project-5th-sem/SpeechEmotionRecognition
cd SpeechEmotionRecognition
```

### 2. Download the Dataset

This model is trained on the **RAVDESS** (Ryerson Audio-Visual Database of Emotional Speech and Song) dataset.

1.  Download the dataset from [this link](https://zenodo.org/record/1188976).
2.  You only need the **"Audio_Speech_Actors_01-24.zip"** file.
3.  Create a folder named `dataset` in the root of the project directory.
4.  Unzip the file and move all 24 `Actor_...` folders into the `dataset` folder.

The final path structure should look like this:
`.../SpeechEmotionRecognition/dataset/Actor_01/03-01-01-01-01-01-01.wav`

### 3. Install Dependencies

It's recommended to use a virtual environment.

```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install the required libraries
pip install tensorflow librosa numpy scikit-learn joblib sounddevice
```

Alternatively, you can create a `requirements.txt` file with the following content and run `pip install -r requirements.txt`:

```txt
tensorflow
librosa
numpy
scikit-learn
joblib
sounddevice
```

## 🏃‍♂️ How to Run

### 1. Train the Model

First, you must train the model. This script will process all the audio files in the `dataset` folder, train the 1D CNN, and save the model and encoder.

```bash
python train_ser_model.py
```

This process will take some time depending on your hardware. When finished, it will create two files:
* `ser_model.h5`: The trained model weights.
* `label_encoder.pkl`: The file that maps the model's output (e.g., `0`, `1`, `2`) to the emotion labels (e.g., `angry`, `happy`, `sad`).

### 2. Run Predictions

Once the model is trained, you can use it for prediction in two ways.

#### A. Predict from an Audio File

This script will load a single audio file and predict its emotion.

1.  Open the `predict_from_file.py` script.
2.  Change the `file_path` variable on line 61 to point to the `.wav` file you want to analyze.
    ```python
    # line 61
    file_path = r"path/to/your/audio.wav"
    ```
3.  Run the script:
    ```bash
    python predict_from_file.py
    ```

**Example Output:**
```
--- Prediction Results ---
File: TESS(for validation)\YAF_neutral\YAF_base_neutral.wav
Predicted Emotion: neutral (75.14%)

All Probabilities:
  angry: 0.12%
  calm: 10.39%
  disgust: 0.03%
  fearful: 1.29%
  happy: 0.45%
  neutral: 75.14%
  sad: 12.55%
  surprised: 0.03%
```

#### B. Predict in Real-Time (from Microphone)

This script will use your default microphone to capture audio and predict the emotion in real-time.

1.  Run the script:
    ```bash
    python predict_realtime.py
    ```
2.  Follow the on-screen prompts. Press **Enter** to start recording a 3-second clip.
3.  The model will print its prediction.
4.  Press **'q'** and then **Enter** to quit the program.

**Example Output:**
```
--- Real-Time Emotion Prediction ---
This will record 3-second audio clips from your default microphone.

Press Enter to start recording (3 seconds) or 'q' to quit: 
Recording for 3 seconds...
Recording finished.
Predicted Emotion: happy (68.21%)

Press Enter to start recording (3 seconds) or 'q' to quit: 
Recording for 3 seconds...
Recording finished.
Predicted Emotion: angry (81.50%)

Press Enter to start recording (3 seconds) or 'q' to quit: q
```

## 🧠 Model & Feature Details

* **Features:** The model uses **40 MFCCs** (`N_MFCC = 40`) extracted from audio sampled at **22050 Hz**. Each feature vector is padded or truncated to a fixed length of **174 time steps** (`MAX_PAD_LEN = 174`).
* **Architecture:** The model is a **1D Convolutional Neural Network (CNN)** with multiple `Conv1D`, `BatchNormalization`, `MaxPooling1D`, and `Dropout` layers. This is followed by a `GlobalAveragePooling1D` layer and `Dense` layers, with a final `softmax` activation for classification.


## 🧑‍💻 Author
  Priyam Saini
