let currentTag: string = '';
let isAtNewLine: boolean = true;
let codeBuffer: string = '';
let headerBuffer: string = '';
let isInlineCodeActive: boolean = false;
let isInCodeBlock: boolean = false;
let backtickBuffer: string = '';

function renderMarkdown(chunk: string): void {
    const outputElement = document.getElementById('markdown-output') as HTMLElement;

    for (const char of chunk) {
        if (char === '`') {
            backtickBuffer += char;
            continue;
        }

        if (backtickBuffer) {
            if (backtickBuffer === '```') {
                isInCodeBlock = !isInCodeBlock;
                backtickBuffer = '';

                if (!isInCodeBlock && codeBuffer) {
                    const codeElement = document.createElement("pre");
                    codeElement.textContent = codeBuffer.trim();
                    outputElement.appendChild(codeElement);
                    codeBuffer = '';
                }
            } else if (backtickBuffer === '`' && !isInCodeBlock) {
                isInlineCodeActive = !isInlineCodeActive;
                backtickBuffer = '';

                if (isInlineCodeActive) {
                    const inlineCodeElement = document.createElement('code');
                    const lastDiv = outputElement.lastChild?.nodeName === 'DIV' ? outputElement.lastChild as HTMLElement : outputElement.appendChild(document.createElement('div'));
                    lastDiv.appendChild(inlineCodeElement);
                }
            } else {
                backtickBuffer = '';
            }
        }

        if (isInCodeBlock) {
            codeBuffer += char;
        } else if (isInlineCodeActive && outputElement.lastChild?.nodeName === 'DIV') {
            (outputElement.lastChild as HTMLElement).lastChild!.textContent += char;
        } else if (isHeader(char)) {
            headerBuffer += char;
        } else if (headerBuffer && (char === ' ' || isNewLine(char))) {
            handleHeader(outputElement);
            appendCharacterToCurrentElement(char, outputElement);
        } else if (isNewLine(char)) {
            handleNewLine(outputElement);
        } else {
            appendCharacterToCurrentElement(char, outputElement);
        }
    }

    if (backtickBuffer === '```') {
        isInCodeBlock = !isInCodeBlock;
        backtickBuffer = '';

        if (!isInCodeBlock && codeBuffer) {
            const codeElement = document.createElement("pre");
            codeElement.textContent = codeBuffer.trim();
            outputElement.appendChild(codeElement);
            codeBuffer = '';
        }
    }
}

function isHeader(char: string): boolean {
    return char === '#' && isAtNewLine;
}

function handleHeader(outputElement: HTMLElement): void {
    const headerLevel = headerBuffer.length;
    currentTag = `h${headerLevel}`;
    const headerElement = document.createElement(currentTag);
    outputElement.appendChild(headerElement);
    headerBuffer = '';
}

function isNewLine(char: string): boolean {
    return char === '\n';
}

function handleNewLine(outputElement: HTMLElement): void {
    isAtNewLine = true;
    currentTag = 'div';
    outputElement.appendChild(document.createElement('div'));
    headerBuffer = '';
}

function appendCharacterToCurrentElement(char: string, outputElement: HTMLElement): void {
    if (headerBuffer) {
        headerBuffer += char;
    } else if (outputElement.lastChild) {
        const lastDiv = outputElement.lastChild as HTMLElement;
        const code = lastDiv.querySelector('code');
        if (code && isInlineCodeActive) {
            code.textContent += char;
        } else {
            lastDiv.textContent += char;
        }
    }
    isAtNewLine = false;
}

const markdownString: string = `# Hello World

Let's start with simple things.  
Some code: \`console.log('Hello World')\`

### Getting harder

Some more code:
\`\`\`js
const foobar = 42

const barfoo = 24
\`\`\`
`;

async function start(): Promise<void> {
    const rawMarkdown = document.getElementById('markdown') as HTMLElement;

    for (let i = 0; i < markdownString.length; ) {
        const chunkSize = Math.floor(Math.random() * 5) + 1;
        const chunk = markdownString.slice(i, i + chunkSize);
        
        rawMarkdown.textContent += chunk;
        renderMarkdown(chunk);
        i += chunkSize;
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    }
}
