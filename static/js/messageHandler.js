async function sendPrompt() {
    const prompt = document.getElementById('prompt').value;
    const formattedOutput = document.getElementById('formatted-output');

    // Create message containers
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.innerHTML = `
        <div class="message-header">You</div>
        <div class="message-content">${prompt}</div>
    `;
    messageContainer.appendChild(userMessage);

    // Add AI message container
    const aiMessage = document.createElement('div');
    aiMessage.className = 'chat-message assistant';
    aiMessage.innerHTML = `
        <div class="message-header">AI</div>
        <div class="message-content"></div>
    `;
    messageContainer.appendChild(aiMessage);
    formattedOutput.appendChild(messageContainer);

    const aiContent = aiMessage.querySelector('.message-content');
    let fullText = '';

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                prompt: prompt,
                conversation_id: currentConversationId
            })
        });

        if (!response.ok) throw new Error('Failed to fetch');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullText += chunk;

            // Process thinking tags first
            processThinkingTags(fullText, aiContent);

            // Get all content containers
            const contentContainers = aiContent.querySelectorAll('.thinking-content, .answer-content');

            // Render content in each container
            contentContainers.forEach(container => {
                if (container.textContent) {
                    renderContent(container);
                }
            });

            // Scroll to bottom
            formattedOutput.scrollTop = formattedOutput.scrollHeight;
        }

        // Clear input after successful submission
        document.getElementById('prompt').value = '';

    } catch (error) {
        console.error('Error:', error);
        aiContent.innerHTML = 'Error: Failed to generate response';
    }
}
