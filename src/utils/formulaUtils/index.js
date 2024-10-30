// Constants for token types and operators
const TokenType = {
    NUMBER: 'NUMBER',
    VARIABLE: 'VARIABLE',
    OPERATOR: 'OPERATOR',
    LEFT_PAREN: 'LEFT_PAREN',
    RIGHT_PAREN: 'RIGHT_PAREN',
    FUNCTION: 'FUNCTION'
};

const OPERATORS = {
    '+': { precedence: 2, associativity: 'left' },
    '-': { precedence: 2, associativity: 'left' },
    '*': { precedence: 3, associativity: 'left' },
    '/': { precedence: 3, associativity: 'left' },
    '^': { precedence: 4, associativity: 'right' }
};

const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'sqrt', 'log', 'abs']);

// Tokenizer
export const tokenize = (formula) => {
    const tokens = [];
    let position = 0;

    const isDigit = (char) => /[0-9.]/.test(char);
    const isLetter = (char) => /[a-zA-Z]/.test(char);
    const isWhitespace = (char) => /\s/.test(char);

    while (position < formula.length) {
        let char = formula[position];

        // Skip whitespace
        if (isWhitespace(char)) {
            position++;
            continue;
        }

        // Handle numbers (including decimals)
        if (isDigit(char)) {
            let number = '';
            let hasDecimal = false;

            while (position < formula.length && (isDigit(char) || char === '.')) {
                if (char === '.') {
                    if (hasDecimal) {
                        throw new Error('Invalid number format: multiple decimal points');
                    }
                    hasDecimal = true;
                }
                number += char;
                position++;
                char = formula[position];
            }

            tokens.push({
                type: TokenType.NUMBER,
                value: parseFloat(number)
            });
            continue;
        }

        // Handle variables and functions
        if (isLetter(char)) {
            let name = '';
            while (position < formula.length && isLetter(char)) {
                name += char;
                position++;
                char = formula[position];
            }

            tokens.push({
                type: FUNCTIONS.has(name) ? TokenType.FUNCTION : TokenType.VARIABLE,
                value: name
            });
            continue;
        }

        // Handle operators and parentheses
        if (OPERATORS[char]) {
            // Handle unary minus
            if (char === '-' && (tokens.length === 0 ||
                tokens[tokens.length - 1].type === TokenType.OPERATOR ||
                tokens[tokens.length - 1].type === TokenType.LEFT_PAREN)) {
                tokens.push({ type: TokenType.NUMBER, value: 0 });
            }

            tokens.push({
                type: TokenType.OPERATOR,
                value: char
            });
            position++;
            continue;
        }

        if (char === '(') {
            tokens.push({ type: TokenType.LEFT_PAREN });
            position++;
            continue;
        }

        if (char === ')') {
            tokens.push({ type: TokenType.RIGHT_PAREN });
            position++;
            continue;
        }

        throw new Error(`Invalid character: ${char}`);
    }

    return tokens;
};

// Convert to Reverse Polish Notation (RPN)
const toRPN = (tokens) => {
    const output = [];
    const stack = [];

    for (const token of tokens) {
        switch (token.type) {
            case TokenType.NUMBER:
            case TokenType.VARIABLE:
                output.push(token);
                break;

            case TokenType.FUNCTION:
                stack.push(token);
                break;

            case TokenType.OPERATOR:
                while (stack.length > 0) {
                    const top = stack[stack.length - 1];
                    if (top.type !== TokenType.OPERATOR) break;

                    const currentOp = OPERATORS[token.value];
                    const topOp = OPERATORS[top.value];

                    if ((currentOp.associativity === 'left' && currentOp.precedence <= topOp.precedence) ||
                        (currentOp.associativity === 'right' && currentOp.precedence < topOp.precedence)) {
                        output.push(stack.pop());
                    } else {
                        break;
                    }
                }
                stack.push(token);
                break;

            case TokenType.LEFT_PAREN:
                stack.push(token);
                break;

            case TokenType.RIGHT_PAREN:
                while (stack.length > 0 && stack[stack.length - 1].type !== TokenType.LEFT_PAREN) {
                    output.push(stack.pop());
                }
                if (stack.length === 0) {
                    throw new Error('Mismatched parentheses');
                }
                stack.pop(); // Remove left parenthesis

                // Handle function calls
                if (stack.length > 0 && stack[stack.length - 1].type === TokenType.FUNCTION) {
                    output.push(stack.pop());
                }
                break;
        }
    }

    while (stack.length > 0) {
        const token = stack.pop();
        if (token.type === TokenType.LEFT_PAREN) {
            throw new Error('Mismatched parentheses');
        }
        output.push(token);
    }

    return output;
};

