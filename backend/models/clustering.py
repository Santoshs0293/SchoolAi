import pandas as pd
from sklearn.cluster import KMeans
import logging
import matplotlib.pyplot as plt
import io
import base64

logging.basicConfig(level=logging.DEBUG)

def kmeans_clustering(file, k):
    try:
        logging.debug("Reading CSV file")
        df = pd.read_csv(file)
        
        logging.debug(f"DataFrame shape: {df.shape}")
        logging.debug(f"DataFrame columns: {df.columns.tolist()}")

        if df.shape[1] < 2:
            raise ValueError("The input CSV must contain at least two columns of numerical data.")
        
        # Ensure all columns are numerical
        for col in df.columns:
            if not pd.api.types.is_numeric_dtype(df[col]):
                raise ValueError(f"The column '{col}' must be of numerical type.")
        
        logging.debug("Performing K-Means clustering")
        X = df

        kmeans = KMeans(n_clusters=int(k), random_state=42)
        df['Cluster'] = kmeans.fit_predict(X)

        # Generate the scatter plot
        plt.figure(figsize=(10, 8))
        scatter = plt.scatter(X.iloc[:, 0], X.iloc[:, 1], c=df['Cluster'], cmap='viridis')
        plt.colorbar(scatter)
        plt.title('K-Means Clustering')
        plt.xlabel(df.columns[0])
        plt.ylabel(df.columns[1])
        
        # Save the plot to a bytes buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        
        # Encode the plot to base64
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()
        
        clusters = df.groupby('Cluster').apply(lambda x: x.to_dict(orient='records')).to_dict()
        return {'clusters': clusters, 'image_base64': image_base64}
    except Exception as e:
        logging.error(f"Failed to process clustering: {str(e)}")
        raise ValueError(f"Failed to process clustering: {str(e)}")
