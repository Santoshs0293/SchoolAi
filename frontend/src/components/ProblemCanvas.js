import React, { useState } from 'react';
import axios from 'axios';

const questionPackets = {
  bullying: [
    "Who is affected by the school bullying problem?",
    "What is school bullying?",
    "Where does bullying usually happen in school?",
    "Why is it important to stop bullying in school?",
    "Who can help stop bullying in school?",
    "What are the signs that someone is being bullied?",
    "Where should students go for help if they are being bullied?",
    "Why do some students bully others?",
    "Who benefits from a bullying-free school environment?",
    "What can happen if bullying is not addressed?"
  ],
  sports: [
    "Who can participate in school sports teams?",
    "What are the benefits of playing sports?",
    "Where can students practice sports at school?",
    "Why is teamwork important in sports?",
    "Who coaches the school sports teams?",
    "What equipment is needed for playing basketball?",
    "Where are school sports competitions usually held?",
    "Why should students warm up before playing sports?",
    "Who are some famous athletes that students can look up to?",
    "What are the rules of soccer?"
  ],
  competitions: [
    "Who can join school competitions?",
    "What types of competitions are held in schools?",
    "Where are spelling bees usually held?",
    "Why are academic competitions beneficial?",
    "Who organizes school science fairs?",
    "What are the prizes for winning school competitions?",
    "Where can students find information about upcoming competitions?",
    "Why is it important to prepare for competitions?",
    "Who judges the school art competitions?",
    "What are the rules for participating in a debate competition?"
  ],
  study_preparation: [
    "Who can help students with their homework?",
    "What are effective study habits?",
    "Where is the best place to study at home?",
    "Why is it important to take breaks while studying?",
    "Who can students ask for extra help in subjects they find difficult?",
    "What materials are needed for effective studying?",
    "Where can students find additional learning resources?",
    "Why should students review their notes regularly?",
    "Who can form a study group?",
    "What are the benefits of studying with a group?"
  ],
  discipline: [
    "Who enforces the school rules?",
    "What are the consequences of breaking school rules?",
    "Where can students learn about the school's code of conduct?",
    "Why is it important to follow school rules?",
    "Who can students talk to if they have concerns about school discipline?",
    "What should students do if they see someone breaking the rules?",
    "Where can students report incidents of misconduct?",
    "Why is punctuality important in school?",
    "Who decides on the disciplinary actions for serious offenses?",
    "What are some examples of good behavior in school?"
  ]
};

function ProblemCanvas() {
  const [userResponse, setUserResponse] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activePacket, setActivePacket] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handlePacketChange = (packet) => {
    setActivePacket(packet);
    setActiveQuestion(null);
    setUserResponse('');
    setResult(null);
    setError(null);
  };

  const handleQuestionChange = (index) => {
    setActiveQuestion(index);
    setUserResponse('');
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activePacket === null || activeQuestion === null) {
      setError("Please select a packet and question first.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/problem-canvas', {
        packet_name: activePacket,
        question_index: activeQuestion,
        response: userResponse
      });
      setResult(res.data);
      setError(null);
    } catch (error) {
      console.error("Error processing response:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  return (
    <div className="ProblemCanvas" style={styles.container}>
      <h1>4Ws Problem Canvas</h1>
      <div style={styles.packetList}>
        {Object.keys(questionPackets).map((packet, index) => (
          <button
            key={index}
            onClick={() => handlePacketChange(packet)}
            style={activePacket === packet ? styles.activePacketButton : styles.packetButton}
          >
            {packet.charAt(0).toUpperCase() + packet.slice(1)}
          </button>
        ))}
      </div>
      {activePacket && (
        <div style={styles.questionList}>
          {questionPackets[activePacket].map((q, index) => (
            <div key={index} style={styles.questionItem}>
              <button onClick={() => handleQuestionChange(index)} style={styles.questionButton}>
                {q}
              </button>
              {activeQuestion === index && (
                <div style={styles.answerBox}>
                  <label style={styles.label}>{q}</label>
                  <input
                    type="text"
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    style={styles.input}
                  />
                  <button onClick={handleSubmit} style={styles.button}>Submit</button>
                </div>
              )}
            </div>
          ))}
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
          <h2>Results</h2>
          <p><strong>Question:</strong> {result.question}</p>
          <p><strong>Stored Answer:</strong> {result.stored_answer}</p>
          <p><strong>Your Response:</strong> {result.user_response}</p>
          <p><strong>Score:</strong> {result.score.toFixed(2)}</p>
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
  packetList: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  packetButton: {
    margin: '0 10px',
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  activePacketButton: {
    margin: '0 10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  questionList: {
    marginBottom: '20px'
  },
  questionItem: {
    marginBottom: '10px'
  },
  questionButton: {
    width: '100%',
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '5px'
  },
  answerBox: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  label: {
    display: 'block',
    marginBottom: '5px'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ced4da',
    borderRadius: '4px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    color: 'red',
    marginTop: '20px'
  },
  results: {
    marginTop: '20px'
  }
};

export default ProblemCanvas;
