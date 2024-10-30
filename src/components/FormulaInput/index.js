import React, {memo} from 'react';
import {useFeatureFlags} from '../../context/FeatureFlagsContext';
import './style.css';

const FormulaInput = memo(({
                               formula,
                               onFormulaChange,
                               error
                           }) => {
    const {permissions} = useFeatureFlags();

    const handleClear = () => {
        onFormulaChange('');
    };

    return (
        <div className="formula-input-container">
            <div className="input-wrapper">
                <input
                    type="text"
                    value={formula}
                    onChange={(e) => onFormulaChange(e.target.value)}
                    placeholder="Enter your formula (e.g., 2*x + y^2)"
                    className={`formula-input ${error ? 'error' : ''}`}
                    disabled={!permissions.canEdit}
                />
                {permissions.canEdit && (
                    <button
                        type="button"
                        className="clear-button"
                        onClick={handleClear}
                        aria-label="Clear formula"
                        disabled={!!!formula}
                    > Clear </button>
                )}

            </div>
        </div>
    );
});

FormulaInput.displayName = 'FormulaInput';

export default FormulaInput;