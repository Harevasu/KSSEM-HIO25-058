import os
import logging
from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    logging.basicConfig(level=logging.INFO)

    # Create upload directories if they don't exist
    for d in [Config.UPLOAD_FOLDER, Config.SUBMITTED_DIR, Config.DIGILOCKER_DIR, Config.OUTPUT_DIR]:
        os.makedirs(d, exist_ok=True)

    from .routes import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    return app
