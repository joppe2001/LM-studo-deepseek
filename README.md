# 🧠 LLM Chat Interface
A sophisticated, locally-hosted chat interface for Large Language Models with streaming responses, conversation management, and real-time thinking process visualization.

## ✨ Key Features
- **Local LLM Integration**: Seamlessly connects with LM Studio's local API to run open-source language models on your hardware.
- **Streaming Responses**: Real-time response streaming with dynamic rendering of markdown, code syntax highlighting, and LaTeX math.
- **Thinking Process Visualization**: Unique feature that exposes the LLM's step-by-step reasoning process with expandable thinking sections and timing metrics.
- **Conversation Management**: Full conversation history with the ability to create, switch between, and delete chat sessions.
- **Rich Text Rendering**:
  - Markdown support
  - Code syntax highlighting with copy functionality
  - LaTeX math rendering
  - Automatic code block formatting
- **Clean Modern UI**: Responsive design with dark mode and intuitive controls.
- **Public Access Option**: Optional ngrok integration for secure public access.

## 🚀 Getting Started
### Clone the repository
```sh
git clone https://github.com/yourusername/llm-chat-interface.git
cd llm-chat-interface
```

### Create and activate a virtual environment
```sh
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Install dependencies
```sh
pip install -r requirements.txt
```

### Set up configuration
```sh
cp config.template.py config.py
cp .env.template .env
```

Configure your environment:
- Edit `config.py` with your LM Studio settings.
- Update `.env` with your ngrok token (optional).

Launch LM Studio and load your preferred model.

### Start the application
```sh
python main.py
```

Open your browser and navigate to `http://localhost:8000`.

## 🔧 Configuration
### LM Studio Settings
```python
LM_STUDIO_API_BASE = "http://localhost:1234/v1"
MODEL_NAME = "your-model-name"
MAX_TOKENS = 2000
TEMPERATURE = 0.7
```

### Server Settings
```python
HOST = "0.0.0.0"
PORT = 8000
```

## 🎨 Features in Detail
### Thinking Process Visualization
The interface captures and displays the LLM's thinking process in collapsible sections:
```
Thinking Process ▼
Time: 1.2s
└─ Step-by-step reasoning...
```

### Conversation Management
- Create new conversations
- Switch between existing chats
- Delete unwanted conversations
- Persistent conversation history

### Rich Text Support
- **Markdown**: Full markdown support for formatting.
- **Code**: Syntax highlighting for multiple languages.
- **Math**: LaTeX rendering for mathematical expressions.
- **Copy**: One-click code copying.

## 🛠 Technical Architecture
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Flask (Python)
- **API**: RESTful endpoints with streaming support
- **Integrations**: LM Studio API, ngrok

## 🤝 Contributing
Contributions are welcome! Please feel free to submit pull requests, create issues, or suggest improvements.

### Steps to Contribute
1. Fork the repository
2. Create your feature branch
   ```sh
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```sh
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch
   ```sh
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- **LM Studio** for local LLM hosting.
- **KaTeX** for LaTeX rendering.
- **Prism** for code syntax highlighting.
- **Marked** for markdown parsing.
- **ngrok** for tunnel services.

Made with ❤️ for the open-source AI community.

Thank you for using the LLM Chat Interface!
