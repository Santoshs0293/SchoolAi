import React, { useState } from 'react';
import axios from 'axios';

function NLP() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/process-text', { sentence: inputText });
      setResult(response.data);
      setActiveStep('tokens');
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  return (
    <div className="NLP">
      <h1>Natural Language Processing (NLP)</h1>
      <p>
        <strong>Theoretical Explanation:</strong> NLP is a field of artificial intelligence that focuses on the interaction between computers and humans through natural language. It involves the application of computational techniques to analyze and synthesize natural language and speech.
      </p>
      <p>
        <strong>Type of Input Data:</strong> A sentence or a paragraph of text that will be processed to extract meaningful information.
      </p>
      <p>
        <strong>Output Explanation:</strong> The output includes tokens, filtered tokens, lemmatized tokens, bag of words, and vocabulary extracted from the input text.
      </p>
      <p>
        <strong>Tokens:</strong> Tokens are individual words or punctuation marks extracted from the input text. For example, the sentence "I love AI!" would be tokenized into ["I", "love", "AI", "!"].
      </p>
      <p>
        <strong>Filtered Tokens:</strong> Filtered tokens are the tokens that remain after removing stopwords (common words that usually do not carry significant meaning, such as "and", "the", "in"). For example, from the tokens ["I", "love", "AI", "!"], the filtered tokens might be ["love", "AI", "!"].
      </p>
      <p>
        <strong>Lemmatized Tokens:</strong> Lemmatization is the process of converting words to their base or dictionary form (lemma). For example, "running" becomes "run". From the filtered tokens ["love", "AI", "!"], the lemmatized tokens might be ["love", "ai", "!"].
      </p>
      <p>
        <strong>Bag of Words:</strong> The Bag of Words (BoW) model is a way of representing text data as numerical features. It counts the occurrence of each word in the text. For example, the sentence "I love AI and AI is great" might be represented as {"{"} "I": 1, "love": 1, "AI": 2, "and": 1, "is": 1, "great": 1 {"}"}.
      </p>
      <p>
        <strong>Vocabulary:</strong> Vocabulary is the set of unique words found in the input text. For example, from the sentence "I love AI and AI is great", the vocabulary would be {"{"} "I", "love", "AI", "and", "is", "great" {"}"}.
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a sentence:
          <input type="text" value={inputText} onChange={handleInputChange} />
        </label>
        <button type="submit">Process</button>
      </form>
      {result && (
        <div>
          <h2>Processed Result</h2>
          <div>
            <button onClick={() => setActiveStep('tokens')}>Tokens</button>
            <button onClick={() => setActiveStep('filteredTokens')}>Filtered Tokens</button>
            <button onClick={() => setActiveStep('lemmatizedTokens')}>Lemmatized Tokens</button>
            <button onClick={() => setActiveStep('bagOfWords')}>Bag of Words</button>
            <button onClick={() => setActiveStep('vocabulary')}>Vocabulary</button>
          </div>
          <div>
            {activeStep === 'tokens' && (
              <p><strong>Tokens:</strong> {result.tokens.join(', ')}</p>
            )}
            {activeStep === 'filteredTokens' && (
              <p><strong>Filtered Tokens:</strong> {result.filtered_tokens.join(', ')}</p>
            )}
            {activeStep === 'lemmatizedTokens' && (
              <p><strong>Lemmatized Tokens:</strong> {result.lemmatized_tokens.join(', ')}</p>
            )}
            {activeStep === 'bagOfWords' && (
              <p><strong>Bag of Words:</strong> {JSON.stringify(result.bag_of_words)}</p>
            )}
            {activeStep === 'vocabulary' && (
              <p><strong>Vocabulary:</strong> {JSON.stringify(result.vocabulary)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NLP;