// Evaluate RPN expression
const evaluateRPN = (rpn, variables) => {
    const stack = [];

    for (const token of rpn) {
        switch (token.type) {
            case TokenType.NUMBER:
                stack.push(token.value);
                break;

            case TokenType.VARIABLE:
                if (variables[token.value] === undefined) {
                    throw new Error(`Undefined variable: ${token.value}`);
                }
                stack.push(variables[token.value]);
                break;

            case TokenType.OPERATOR:
                if (stack.length < 2) {
                    throw new Error('Invalid expression');
                }
                const b = stack.pop();
                const a = stack.pop();

                switch (token.value) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/':
                        if (b === 0) throw new Error('Division by zero');
                        stack.push(a / b);
                        break;
                    case '^': stack.push(Math.pow(a, b)); break;
                }
                break;

            case TokenType.FUNCTION:
                if (stack.length < 1) {
                    throw new Error('Invalid function call');
                }
                const arg = stack.pop();

                switch (token.value) {
                    case 'sin': stack.push(Math.sin(arg)); break;
                    case 'cos': stack.push(Math.cos(arg)); break;
                    case 'tan': stack.push(Math.tan(arg)); break;
                    case 'sqrt':
                        if (arg < 0) throw new Error('Square root of negative number');
                        stack.push(Math.sqrt(arg));
                        break;
                    case 'log':
                        if (arg <= 0) throw new Error('Logarithm of non-positive number');
                        stack.push(Math.log(arg));
                        break;
                    case 'abs': stack.push(Math.abs(arg)); break;
                }
                break;
        }
    }

    if (stack.length !== 1) {
        throw new Error('Invalid expression');
    }

    return stack[0];
};

// Extract variables from formula
export const extractVariables = (formula) => {
    try {
        const tokens = tokenize(formula);
        const variables = new Set();

        tokens.forEach(token => {
            if (token.type === TokenType.VARIABLE) {
                variables.add(token.value);
            }
        });

        return Array.from(variables);
    } catch (error) {
        return [];
    }
};

// Convert formula to LaTeX
export const convertToLatex = (formula) => {
    if (!formula) return '';

    let result = formula
        // Handle multiplication
        .replace(/\*/g, '\\cdot ')
        // Handle division
        .replace(/\//g, '\\div ')
        // Handle exponents
        .replace(/\^(\d+)/g, '^{$1}')
        .replace(/\^([a-zA-Z])/g, '^{$1}')
        // Handle functions
        .replace(/sin/g, '\\sin')
        .replace(/cos/g, '\\cos')
        .replace(/tan/g, '\\tan')
        .replace(/sqrt/g, '\\sqrt')
        .replace(/log/g, '\\ln')
        // Handle implicit multiplication
        .replace(/(\d)([a-zA-Z])/g, '$1\\cdot $2');

    return result;
};

// Validate formula syntax
export const validateFormula = (formula) => {
    try {
        const tokens = tokenize(formula);
        toRPN(tokens); // This will throw if syntax is invalid
        return true;
    } catch (error) {
        return false;
    }
};

// Main evaluation function
export const evaluateFormula = (formula, variables = {}) => {
    try {
        const tokens = tokenize(formula);
        const rpn = toRPN(tokens);
        return evaluateRPN(rpn, variables);
    } catch (error) {
        throw new Error(`Evaluation error: ${error.message}`);
    }
};

// Format number for display
export const formatNumber = (number) => {
    if (typeof number !== 'number') return '';
    if (Math.abs(number) < 0.0001 || Math.abs(number) > 9999) {
        return number.toExponential(4);
    }
    return number.toFixed(4).replace(/\.?0+$/, '');
};