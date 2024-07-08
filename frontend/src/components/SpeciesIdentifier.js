import React, { useState } from 'react';
import axios from 'axios';

function SpeciesIdentifier() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict-species', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error("Error identifying species:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  return (
    <div className="SpeciesIdentifier" style={styles.container}>
      <h1>Species Identifier</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Upload Image:
          <input type="file" onChange={handleFileChange} style={styles.input} />
        </label>
        <button type="submit" style={styles.button}>Identify Species</button>
      </form>
      {fileURL && (
        <div style={styles.imageContainer}>
          <h2>Uploaded Image</h2>
          <img src={fileURL} alt="Uploaded" style={styles.image} />
        </div>
      )}
      {error && (
        <div style={styles.error}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {result && (
        <div style={styles.results}>
          <h2>Identification Results</h2>
          <ul>
            {result.map((prediction, index) => (
              <li key={index}>
                {prediction.species} ({(prediction.probability * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={styles.explanation}>
        <h2>Understanding the Model Layers</h2>
        <div style={styles.layerSection}>
          <h3>1. Input Layer</h3>
          <p>Purpose: The input layer receives the image data.</p>
          <p>Process: The image is resized to 224x224 pixels and preprocessed to match the format required by the model.</p>
        </div>
        <div style={styles.layerSection}>
          <h3>2. Convolutional Layers (Conv Layers)</h3>
          <p>Purpose: These layers apply filters to the input image to create feature maps that detect various features such as edges, textures, and patterns.</p>
          <p>Process:</p>
          <ul>
            <li><strong>Conv1:</strong> The first convolutional layer applies 64 filters to the input image, each of size 3x3, creating 64 feature maps.</li>
            <li><strong>Conv2:</strong> Subsequent convolutional layers apply more filters, increasing in number as we go deeper into the network (e.g., 128 filters, then 256 filters, etc.).</li>
            <li><strong>ReLU Activation:</strong> After each convolution operation, a ReLU (Rectified Linear Unit) activation function is applied to introduce non-linearity, helping the network learn more complex patterns.</li>
          </ul>
        </div>
        <div style={styles.layerSection}>
          <h3>3. Pooling Layers</h3>
          <p>Purpose: Pooling layers reduce the spatial dimensions (width and height) of the feature maps, retaining the most important information and reducing computational load.</p>
          <p>Process:</p>
          <ul>
            <li><strong>Max Pooling:</strong> These layers take the maximum value from a window (usually 2x2) of the feature map. This down-sampling helps in making the model invariant to small translations in the input image.</li>
          </ul>
        </div>
        <div style={styles.layerSection}>
          <h3>4. Fully Connected Layers (Dense Layers)</h3>
          <p>Purpose: These layers are used at the end of the network to make final predictions based on the features extracted by the convolutional and pooling layers.</p>
          <p>Process:</p>
          <ul>
            <li><strong>Flattening:</strong> The final set of feature maps are flattened into a single vector.</li>
            <li><strong>Dense1:</strong> This vector is passed through one or more dense (fully connected) layers. Each neuron in a dense layer is connected to every neuron in the previous layer.</li>
            <li><strong>Output Layer:</strong> The last dense layer produces the final output, which in the case of the model is a probability distribution over the 1000 classes in ImageNet.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '10px'
  },
  input: {
    display: 'block',
    marginTop: '5px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  imageContainer: {
    marginTop: '20px',
    textAlign: 'center'
  },
  image: {
    maxWidth: '100%',
    height: 'auto'
  },
  error: {
    color: 'red',
    marginTop: '20px'
  },
  results: {
    marginTop: '20px'
  },
  explanation: {
    marginTop: '40px'
  },
  layerSection: {
    marginBottom: '20px'
  }
};

export default SpeciesIdentifier;
