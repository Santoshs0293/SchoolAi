import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer

def process_text(sentence):
    tokens = word_tokenize(sentence)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word.lower() not in stop_words]
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token.lower()) for token in filtered_tokens]
    vectorizer = CountVectorizer()
    lemmatized_sentence = ' '.join(lemmatized_tokens)
    X = vectorizer.fit_transform([lemmatized_sentence])
    bag_of_words = X.toarray()

    result = {
        "tokens": tokens,
        "filtered_tokens": filtered_tokens,
        "lemmatized_tokens": lemmatized_tokens,
        "bag_of_words": bag_of_words.tolist(),
        "vocabulary": vectorizer.vocabulary_
    }
    return result
