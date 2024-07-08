import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, precision_recall_fscore_support
import logging

logging.basicConfig(level=logging.DEBUG)

def logistic_regression(file):
    try:
        logging.debug("Reading CSV file")
        df = pd.read_csv(file)
        
        logging.debug("Converting categorical data to numeric")
        for column in df.select_dtypes(include=['object']).columns:
            df[column] = pd.Categorical(df[column]).codes

        logging.debug("Splitting data into features and target")
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]

        logging.debug("Splitting data into training and testing sets")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        logging.debug("Training Logistic Regression model")
        model = LogisticRegression(max_iter=200)
        model.fit(X_train, y_train)
        
        logging.debug("Predicting on test set")
        y_pred = model.predict(X_test)

        logging.debug("Calculating accuracy and classification report")
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred)
        
        logging.debug("Extracting detailed metrics")
        precision, recall, f1_score, support = precision_recall_fscore_support(y_test, y_pred)
        classes = model.classes_.tolist()
        
        return {
            'accuracy': accuracy,
            'report': report,
            'classes': classes,
            'precision': precision.tolist(),
            'recall': recall.tolist(),
            'f1_score': f1_score.tolist(),
            'support': support.tolist()
        }
    except Exception as e:
        logging.error(f"Failed to process classification: {str(e)}")
        raise ValueError(f"Failed to process classification: {str(e)}")