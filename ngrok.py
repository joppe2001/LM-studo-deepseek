# ngrok_setup.py
from pyngrok import ngrok
import os
from config import Config
import time
import subprocess


def setup_ngrok(config: Config):
    # Check if ngrok process is already running
    if ngrok.get_tunnels():
        print("Ngrok tunnel already exists. Closing existing tunnels...")
        return

    # Set up ngrok
    if config.NGROK_AUTH_TOKEN:
        ngrok.set_auth_token(config.NGROK_AUTH_TOKEN)

    # Start ngrok tunnel
    public_url = ngrok.connect(config.PORT)
    print(f'Public URL: {public_url}')
    # Launch ngrok web interface
    subprocess.Popen(['ngrok', 'http', str(config.PORT)])

    return public_url


if __name__ == '__main__':
    # Load environment variables
    from dotenv import load_dotenv

    load_dotenv()

    # Initialize config
    config = Config(
        NGROK_AUTH_TOKEN=os.getenv('NGROK_AUTH_TOKEN')
    )

    setup_ngrok(config)

    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nClosing ngrok tunnel...")
        ngrok.kill()