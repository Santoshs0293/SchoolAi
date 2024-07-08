from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import pandas as pd


def preprocess_data(df):
    df = df.dropna()  # Drop missing values
    return df

def feature_engineering(df):
    # Directly use the original numeric features
    numeric_features = df.select_dtypes(include=[float, int]).columns
    return df[numeric_features]

def linear_regression(file, test_size):
    try:
        df = pd.read_csv(file)
        df = preprocess_data(df)
        df = feature_engineering(df)
        
        # Select all numeric columns except the last one as features, and the last column as target
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]

        # Standardize the features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=test_size, random_state=42)

        # Define the models and hyperparameters for GridSearchCV
        param_grid = {
            'LinearRegression': {},
            'Ridge': {'alpha': [0.1, 1, 10, 100]},
            'Lasso': {'alpha': [0.1, 1, 10, 100]},
            'RandomForest': {'n_estimators': [50, 100, 200], 'max_depth': [None, 10, 20, 30]}
        }

        models = {
            'LinearRegression': LinearRegression(),
            'Ridge': Ridge(),
            'Lasso': Lasso(),
            'RandomForest': RandomForestRegressor()
        }

        best_model = None
        best_mse = float('inf')

        for model_name, model in models.items():
            grid_search = GridSearchCV(model, param_grid[model_name], cv=5, scoring='neg_mean_squared_error')
            grid_search.fit(X_train, y_train)
            best_estimator = grid_search.best_estimator_
            y_pred = best_estimator.predict(X_test)
            mse = mean_squared_error(y_test, y_pred)
            if mse < best_mse:
                best_mse = mse
                best_model = best_estimator

        y_pred = best_model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        return mse, y_test.tolist(), y_pred.tolist()
    except Exception as e:
        raise ValueError(f"Failed to process regression: {str(e)}")