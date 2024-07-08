import numpy as np
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import io

# Load the pre-trained VGG16 model
model = VGG16(weights='imagenet')

def prepare_image(img):
    img = img.resize((224, 224))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)
    return img

def predict_species(file):
    try:
        img = image.load_img(io.BytesIO(file.read()), target_size=(224, 224))
        img = prepare_image(img)
        preds = model.predict(img)
        results = decode_predictions(preds, top=3)[0]
        predictions = [{"species": result[1], "probability": float(result[2])} for result in results]
        return predictions
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")
