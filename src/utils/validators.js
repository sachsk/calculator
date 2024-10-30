/**
 * Constants for validation rules
 */
export const ValidationConstants = {
    FORMULA: {
        MAX_LENGTH: 500,
        MIN_LENGTH: 1
    },
    VARIABLE: {
        MAX_NAME_LENGTH: 20,
        MAX_COUNT: 10,
        MIN_VALUE: -1e10,
        MAX_VALUE: 1e10
    },
    FUNCTIONS: {
        ALLOWED: ['sin', 'cos', 'tan', 'log', 'sqrt', 'abs']
    },
    OPERATORS: {
        BASIC: ['+', '-', '*', '/', '^'],
        UNARY: ['+', '-']
    }
};

/**
 * Regular expressions for validation
 */
export const ValidationRegex = {
    VARIABLE_NAME: /^[a-zA-Z][a-zA-Z0-9_]*$/,
    NUMBER: /^-?\d*\.?\d+(?:[eE][-+]?\d+)?$/,
    OPERATOR: /^[+\-*/^]$/,
    FORMULA_CHARS: /^[a-zA-Z0-9\s+\-*/^().]+$/,
    CONSECUTIVE_OPERATORS: /[+\-*/^]{2,}/,
    FUNCTION_CALL: /([a-zA-Z]+)\s*\(/,
    EMPTY_PARENTHESES: /\(\s*\)/,
    DECIMAL_NUMBER: /\d*\.\d+|\d+/,
    WHITESPACE: /\s+/g
};

/**
 * Validates a complete mathematical formula
 * @param {string} formula - The formula to validate
 * @returns {Object} Validation result with status and error message
 */
export const validateFormula = (formula) => {
    // Basic input validation
    if (!formula || typeof formula !== 'string') {
        return {
            isValid: false,
            error: 'Formula must be a non-empty string'
        };
    }

    // Remove whitespace for consistent validation
    const cleanFormula = formula.replace(ValidationRegex.WHITESPACE, '');

    // Length validation
    if (cleanFormula.length < ValidationConstants.FORMULA.MIN_LENGTH) {
        return {
            isValid: false,
            error: 'Formula cannot be empty'
        };
    }

    if (cleanFormula.length > ValidationConstants.FORMULA.MAX_LENGTH) {
        return {
            isValid: false,
            error: `Formula exceeds maximum length of ${ValidationConstants.FORMULA.MAX_LENGTH} characters`
        };
    }

    // Character validation
    if (!ValidationRegex.FORMULA_CHARS.test(cleanFormula)) {
        return {
            isValid: false,
            error: 'Formula contains invalid characters'
        };
    }

    // Operator validation
    if (ValidationRegex.CONSECUTIVE_OPERATORS.test(cleanFormula)) {
        return {
            isValid: false,
            error: 'Formula contains consecutive operators'
        };
    }

    // Parentheses validation
    const parenthesesResult = validateParentheses(cleanFormula);
    if (!parenthesesResult.isValid) {
        return parenthesesResult;
    }

    // Function validation
    const functionResult = validateFunctions(cleanFormula);
    if (!functionResult.isValid) {
        return functionResult;
    }

    // Syntax validation
    const syntaxResult = validateSyntax(cleanFormula);
    if (!syntaxResult.isValid) {
        return syntaxResult;
    }

    return { isValid: true };
};

/**
 * Validates parentheses matching and nesting
 * @param {string} formula - The formula to check
 * @returns {Object} Validation result
 */
export const validateParentheses = (formula) => {
    const stack = [];
    let openCount = 0;
    let closeCount = 0;

    for (let i = 0; i < formula.length; i++) {
        const char = formula[i];
        if (char === '(') {
            stack.push(i);
            openCount++;
        } else if (char === ')') {
            if (stack.length === 0) {
                return {
                    isValid: false,
                    error: 'Unmatched closing parenthesis'
                };
            }
            stack.pop();
            closeCount++;
        }
    }

    if (stack.length > 0) {
        return {
            isValid: false,
            error: 'Unmatched opening parenthesis'
        };
    }

    if (ValidationRegex.EMPTY_PARENTHESES.test(formula)) {
        return {
            isValid: false,
            error: 'Empty parentheses are not allowed'
        };
    }

    return { isValid: true };
};

/**
 * Validates function usage in formula
 * @param {string} formula - The formula to check
 * @returns {Object} Validation result
 */
export const validateFunctions = (formula) => {
    let match;
    while ((match = ValidationRegex.FUNCTION_CALL.exec(formula)) !== null) {
        const func = match[1];
        if (!ValidationConstants.FUNCTIONS.ALLOWED.includes(func)) {
            return {
                isValid: false,
                error: `Unknown function: ${func}`
            };
        }
    }

    return { isValid: true };
};

/**
 * Validates mathematical syntax
 * @param {string} formula - The formula to check
 * @returns {Object} Validation result
 */
export const validateSyntax = (formula) => {
    // Check for invalid operator placement
    if (ValidationRegex.OPERATOR.test(formula[formula.length - 1])) {
        return {
            isValid: false,
            error: 'Formula cannot end with an operator'
        };
    }

    if (formula[0] === '*' || formula[0] === '/' || formula[0] === '^') {
        return {
            isValid: false,
            error: 'Formula cannot start with *, /, or ^'
        };
    }

    // Validate decimal numbers
    const numbers = formula.match(ValidationRegex.DECIMAL_NUMBER);
    if (numbers) {
        for (const num of numbers) {
            if (isNaN(parseFloat(num)) || !isFinite(parseFloat(num))) {
                return {
                    isValid: false,
                    error: `Invalid number format: ${num}`
                };
            }
        }
    }

    return { isValid: true };
};

/**
 * Validates a variable name
 * @param {string} name - The variable name to validate
 * @returns {Object} Validation result
 */
export const validateVariableName = (name) => {
    if (!name || typeof name !== 'string') {
        return {
            isValid: false,
            error: 'Variable name must be a non-empty string'
        };
    }

    if (name.length > ValidationConstants.VARIABLE.MAX_NAME_LENGTH) {
        return {
            isValid: false,
            error: `Variable name exceeds maximum length of ${ValidationConstants.VARIABLE.MAX_NAME_LENGTH} characters`
        };
    }

    if (!ValidationRegex.VARIABLE_NAME.test(name)) {
        return {
            isValid: false,
            error: 'Variable name must start with a letter and contain only letters, numbers, and underscores'
        };
    }

    if (ValidationConstants.FUNCTIONS.ALLOWED.includes(name)) {
        return {
            isValid: false,
            error: 'Variable name cannot be a reserved function name'
        };
    }

    return { isValid: true };
};

/**
 * Validates a variable value
 * @param {number|string} value - The value to validate
 * @returns {Object} Validation result
 */
export const validateVariableValue = (value) => {
    if (value === '' || value === null || value === undefined) {
        return {
            isValid: false,
            error: 'Value cannot be empty'
        };
    }

    const numValue = Number(value);

    if (isNaN(numValue) || !isFinite(numValue)) {
        return {
            isValid: false,
            error: 'Value must be a valid number'
        };
    }

    if (numValue < ValidationConstants.VARIABLE.MIN_VALUE ||
        numValue > ValidationConstants.VARIABLE.MAX_VALUE) {
        return {
            isValid: false,
            error: `Value must be between ${ValidationConstants.VARIABLE.MIN_VALUE} and ${ValidationConstants.VARIABLE.MAX_VALUE}`
        };
    }

    return { isValid: true };
};

/**
 * Validates a complete set of variables
 * @param {Object} variables - Object containing variable names and values
 * @returns {Object} Validation result
 */
export const validateVariables = (variables) => {
    if (!variables || typeof variables !== 'object') {
        return {
            isValid: false,
            error: 'Variables must be provided as an object'
        };
    }

    const varCount = Object.keys(variables).length;
    if (varCount > ValidationConstants.VARIABLE.MAX_COUNT) {
        return {
            isValid: false,
            error: `Too many variables (maximum ${ValidationConstants.VARIABLE.MAX_COUNT})`
        };
    }

    for (const [name, value] of Object.entries(variables)) {
        const nameValidation = validateVariableName(name);
        if (!nameValidation.isValid) {
            return {
                isValid: false,
                error: `Invalid variable name "${name}": ${nameValidation.error}`
            };
        }

        const valueValidation = validateVariableValue(value);
        if (!valueValidation.isValid) {
            return {
                isValid: false,
                error: `Invalid value for variable "${name}": ${valueValidation.error}`
            };
        }
    }

    return { isValid: true };
};

/**
 * Validates a saved formula name
 * @param {string} name - The name to validate
 * @returns {Object} Validation result
 */
export const validateSavedFormulaName = (name) => {
    if (!name || typeof name !== 'string') {
        return {
            isValid: false,
            error: 'Formula name must be a non-empty string'
        };
    }

    if (name.length > 50) {
        return {
            isValid: false,
            error: 'Formula name cannot exceed 50 characters'
        };
    }

    if (!/^[a-zA-Z0-9\s_-]+$/.test(name)) {
        return {
            isValid: false,
            error: 'Formula name can only contain letters, numbers, spaces, underscores, and hyphens'
        };
    }

    return { isValid: true };
};
