let sessionId = localStorage.getItem('chatSessionId');

async function generateResponse(prompt) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-ID': sessionId || '' // Include the session ID if we have one
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        // Store the session ID if we receive one
        const newSessionId = response.headers.get('X-Session-ID');
        if (newSessionId) {
            sessionId = newSessionId;
            localStorage.setItem('chatSessionId', sessionId);
        }

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
