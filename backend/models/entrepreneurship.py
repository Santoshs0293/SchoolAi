from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

case_study_questions = [
    "What do you think were the key factors that contributed to the startup's success?",
    "How important is innovation in achieving market success?",
    "What leadership qualities do you think are essential for a successful entrepreneur?",
    "What are the unique challenges faced by social entrepreneurs?",
    "What strategies are most effective in scaling a business?",
    "What factors are critical for success in e-commerce?",
    "What are the key challenges in bringing a new technology to market?",
    "How can businesses effectively integrate sustainability into their operations?",
    "What are the major considerations when expanding a business globally?",
    "Why is a customer-centric approach important for business success?"
]

example_answers = [
    "Effective leadership, strong team, and market fit.",
    "Innovation is crucial as it differentiates the company and attracts customers.",
    "Visionary, decisive, and empathetic leadership.",
    "Balancing social impact with financial sustainability.",
    "Strategic planning, resource management, and market research.",
    "User experience, reliable logistics, and competitive pricing.",
    "Research and development, market validation, and funding.",
    "Implementing eco-friendly practices and ensuring economic viability.",
    "Cultural sensitivity, regulatory compliance, and market entry strategy.",
    "Meeting customer needs and fostering loyalty."
]

def preprocess_text(text):
    return text.lower()

def calculate_similarity(user_response, stored_answer):
    vectorizer = TfidfVectorizer().fit_transform([user_response, stored_answer])
    vectors = vectorizer.toarray()
    cosine_sim = cosine_similarity(vectors)
    return cosine_sim[0, 1]

def analyze_opinion(case_study_index, user_opinion):
    user_opinion = preprocess_text(user_opinion)
    stored_answer = preprocess_text(example_answers[case_study_index])
    
    score = calculate_similarity(user_opinion, stored_answer)
    
    result = {
        "case_study_question": case_study_questions[case_study_index],
        "stored_answer": example_answers[case_study_index],
        "user_opinion": user_opinion,
        "analysis": f"Your opinion has a similarity score of {score:.2f} with the stored answer."
    }
    return result
