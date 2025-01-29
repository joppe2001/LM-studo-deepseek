from flask import Blueprint, request, Response, stream_with_context, jsonify
from llm_service import LLMService
import json

api = Blueprint('api', __name__)

def init_routes(llm_service: LLMService):
    # Store conversation histories (in memory - would need a database for persistence)
    conversations = {}

    @api.route('/conversations', methods=['GET'])
    def get_conversations():
        return jsonify(list(conversations.keys()))

    @api.route('/conversations/<conversation_id>', methods=['GET'])
    def get_conversation(conversation_id):
        if conversation_id not in conversations:
            return {"error": "Conversation not found"}, 404
        return jsonify(conversations[conversation_id])

    @api.route('/conversations/<conversation_id>', methods=['DELETE'])
    def delete_conversation(conversation_id):
        if conversation_id in conversations:
            del conversations[conversation_id]
        return "", 204

    @api.route('/generate', methods=['POST'])
    def generate():
        data = request.json
        prompt = data.get('prompt')
        conversation_id = data.get('conversation_id', 'default')

        if not prompt:
            return {"error": "No prompt provided"}, 400

        # Initialize or get existing conversation history
        if conversation_id not in conversations:
            conversations[conversation_id] = []

        # Add user message to history
        conversations[conversation_id].append({
            "role": "user",
            "content": prompt
        })

        def generate_stream():
            try:
                assistant_message = {"role": "assistant", "content": ""}
                for chunk in llm_service.generate_stream(prompt, conversations[conversation_id]):
                    if chunk:
                        # Send raw text chunk without JSON wrapping
                        assistant_message["content"] += chunk
                        yield chunk
                # Add completed assistant message to history
                conversations[conversation_id].append(assistant_message)
            except Exception as e:
                print(f"Error in generate_stream: {e}")
                yield f"Error: {str(e)}"

        return Response(
            generate_stream(),
            mimetype='text/plain'
        )

    return api
