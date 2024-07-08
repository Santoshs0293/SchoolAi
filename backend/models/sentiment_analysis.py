from textblob import TextBlob

def sentiment_analysis(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment
    result = {
        "polarity": sentiment.polarity,
        "subjectivity": sentiment.subjectivity
    }
    return result
