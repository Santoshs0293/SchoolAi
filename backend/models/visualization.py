import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
from flask import Blueprint, request, jsonify

visualization_bp = Blueprint('visualization_bp', __name__)

def create_plot(data, plot_type):
    df = pd.read_csv(io.StringIO(data))
    fig, ax = plt.subplots()
    
    if plot_type == 'pie':
        df.set_index(df.columns[0]).plot.pie(ax=ax, y=df.columns[1], autopct='%1.1f%%')
    elif plot_type == 'bar':
        df.plot.bar(ax=ax, x=df.columns[0], y=df.columns[1])
    elif plot_type == 'hist':
        df.plot.hist(ax=ax)
    elif plot_type == 'scatter':
        df.plot.scatter(ax=ax, x=df.columns[0], y=df.columns[1])
    elif plot_type == 'box':
        df.plot.box(ax=ax)
    else:
        raise ValueError("Invalid plot type")

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    return image_base64

@visualization_bp.route('/visualize', methods=['POST'])
def visualize():
    try:
        plot_type = request.form.get('plot_type')
        file = request.files['file']
        data = file.read().decode('utf-8')
        plot_image = create_plot(data, plot_type)
        return jsonify({"plot_image": plot_image})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
