import { useState, useCallback } from 'react';
import { evaluateFormula, extractVariables } from '../utils/formulaUtils';
import { validateFormula } from '../utils/validators';

export const useFormula = () => {
    const [formula, setFormula] = useState('');
    const [variables, setVariables] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const updateFormula = useCallback((newFormula) => {
        try {
            const isValid = validateFormula(newFormula);
            if (!isValid) {
                throw new Error('Invalid formula format');
            }

            setFormula(newFormula);
            const extractedVars = extractVariables(newFormula);

            setVariables(prev => {
                const newVars = {};
                extractedVars.forEach(v => {
                    newVars[v] = prev[v] || 0;
                });
                return newVars;
            });

            setError('');
        } catch (err) {
            setError(err.message);
        }
    }, []);

    const calculateResult = useCallback(() => {
        try {
            if (!formula) {
                setResult(null);
                return;
            }
            const calculatedResult = evaluateFormula(formula, variables);
            setResult(calculatedResult);
            setError('');
        } catch (err) {
            setError(err.message);
            setResult(null);
        }
    }, [formula, variables]);

    return {
        formula,
        variables,
        result,
        error,
        updateFormula,
        setVariables,
        calculateResult,
    };
};