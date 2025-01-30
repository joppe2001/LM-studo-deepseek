function addCopyButtons() {
    document.querySelectorAll('pre').forEach(block => {
        if (block.querySelector('.copy-button')) return;

        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = 'Copy';

        button.addEventListener('click', async () => {
            const code = block.querySelector('code');
            try {
                await navigator.clipboard.writeText(code.textContent);
                button.innerHTML = 'Copied!';
                setTimeout(() => {
                    button.innerHTML = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });

        block.style.position = 'relative';
        block.appendChild(button);
    });
}
