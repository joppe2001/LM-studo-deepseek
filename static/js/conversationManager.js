// Add these new functions to your existing JavaScript
let currentConversationId = 'default';

async function loadConversations() {
    const response = await fetch('/api/conversations');
    const conversations = await response.json();
    const select = document.getElementById('conversation-select');

    // If no conversations exist, create default one
    if (conversations.length === 0) {
        currentConversationId = 'default';
        select.innerHTML = `<option value="default">Default Chat</option>`;
    } else {
        select.innerHTML = conversations.map(id =>
            `<option value="${id}" ${id === currentConversationId ? 'selected' : ''}>${id === 'default' ? 'Default Chat' : id}</option>`
        ).join('');
    }
}

async function loadCurrentConversation() {
    const response = await fetch(`/api/conversations/${currentConversationId}`);
    const messages = await response.json();
    const output = document.getElementById('formatted-output');

    output.innerHTML = messages.map(msg => {
        if (msg.role === 'user') {
            return `
                <div class="chat-message user">
                    <div class="message-header">You</div>
                    <div class="message-content">${msg.content}</div>
                </div>`;
        } else {
            const aiContent = document.createElement('div');
            aiContent.className = 'chat-message assistant';
            aiContent.innerHTML = `
                <div class="message-header">AI</div>
                <div class="message-content"></div>
            `;

            const contentDiv = aiContent.querySelector('.message-content');
            processThinkingTags(msg.content, contentDiv);

            return aiContent.outerHTML;
        }
    }).join('');

    // Re-render any code blocks and LaTeX
    Prism.highlightAllUnder(output);
    renderMathInElement(output, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ]
    });
    addCopyButtons();
}

async function deleteCurrentConversation() {
    await fetch(`/api/conversations/${currentConversationId}`, {
        method: 'DELETE'
    });
    document.getElementById('formatted-output').innerHTML = '';
    await loadConversations();
    currentConversationId = 'default';
}

function newConversation() {
    // Generate unique conversation ID
    currentConversationId = Date.now().toString();

    // Clear output
    document.getElementById('formatted-output').innerHTML = '';

    // Add new conversation to select dropdown while preserving default
    const select = document.getElementById('conversation-select');
    const defaultOption = select.querySelector('option[value="default"]');

    const option = document.createElement('option');
    option.value = currentConversationId;
    option.text = currentConversationId;
    option.selected = true;

    if (defaultOption) {
        select.insertBefore(option, defaultOption.nextSibling);
    } else {
        select.add(option);
    }
}