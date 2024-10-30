import React, { useEffect } from 'react';
import FormulaInput from '../FormulaInput';
import LatexRenderer from '../LatexRenderer';
import VariableInputs from '../VariableInputs';
import ResultDisplay from '../ResultDisplay';
import SavedFormulas from '../SavedFormulas';
import { useFormula } from '../../hooks/useFormula';
import { useFeatureFlags } from '../../context/FeatureFlagsContext';
import { convertToLatex } from '../../utils/formulaUtils';
import './style.css';

const Calculator = () => {
    const {
        formula,
        variables,
        result,
        error,
        updateFormula,
        setVariables,
        calculateResult,
    } = useFormula();

    const { featureFlags } = useFeatureFlags();

    useEffect(() => {
        calculateResult();
    }, [variables, formula, calculateResult]);

    return (
        <div className="calculator-container">
            <h2>Formula Calculator</h2>

            <LatexRenderer
                formula={convertToLatex(formula)}
            />

            <FormulaInput
                formula={formula}
                onFormulaChange={updateFormula}
                error={error}
            />

            <VariableInputs
                variables={variables}
                onVariableChange={setVariables}
                maxVariables={featureFlags.MAX_VARIABLES}
            />

            <ResultDisplay
                result={result}
                error={error}
            />

            {featureFlags.FORMULA_SAVING && (
                <SavedFormulas
                    currentFormula={formula}
                    onFormulaLoad={updateFormula}
                    maxSaved={featureFlags.MAX_SAVED_FORMULAS}
                />
            )}
        </div>
    );
};

export default Calculator;