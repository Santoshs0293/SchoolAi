import React, { useState } from 'react';
import axios from 'axios';

function TFIDF() {
  const [texts, setTexts] = useState(['']);
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTextChange = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleAddTextBox = () => {
    setTexts([...texts, '']);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }
    formData.append('texts', JSON.stringify(texts));

    try {
      const response = await axios.post('http://localhost:5000/tfidf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error("Error processing texts/files:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  return (
    <div className="TFIDF" style={styles.container}>
      <div style={styles.leftPane}>
        <h1>TF-IDF Calculation</h1>
        <div style={styles.chatContainer}>
          <div style={styles.chatMessage}>
            <p><strong>Theoretical Explanation:</strong></p>
            <p>TF-IDF (Term Frequency-Inverse Document Frequency) is a numerical statistic used to reflect how important a word is to a document in a collection or corpus. It is often used as a weighting factor in information retrieval and text mining.</p>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>Type of Input Data:</strong></p>
            <p>Provide text inputs directly or upload text files. Each text input/file should contain a document from which TF-IDF will be calculated.</p>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>Output Explanation:</strong></p>
            <p>The output includes the TF-IDF scores of terms across all documents.</p>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>How TF-IDF Works:</strong></p>
            <p><strong>Term Frequency (TF):</strong></p>
            <p>Definition: Term Frequency is the number of times a term (word) appears in a document. It measures the frequency of a term in a single document.</p>
            <p>Formula:</p>
            <pre style={styles.formula}>TF(t) = (Number of times term t appears in a document) / (Total number of terms in the document)</pre>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>Inverse Document Frequency (IDF):</strong></p>
            <p>Definition: Inverse Document Frequency measures how important a term is. While Term Frequency (TF) considers the frequency of a term in a document, IDF evaluates how common or rare a term is across all documents in the corpus.</p>
            <p>Formula:</p>
            <pre style={styles.formula}>IDF(t) = log(Total number of documents / Number of documents with term t)</pre>
            <p>Purpose: The IDF of a rare term is high, whereas the IDF of a common term is low.</p>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>TF-IDF Calculation:</strong></p>
            <p>Definition: TF-IDF is a combination of TF and IDF. It measures the importance of a term in a document relative to the entire corpus.</p>
            <p>Formula:</p>
            <pre style={styles.formula}>TF-IDF(t) = TF(t) × IDF(t)</pre>
            <p>Purpose: The product of TF and IDF gives a higher weight to terms that are frequent in a document but not common across all documents.</p>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>Example:</strong></p>
            <p>Consider three documents:</p>
            <p>Document 1: "the cat sat on the mat"</p>
            <p>Document 2: "the cat is a pet"</p>
            <p>Document 3: "dogs are pets too"</p>
            <p>Let's calculate TF-IDF for the term "cat":</p>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>Term Frequency (TF):</strong></p>
            <p>TF("cat", Document 1) = 1/6</p>
            <p>TF("cat", Document 2) = 1/5</p>
            <p>TF("cat", Document 3) = 0/4 = 0</p>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>Inverse Document Frequency (IDF):</strong></p>
            <p>Number of documents containing "cat" = 2</p>
            <p>Total number of documents = 3</p>
            <p>IDF("cat") = log(3/2) = 0.176</p>
          </div>
          <div style={styles.chatMessage}>
            <p><strong>TF-IDF:</strong></p>
            <p>TF-IDF("cat", Document 1) = (1/6) * 0.176 = 0.029</p>
            <p>TF-IDF("cat", Document 2) = (1/5) * 0.176 = 0.035</p>
            <p>TF-IDF("cat", Document 3) = 0</p>
          </div>
        </div>
      </div>
      <div style={styles.rightPane}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {texts.map((text, index) => (
            <div key={index} style={styles.textContainer}>
              <textarea
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                style={styles.textarea}
                placeholder={`Document ${index + 1}`}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddTextBox} style={styles.button}>Add Text</button>
          <div style={styles.textContainer}>
            <label style={styles.label}>
              Upload text files:
              <input type="file" onChange={handleFileChange} style={styles.input} multiple />
            </label>
          </div>
          <button type="submit" style={styles.button}>Submit</button>
        </form>
        {error && (
          <div style={styles.error}>
            <h2>Error</h2>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}
        {result && (
          <div style={styles.results}>
            <h2>Results</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Term</th>
                  {result.tfidf_scores.map((_, index) => (
                    <th key={index}>Document {index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.feature_names.map((term, index) => (
                  <tr key={index}>
                    <td>{term}</td>
                    {result.tfidf_scores.map((scores, docIndex) => (
                      <td key={docIndex}>{scores[index].toFixed(3)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  leftPane: {
    flex: '1',
    marginRight: '20px',
    backgroundColor: '#f1f1f1',
    borderRadius: '5px',
    padding: '20px'
  },
  rightPane: {
    flex: '1',
    marginLeft: '20px'
  },
  chatContainer: {
    backgroundColor: '#fff',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '20px'
  },
  chatMessage: {
    marginBottom: '10px'
  },
  formula: {
    backgroundColor: '#e8e8e8',
    padding: '10px',
    borderRadius: '5px',
    display: 'block'
  },
  form: {
    marginBottom: '20px'
  },
  textContainer: {
    marginBottom: '10px'
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    fontSize: '14px'
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
    marginRight: '10px'
  },
  error: {
    color: 'red',
    marginTop: '20px'
  },
  results: {
    marginTop: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2'
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px'
  }
};

export default TFIDF;
