from flask import Flask, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv
from config import Config
from llm_service import LLMService
from api_routes import init_routes
from ngrok import setup_ngrok
import threading


def create_app(config: Config) -> Flask:
    app = Flask(__name__)
    app.template_folder = 'templates'
    CORS(app)

    # Initialize services
    llm_service = LLMService(config)

    # Register routes
    api_routes = init_routes(llm_service)
    app.register_blueprint(api_routes, url_prefix='/api')

    @app.route('/')
    def home():
        return render_template('index.html')

    return app


def start_ngrok(config: Config):
    # Wait a moment for Flask to start
    import time
    time.sleep(2)
    setup_ngrok(config)


if __name__ == '__main__':
    # Load environment variables
    load_dotenv()

    # Initialize config
    config = Config(
        NGROK_AUTH_TOKEN=os.getenv('NGROK_AUTH_TOKEN')
    )

    # Create and configure app
    app = create_app(config)

    # Start ngrok in a separate thread
    ngrok_thread = threading.Thread(target=start_ngrok, args=(config,))
    ngrok_thread.daemon = True
    ngrok_thread.start()

    # Run app
    try:
        app.run(
            host=config.HOST,
            port=config.PORT,
            debug=os.getenv('FLASK_ENV') == 'development'
        )
    except KeyboardInterrupt:
        print("\nShutting down...")
