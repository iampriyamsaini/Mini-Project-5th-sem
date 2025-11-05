import os
import sys
import numpy as np
import librosa
import joblib
from tensorflow.keras.models import load_model

# --- Constants ---
SAMPLE_RATE = 22050
N_MFCC = 40
MAX_PAD_LEN = 174
MODEL_FILE = "ser_model.h5"
ENCODER_FILE = "label_encoder.pkl"

# --- RAVDESS Emotion Mapping (for comparison) ---
emotion_map = {
    "01": "neutral",
    "02": "calm",
    "03": "happy",
    "04": "sad",
    "05": "angry",
    "06": "fearful",
    "07": "disgust",
    "08": "surprised",
}


def extract_features(file_path, n_mfcc=N_MFCC, max_pad_len=MAX_PAD_LEN):
    """
    Extracts MFCC features from an audio file for prediction.
    """
    try:
        # Load audio file at the correct sample rate
        audio, sample_rate = librosa.load(
            file_path, sr=SAMPLE_RATE, res_type="kaiser_fast"
        )

        # Extract MFCCs
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=n_mfcc)

        # Pad or truncate to fixed length
        if mfccs.shape[1] > max_pad_len:
            mfccs = mfccs[:, :max_pad_len]
        else:
            pad_width = max_pad_len - mfccs.shape[1]
            mfccs = np.pad(mfccs, ((0, 0), (0, pad_width)), mode="constant")

        return mfccs

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None


def get_true_emotion(file_path):
    """
    Parses the RAVDESS filename to get the true emotion (if it's a RAVDESS file).
    """
    try:
        filename = os.path.basename(file_path)
        emotion_code = filename.split("-")[2]
        return emotion_map.get(emotion_code, "unknown")
    except Exception:
        return "unknown"


def main():
    file_path = r"TESS(for validation)\YAF_neutral\YAF_base_neutral.wav"

    print(f"Using file: {file_path}")
    # --- END OF MODIFIED SECTION ---

    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        print("Please make sure the 'file_path' variable in 'predict_from_file.py' is set correctly.")
        sys.exit(1)

    if not os.path.exists(MODEL_FILE) or not os.path.exists(ENCODER_FILE):
        print("Error: Model file or encoder file not found.")
        print("Please run `train_ser_model.py` first to train and save the model.")
        sys.exit(1)

    # Load the model and encoder
    try:
        print("Loading model and encoder...")
        model = load_model(MODEL_FILE)
        le = joblib.load(ENCODER_FILE)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model or encoder: {e}")
        sys.exit(1)

    # Extract features from the file
    features = extract_features(file_path)
    if features is None:
        sys.exit(1)

    # Reshape features for the model
    # Original: (n_mfcc, max_pad_len)
    # Transposed: (max_pad_len, n_mfcc)
    # Reshaped: (1, max_pad_len, n_mfcc)
    features_transposed = features.T
    features_reshaped = np.expand_dims(features_transposed, axis=0)

    # Make prediction
    try:
        prediction_probs = model.predict(features_reshaped)
        prediction_class = np.argmax(prediction_probs)
        prediction_label = le.inverse_transform([prediction_class])[0]
        prediction_confidence = np.max(prediction_probs)

        print("\n--- Prediction Results ---")
        print(f"File: {file_path}")

        # Try to show true emotion if it's a RAVDESS file
        true_emotion = get_true_emotion(file_path)
        if true_emotion != "unknown":
            print(f"True Emotion: {true_emotion}")

        print(
            f"Predicted Emotion: {prediction_label} ({prediction_confidence*100:.2f}%)"
        )

        # Optional: Show all probabilities
        print("\nAll Probabilities:")
        for emotion, prob in zip(le.classes_, prediction_probs[0]):
            print(f"  {emotion}: {prob*100:.2f}%")

    except Exception as e:
        print(f"An error occurred during prediction: {e}")


if __name__ == "__main__":
    main()








