import os
import sys
import numpy as np
import librosa
import joblib
import sounddevice as sd
from tensorflow.keras.models import load_model

#Constants
SAMPLE_RATE = 22050
DURATION = 3  # seconds
N_MFCC = 40
MAX_PAD_LEN = 174
MODEL_FILE = "ser_model.h5"
ENCODER_FILE = "label_encoder.pkl"


def extract_features_realtime(audio_data, n_mfcc=N_MFCC, max_pad_len=MAX_PAD_LEN):
    """
    Extracts MFCC features from raw audio data for real-time prediction.
    """
    try:
        # Extract MFCCs
        mfccs = librosa.feature.mfcc(y=audio_data, sr=SAMPLE_RATE, n_mfcc=n_mfcc)

        # Pad or truncate to fixed length
        if mfccs.shape[1] > max_pad_len:
            mfccs = mfccs[:, :max_pad_len]
        else:
            pad_width = max_pad_len - mfccs.shape[1]
            mfccs = np.pad(mfccs, ((0, 0), (0, pad_width)), mode="constant")

        return mfccs

    except Exception as e:
        print(f"Error extracting features: {e}")
        return None


def main():
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

    print("\n--- Real-Time Emotion Prediction ---")
    print("This will record 3-second audio clips from your default microphone.")

    while True:
        try:
            key = input(
                "\nPress Enter to start recording (3 seconds) or 'q' to quit: "
            )
            if key.lower() == "q":
                break

            print(f"Recording for {DURATION} seconds...")
            # Record audio
            audio_data = sd.rec(
                int(DURATION * SAMPLE_RATE),
                samplerate=SAMPLE_RATE,
                channels=1,
                dtype="float32",
            )
            sd.wait()  # Wait for recording to finish
            print("Recording finished.")

            # The audio_data is (n_samples, 1). Flatten it to (n_samples,)
            audio_data_flat = audio_data.T[0]

            # Extract features
            features = extract_features_realtime(audio_data_flat)
            if features is None:
                continue

            # Reshape features for the model
            # Original: (n_mfcc, max_pad_len)
            # Transposed: (max_pad_len, n_mfcc)
            # Reshaped: (1, max_pad_len, n_mfcc)
            features_transposed = features.T
            features_reshaped = np.expand_dims(features_transposed, axis=0)

            # Make prediction
            prediction_probs = model.predict(features_reshaped)
            prediction_class = np.argmax(prediction_probs)
            prediction_label = le.inverse_transform([prediction_class])[0]
            prediction_confidence = np.max(prediction_probs)

            print(
                f"Predicted Emotion: {prediction_label} ({prediction_confidence*100:.2f}%)"
            )

        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"An error occurred: {e}")
            break


if __name__ == "__main__":
    main()
