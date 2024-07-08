import React, { useState } from 'react';
import axios from 'axios';
//import './CNN.css';

function CNN() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
      setActiveStep('conv2d');  // Setting the first layer by default
      setError(null);
    } catch (error) {
      console.error("Error processing image:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  return (
    <div className="CNN" style={styles.container}>
      <h1>Convolutional Neural Networks (CNN)</h1>
      <p>
        <strong>Theoretical Explanation:</strong> CNNs are a class of deep learning algorithms used primarily for image recognition and classification. They are designed to automatically and adaptively learn spatial hierarchies of features from input images.
      </p>
      <p>
        <strong>Type of Input Data:</strong> An image file that will be processed by the CNN to classify the content of the image.
      </p>
      <p>
        <strong>Output Explanation:</strong> The output includes the classification result and intermediate outputs from different layers of the CNN. Below are the detailed explanations of the outputs:
      </p>
      <ul>
        <li>
          <strong>Conv1 Output:</strong> This contains the activation values from the first convolutional layer. It highlights low-level features such as edges and textures in the image.
        </li>
        <li>
          <strong>Pool1 Output:</strong> This contains the activation values after the first max pooling layer, which reduces the spatial dimensions and retains important information.
        </li>
        <li>
          <strong>Conv2 Output:</strong> This contains the activation values from the second convolutional layer, capturing more complex features such as corners and shapes.
        </li>
        <li>
          <strong>Pool2 Output:</strong> This contains the activation values after the second max pooling layer, further reducing the spatial dimensions.
        </li>
        <li>
          <strong>Conv3 Output:</strong> This contains the activation values from the third convolutional layer, capturing even more complex features and patterns.
        </li>
        <li>
          <strong>Flatten Output:</strong> This is the flattened representation of the feature maps, converting the 2D matrix data to a 1D vector.
        </li>
        <li>
          <strong>Dense1 Output:</strong> This contains the activation values from the first fully connected layer, combining all the features learned by the convolutional layers.
        </li>
        <li>
          <strong>Final Prediction:</strong> This is the output of the final layer, containing the probabilities for each class. The class with the highest probability is the predicted class for the input image.
        </li>
      </ul>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Select an image:
          <input type="file" onChange={handleFileChange} style={styles.input} />
        </label>
        <button type="submit" style={styles.button}>Classify</button>
      </form>
      {error && (
        <div style={styles.error}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {result && (
        <div style={styles.results}>
          <h2>Classification Result</h2>
          <div style={styles.buttonsContainer}>
            {Object.keys(result).map((layer, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(layer)}
                style={activeStep === layer ? styles.activeButton : styles.button}
              >
                {layer}
              </button>
            ))}
          </div>
          <div style={styles.outputContainer}>
            {result[activeStep] && typeof result[activeStep] === 'string' ? (
              <img src={`data:image/png;base64,${result[activeStep]}`} alt={`${activeStep} Output`} style={styles.image} />
            ) : (
              <pre>{JSON.stringify(result[activeStep], null, 2)}</pre>
            )}
          </div>
        </div>
      )}
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
    backgroundColor: '#007BFF',
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px'
  },
  activeButton: {
    padding: '10px 20px',
    backgroundColor: '#0056b3',
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px'
  },
  error: {
    color: 'red',
    marginTop: '20px'
  },
  results: {
    marginTop: '20px'
  },
  buttonsContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  outputContainer: {
    marginTop: '20px'
  },
  image: {
    maxWidth: '100%',
    height: 'auto'
  }
};

export default CNN;
