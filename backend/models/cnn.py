from tensorflow.keras import datasets, layers, models, Model
import numpy as np
from PIL import Image
import io
import base64
import matplotlib.pyplot as plt

def initialize_cnn_model():
    (train_images, train_labels), (test_images, test_labels) = datasets.cifar10.load_data()
    train_images, test_images = train_images / 255.0, test_images / 255.0

    inputs = layers.Input(shape=(32, 32, 3))
    conv1 = layers.Conv2D(32, (3, 3), activation='relu')(inputs)
    pool1 = layers.MaxPooling2D((2, 2))(conv1)
    conv2 = layers.Conv2D(64, (3, 3), activation='relu')(pool1)
    pool2 = layers.MaxPooling2D((2, 2))(conv2)
    conv3 = layers.Conv2D(64, (3, 3), activation='relu')(pool2)
    flatten = layers.Flatten()(conv3)
    dense1 = layers.Dense(64, activation='relu')(flatten)
    outputs = layers.Dense(10, activation='softmax')(dense1)

    model = Model(inputs=inputs, outputs=outputs)
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    layer_outputs = [layer.output for layer in model.layers]
    intermediate_model = Model(inputs=model.input, outputs=layer_outputs)

    model.fit(train_images, train_labels, epochs=1,
              validation_data=(test_images, test_labels))

    return model, intermediate_model

def plot_intermediate_output(output, title):
    fig, axes = plt.subplots(4, 8, figsize=(15, 8))
    for i, ax in enumerate(axes.flat):
        if i < output.shape[-1]:
            ax.imshow(output[0, :, :, i], cmap='viridis')
            ax.axis('off')
    plt.suptitle(title)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    return image_base64

def cnn_predict(file, model, intermediate_model):
    img = Image.open(file).convert('RGB')  # Convert image to RGB
    img = img.resize((32, 32))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    intermediate_outputs = intermediate_model.predict(img_array)

    response = {}
    for layer_name, output in zip([layer.name for layer in model.layers], intermediate_outputs):
        if len(output.shape) == 4:  # Only visualize 4D tensors (conv layers)
            response[layer_name] = plot_intermediate_output(output, f'{layer_name} Output')
        else:
            response[layer_name] = output.tolist()
    
    final_prediction = model.predict(img_array)
    response['final_prediction'] = final_prediction.tolist()
    
    return response
