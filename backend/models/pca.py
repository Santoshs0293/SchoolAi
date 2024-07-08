import pandas as pd
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import io
import base64

def pca_analysis(file):
    try:
        df = pd.read_csv(file)
        X = df

        pca = PCA(n_components=2)
        principal_components = pca.fit_transform(X)
        
        # Generate the scatter plot
        plt.figure(figsize=(10, 8))
        plt.scatter(principal_components[:, 0], principal_components[:, 1], c='blue', edgecolor='k', s=50)
        plt.title('PCA - Principal Components')
        plt.xlabel('Principal Component 1')
        plt.ylabel('Principal Component 2')
        
        # Save the plot to a bytes buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        
        # Encode the plot to base64
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()
        
        return {'principal_components': principal_components.tolist(), 'image_base64': image_base64}
    except Exception as e:
        raise ValueError(f"Failed to process PCA: {str(e)}")
