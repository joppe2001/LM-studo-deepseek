let thinkingStartTime = null;
let currentThinkingContainer = null;
let thinkingSectionCount = 0;
let isInThinkingMode = false;
let timerId = null;
let finalThinkingTime = null;

function formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}s ${milliseconds}ms`;
}

function processThinkingTags(text, aiContent) {
    const messageId = Date.now().toString();

    function preprocessCodeBlocks(text) {
        return text.replace(/```(\w+)([^\n]*)/, (match, lang, rest) => {
            return `\`\`\`${lang}\n${rest.trim()}`;
        });
    }

    text = preprocessCodeBlocks(text);

    const existingThinking = aiContent.querySelector('.thinking-container');
    const existingAnswer = aiContent.querySelector('.answer-content');

    if (text.includes('<think>')) {
        if (!isInThinkingMode && !existingThinking) {
            // Reset timer state
            thinkingStartTime = Date.now();
            isInThinkingMode = true;
            finalThinkingTime = null;

            const wrapper = document.createElement('div');
            wrapper.className = 'thinking-answer-wrapper';
            wrapper.id = `wrapper-${messageId}`;

            const thinkingContainer = document.createElement('div');
            thinkingContainer.className = 'thinking-container';
            thinkingContainer.id = `thinking-section-${messageId}`;
            thinkingContainer.innerHTML = `
                <div class="thinking-header" onclick="toggleThinking('thinking-section-${messageId}')">
                    <span class="thinking-title">Thinking Process</span>
                    <span class="thinking-time" id="thinking-timer-${messageId}">Time: 0ms</span>
                    <span class="thinking-toggle">▼</span>
                </div>
                <div class="thinking-content"></div>
            `;

            const answerContainer = document.createElement('div');
            answerContainer.className = 'answer-content';
            answerContainer.id = `answer-section-${messageId}`;

            wrapper.appendChild(thinkingContainer);
            wrapper.appendChild(answerContainer);
            aiContent.appendChild(wrapper);

            // Start timer
            if (timerId) clearInterval(timerId);
            timerId = setInterval(() => {
                const timeElement = document.getElementById(`thinking-timer-${messageId}`);
                if (timeElement && isInThinkingMode) {
                    const elapsed = Date.now() - thinkingStartTime;
                    timeElement.textContent = `Time: ${formatTime(elapsed)}`;
                }
            }, 100);
        }

        if (text.includes('</think>')) {
            const thinkRegex = /<think>([\s\S]*?)<\/think>/;
            const match = text.match(thinkRegex);

            if (match) {
                const thinkingContent = match[1];
                const thinkingContainer = aiContent.querySelector('.thinking-content');
                if (thinkingContainer) {
                    thinkingContainer.innerHTML = marked.parse(thinkingContent);
                }

                const answerText = text.split('</think>')[1] || '';
                const answerContainer = aiContent.querySelector('.answer-content');
                if (answerContainer) {
                    answerContainer.innerHTML = marked.parse(answerText.trim());
                }

                // Stop thinking mode and timer
                isInThinkingMode = false;
                finalThinkingTime = Date.now() - thinkingStartTime;
                if (timerId) {
                    clearInterval(timerId);
                    timerId = null;
                }

                // Update final time
                const timeElement = document.getElementById(`thinking-timer-${messageId}`);
                if (timeElement) {
                    timeElement.textContent = `Time: ${formatTime(finalThinkingTime)}`;
                }
            }
        } else {
            const thinkRegex = /<think>([\s\S]*?)$/;
            const match = text.match(thinkRegex);
            if (match) {
                const thinkingContent = match[1];
                const container = aiContent.querySelector('.thinking-content');
                if (container) {
                    container.innerHTML = marked.parse(thinkingContent);
                }
            }
        }
    } else {
        if (!existingAnswer) {
            const answerContainer = document.createElement('div');
            answerContainer.className = 'answer-content';
            answerContainer.id = `answer-section-${messageId}`;
            aiContent.appendChild(answerContainer);
        }
        const answerContainer = aiContent.querySelector('.answer-content');
        if (answerContainer) {
            answerContainer.innerHTML = marked.parse(text.trim());
        }
    }
}

function toggleThinking(thinkingSectionId) {
    const container = document.getElementById(thinkingSectionId);
    if (container) {
        container.classList.toggle('expanded');
    }
}
