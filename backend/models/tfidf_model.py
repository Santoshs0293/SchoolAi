from sklearn.feature_extraction.text import TfidfVectorizer

def calculate_tfidf(texts):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(texts)
    feature_names = vectorizer.get_feature_names_out()
    dense = tfidf_matrix.todense()
    denselist = dense.tolist()

    result = {
        "feature_names": feature_names.tolist(),
        "tfidf_scores": denselist
    }
    return result
