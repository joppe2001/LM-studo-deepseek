import requests
import json
from typing import Generator, Dict, Any
from config import Config


class LLMService:
    def __init__(self, config: Config):
        self.config = config
        self.api_base = config.LM_STUDIO_API_BASE

    def generate_stream(self, prompt: str, history: list = None) -> Generator[str, None, None]:
        headers = {
            "Content-Type": "application/json"
        }

        # Build messages array with history
        messages = []
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": prompt})

        data = {
            "model": self.config.MODEL_NAME,
            "messages": messages,
            "max_tokens": self.config.MAX_TOKENS,
            "temperature": self.config.TEMPERATURE,
            "stream": True
        }

        response = requests.post(
            f"{self.api_base}/chat/completions",
            headers=headers,
            json=data,
            stream=True
        )

        if response.status_code != 200:
            raise Exception(f"Error from LM Studio API: {response.text}")

        for line in response.iter_lines():
            if line:
                try:
                    if isinstance(line, bytes):
                        line = line.decode('utf-8')
                    line = line.strip()
                    if not line or line == "data: [DONE]":
                        continue
                    if line.startswith('data: '):
                        json_response = line[6:].strip()  # Remove 'data: ' prefix
                        data = json.loads(json_response)
                        if "choices" in data and data["choices"]:
                            choice = data["choices"][0]
                            if "delta" in choice and "content" in choice["delta"]:
                                content = choice["delta"]["content"]
                                if content and not content.isspace():
                                    # Just yield the content directly without trying to parse as JSON
                                    yield content

                except json.JSONDecodeError as e:
                    if "[DONE]" not in str(line):
                        print(f"Error parsing JSON in response line: {line}\nError: {e}")
                except Exception as e:
                    print(f"Unexpected error parsing response line: {line}\nError: {e}")

