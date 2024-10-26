var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var currentTag = '';
var isAtNewLine = true;
var codeBuffer = '';
var headerBuffer = '';
var isInlineCodeActive = false;
var isInCodeBlock = false;
var backtickBuffer = '';
function renderMarkdown(chunk) {
    var _a, _b;
    var outputElement = document.getElementById('markdown-output');
    for (var _i = 0, chunk_1 = chunk; _i < chunk_1.length; _i++) {
        var char = chunk_1[_i];
        if (char === '`') {
            backtickBuffer += char;
            continue;
        }
        if (backtickBuffer) {
            if (backtickBuffer === '```') {
                isInCodeBlock = !isInCodeBlock;
                backtickBuffer = '';
                if (!isInCodeBlock && codeBuffer) {
                    var codeElement = document.createElement("pre");
                    codeElement.textContent = codeBuffer.trim();
                    outputElement.appendChild(codeElement);
                    codeBuffer = '';
                }
            }
            else if (backtickBuffer === '`' && !isInCodeBlock) {
                isInlineCodeActive = !isInlineCodeActive;
                backtickBuffer = '';
                if (isInlineCodeActive) {
                    var inlineCodeElement = document.createElement('code');
                    var lastDiv = ((_a = outputElement.lastChild) === null || _a === void 0 ? void 0 : _a.nodeName) === 'DIV' ? outputElement.lastChild : outputElement.appendChild(document.createElement('div'));
                    lastDiv.appendChild(inlineCodeElement);
                }
            }
            else {
                backtickBuffer = '';
            }
        }
        if (isInCodeBlock) {
            codeBuffer += char;
        }
        else if (isInlineCodeActive && ((_b = outputElement.lastChild) === null || _b === void 0 ? void 0 : _b.nodeName) === 'DIV') {
            outputElement.lastChild.lastChild.textContent += char;
        }
        else if (isHeader(char)) {
            headerBuffer += char;
        }
        else if (headerBuffer && (char === ' ' || isNewLine(char))) {
            handleHeader(outputElement);
            appendCharacterToCurrentElement(char, outputElement);
        }
        else if (isNewLine(char)) {
            handleNewLine(outputElement);
        }
        else {
            appendCharacterToCurrentElement(char, outputElement);
        }
    }
    if (backtickBuffer === '```') {
        isInCodeBlock = !isInCodeBlock;
        backtickBuffer = '';
        if (!isInCodeBlock && codeBuffer) {
            var codeElement = document.createElement("pre");
            codeElement.textContent = codeBuffer.trim();
            outputElement.appendChild(codeElement);
            codeBuffer = '';
        }
    }
}
function isHeader(char) {
    return char === '#' && isAtNewLine;
}
function handleHeader(outputElement) {
    var headerLevel = headerBuffer.length;
    currentTag = "h".concat(headerLevel);
    var headerElement = document.createElement(currentTag);
    outputElement.appendChild(headerElement);
    headerBuffer = '';
}
function isNewLine(char) {
    return char === '\n';
}
function handleNewLine(outputElement) {
    isAtNewLine = true;
    currentTag = 'div';
    outputElement.appendChild(document.createElement('div'));
    headerBuffer = '';
}
function appendCharacterToCurrentElement(char, outputElement) {
    if (headerBuffer) {
        headerBuffer += char;
    }
    else if (outputElement.lastChild) {
        var lastDiv = outputElement.lastChild;
        var code = lastDiv.querySelector('code');
        if (code && isInlineCodeActive) {
            code.textContent += char;
        }
        else {
            lastDiv.textContent += char;
        }
    }
    isAtNewLine = false;
}
var markdownString = "# Hello World\n\nLet's start with simple things.  \nSome code: `console.log('Hello World')`\n\n### Getting harder\n\nSome more code:\n```js\nconst foobar = 42\n\nconst barfoo = 24\n```\n";
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var rawMarkdown, i, chunkSize, chunk;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rawMarkdown = document.getElementById('markdown');
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < markdownString.length)) return [3 /*break*/, 4];
                    chunkSize = Math.floor(Math.random() * 5) + 1;
                    chunk = markdownString.slice(i, i + chunkSize);
                    rawMarkdown.textContent += chunk;
                    renderMarkdown(chunk);
                    i += chunkSize;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
