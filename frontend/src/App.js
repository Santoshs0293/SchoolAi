import React from 'react';
import { Link, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Classification from './components/Classification';
import Regression from './components/Regression';
import Clustering from './components/Clustering';
import PCA from './components/PCA';
import SentimentAnalysis from './components/SentimentAnalysis';
import CNN from './components/CNN';
import NLP from './components/NLP';
import TFIDF from './components/TFIDF';
import ProblemCanvas from './components/ProblemCanvas';
import DataVisualization from './components/DataVisualization';
import SpeciesIdentifier from './components/SpeciesIdentifier';
import Entrepreneurship from './components/Entrepreneurship';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/entrepreneurship">Entrepreneurship</Link></li>
            <li><Link to="/classification">Classification</Link></li>
            <li><Link to="/regression">Regression</Link></li>
            <li><Link to="/clustering">Clustering</Link></li>
            <li><Link to="/pca">PCA</Link></li>
            <li><Link to="/sentiment-analysis">Sentiment Analysis</Link></li>
            <li><Link to="/cnn">CNN</Link></li>
            <li><Link to="/nlp">NLP</Link></li>
            <li><Link to="/tfidf">TF-IDF</Link></li>
            <li><Link to="/problem-canvas">Problem Canvas</Link></li>
            <li><Link to="/data-visualization">Data Visualization</Link></li>
            <li><Link to="/species-identifier">Species Identifier</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/entrepreneurship" element={<Entrepreneurship />} />  
          <Route path="/classification" element={<Classification />} />
          <Route path="/regression" element={<Regression />} />
          <Route path="/clustering" element={<Clustering />} />
          <Route path="/pca" element={<PCA />} />
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/cnn" element={<CNN />} />
          <Route path="/nlp" element={<NLP />} />
          <Route path="/tfidf" element={<TFIDF />} />
          <Route path="/problem-canvas" element={<ProblemCanvas />} />
          <Route path="/data-visualization" element={<DataVisualization />} />
          <Route path="/species-identifier" element={<SpeciesIdentifier />} />
          <Route path="/" element={
            <div>
              <h1>Welcome to the AI and Data Science Portal</h1>
              <p>Select a module from the navigation menu.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
