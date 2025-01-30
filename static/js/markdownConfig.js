// 1. Basic Markdown Configuration
marked.setOptions({
    breaks: true,
    gfm: true,
    pedantic: false,
    smartLists: true
});

// 2. Custom Markdown Renderer
const customRenderer = {
    // Prevent nested code block rendering
    code(code, language) {
        // Clean up the code content
        code = code.replace(/^```[\w\s]*\n?|\n?```$/g, '');

        // Remove any duplicate "Copy" text that might have been added
        code = code.replace(/^(Copy\s*)+/gm, '');

        try {
            // Apply syntax highlighting if language is specified
            if (language && Prism.languages[language]) {
                const highlighted = Prism.highlight(
                    code,
                    Prism.languages[language],
                    language
                );
                return `<pre><code class="language-${language}">${highlighted}</code></pre>`;
            }

            // Return plain code block if no language specified
            return `<pre><code>${code}</code></pre>`;
        } catch (e) {
            console.error('Code highlighting error:', e);
            return `<pre><code>${code}</code></pre>`;
        }
    },

    // Customize other elements if needed
    blockquote(quote) {
        return `<blockquote class="markdown-quote">${quote}</blockquote>`;
    },

    // Prevent processing of already processed content
    html(html) {
        return html;
    }
};

// 3. Apply Custom Renderer
marked.use({ renderer: customRenderer });

// 4. Content Processing Function
function processContent(content) {
    // Remove any existing HTML tags for code blocks
    content = content.replace(/<pre><code>.*?<\/code><\/pre>/gs, match => {
        return match.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    });

    return content;
}

// 5. Main Render Function
function renderContent(element) {
    if (!element || !element.textContent) return;

    try {
        // Process the content first
        const processedContent = processContent(element.textContent);

        // Convert markdown to HTML
        element.innerHTML = marked.parse(processedContent);

        // Apply syntax highlighting
        Prism.highlightAllUnder(element);

        // Add copy buttons
        addCopyButtons();

        // Render LaTeX
        renderMathInElement(element, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\[', right: '\\]', display: true },
                { left: '\\(', right: '\\)', display: false }
            ],
            throwOnError: false
        });
    } catch (e) {
        console.error('Content rendering error:', e);
    }
}

// Export for global use
window.renderContent = renderContent;
