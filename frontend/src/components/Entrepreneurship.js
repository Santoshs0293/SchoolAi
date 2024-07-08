import React, { useState } from 'react';
import axios from 'axios';

const caseStudies = [
  {
    title: "Case Study 1: The Startup Journey",
    description: "This case study discusses the journey of a startup from inception to a successful exit. It covers the challenges faced, strategies adopted, and lessons learned.",
    detailedDescription: "For example, consider a tech startup that began in a garage with two founders and an idea. They faced challenges like securing funding, building a product, and finding customers. By adopting agile development, seeking mentorship, and pivoting their business model when necessary, they successfully launched their product. Eventually, they grew the company and were acquired by a larger firm, providing significant returns for their investors and team.",
    question: "What do you think were the key factors that contributed to the startup's success?"
  },
  {
    title: "Case Study 2: Innovation and Market Disruption",
    description: "This case study explores how a company disrupted the market with its innovative product. It highlights the importance of innovation and the impact it had on the industry.",
    detailedDescription: "An example of this is Netflix, which started as a DVD rental service and evolved into a streaming giant. By leveraging technology to offer on-demand content, Netflix disrupted traditional cable TV and video rental markets. Their focus on data-driven decisions, original content production, and user experience innovation were key to their market dominance.",
    question: "How important is innovation in achieving market success?"
  },
  {
    title: "Case Study 3: Leadership and Team Management",
    description: "This case study focuses on the leadership style and team management practices that helped the company grow. It emphasizes the role of effective leadership in business success.",
    detailedDescription: "Consider Google's leadership approach, which emphasizes a flat organizational structure, open communication, and fostering a culture of innovation. Leaders at Google encourage risk-taking and support team members in their professional growth, contributing to Google's rapid growth and dominance in the tech industry.",
    question: "What leadership qualities do you think are essential for a successful entrepreneur?"
  },
  {
    title: "Case Study 4: Social Entrepreneurship",
    description: "This case study examines a social enterprise that aims to solve community issues through sustainable business practices. It explores the challenges and impacts of social entrepreneurship.",
    detailedDescription: "One example is TOMS Shoes, which operates on a 'one for one' model. For every pair of shoes sold, TOMS donates a pair to a child in need. This business model not only addresses social issues but also builds brand loyalty and awareness among socially conscious consumers.",
    question: "What are the unique challenges faced by social entrepreneurs?"
  },
  {
    title: "Case Study 5: Scaling Up",
    description: "This case study covers how a small business successfully scaled its operations and expanded into new markets. It discusses strategies for growth and overcoming scaling challenges.",
    detailedDescription: "A good example is Amazon, which started as an online bookstore and expanded into various product categories. Amazon's focus on customer satisfaction, investment in logistics infrastructure, and technological innovation allowed it to scale efficiently and become a global e-commerce leader.",
    question: "What strategies are most effective in scaling a business?"
  },
  {
    title: "Case Study 6: E-commerce Revolution",
    description: "This case study analyzes the rise of a successful e-commerce platform. It highlights the strategies used to attract and retain customers in the digital marketplace.",
    detailedDescription: "Alibaba is an example of an e-commerce giant that revolutionized the market in China. By providing a platform for small businesses to reach a global audience, investing in secure payment systems, and focusing on customer experience, Alibaba has become a dominant player in the e-commerce sector.",
    question: "What factors are critical for success in e-commerce?"
  },
  {
    title: "Case Study 7: Tech Startup",
    description: "This case study looks at a tech startup that developed a groundbreaking technology. It explores the product development process and the challenges of bringing a new technology to market.",
    detailedDescription: "An example is Tesla, which revolutionized the automotive industry with its electric vehicles. Tesla's focus on innovation in battery technology, autonomous driving, and sustainable energy solutions helped it overcome initial market resistance and establish itself as a leader in the automotive industry.",
    question: "What are the key challenges in bringing a new technology to market?"
  },
  {
    title: "Case Study 8: Sustainability and Business",
    description: "This case study examines a company that integrated sustainability into its core business strategy. It discusses the benefits and challenges of sustainable business practices.",
    detailedDescription: "Patagonia, an outdoor clothing company, is known for its commitment to environmental sustainability. By using recycled materials, advocating for environmental causes, and encouraging customers to repair rather than replace products, Patagonia has built a loyal customer base and set an example for sustainable business practices.",
    question: "How can businesses effectively integrate sustainability into their operations?"
  },
  {
    title: "Case Study 9: Global Expansion",
    description: "This case study follows a company's journey to expand globally. It discusses the strategies used to enter new markets and the challenges of operating in different cultural and regulatory environments.",
    detailedDescription: "Starbucks' expansion strategy is a good example. By adapting its menu to local tastes, creating a consistent global brand experience, and understanding local cultural nuances, Starbucks successfully expanded its presence to over 80 countries.",
    question: "What are the major considerations when expanding a business globally?"
  },
  {
    title: "Case Study 10: Customer-Centric Approach",
    description: "This case study focuses on a company that built its success on a customer-centric approach. It explores how understanding and addressing customer needs can drive business success.",
    detailedDescription: "Zappos, an online shoe and clothing retailer, built its success on exceptional customer service. Their policies, such as free shipping and returns, and 24/7 customer support, ensured a loyal customer base and positive word-of-mouth marketing.",
    question: "Why is a customer-centric approach important for business success?"
  }
];

function Entrepreneurship() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [opinion, setOpinion] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCaseStudy === null) {
      setError("Please select a case study first.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/entrepreneurship-opinion', {
        case_study_index: selectedCaseStudy,
        opinion: opinion
      });
      setResult(res.data);
      setError(null);
    } catch (error) {
      console.error("Error processing opinion:", error);
      setError(error.response ? error.response.data : "Network Error");
    }
  };

  return (
    <div className="Entrepreneurship" style={styles.container}>
      <h1>Entrepreneurship Case Studies</h1>
      <div style={styles.caseStudyList}>
        {caseStudies.map((cs, index) => (
          <div key={index} style={styles.caseStudyItem}>
            <button onClick={() => setSelectedCaseStudy(index)} style={styles.caseStudyButton}>
              {cs.title}
            </button>
            {selectedCaseStudy === index && (
              <div style={styles.caseStudyDetails}>
                <p>{cs.description}</p>
                <p>{cs.detailedDescription}</p>
                <label style={styles.label}>{cs.question}</label>
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  style={styles.textarea}
                />
                <button onClick={handleSubmit} style={styles.button}>Submit</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {error && (
        <div style={styles.error}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {result && (
        <div style={styles.results}>
          <h2>Results</h2>
          <p><strong>Case Study:</strong> {caseStudies[selectedCaseStudy].title}</p>
          <p><strong>Your Opinion:</strong> {result.user_opinion}</p>
          <p><strong>Analysis:</strong> {result.analysis}</p>
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
  caseStudyList: {
    marginBottom: '20px'
  },
  caseStudyItem: {
    marginBottom: '10px'
  },
  caseStudyButton: {
    width: '100%',
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '5px'
  },
  caseStudyDetails: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  label: {
    display: 'block',
    marginBottom: '5px'
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '0.5rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    resize: 'vertical'
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

export default Entrepreneurship;
