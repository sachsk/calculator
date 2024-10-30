import React, {memo} from 'react';
import {useFeatureFlags} from '../../context/FeatureFlagsContext';
import './style.css';

const VariableInputs = memo(({variables, onVariableChange, maxVariables}) => {
    const {permissions} = useFeatureFlags();

    if (Object.keys(variables).length > maxVariables) {
        return <div className="error-message">Maximum variable limit exceeded</div>;
    }

    const handleVariableChange = (variable, value) => {
        onVariableChange(prev => ({
            ...prev,
            [variable]: parseFloat(value)
        }));
    };

    return (
        <div className="variables-container">
            {Object.entries(variables).map(([variable, value]) => (
                <div key={variable} className="variable-input">
                    <label htmlFor={`var-${variable}`}>{variable} = </label>
                    <input
                        id={`var-${variable}`}
                        type="number"
                        value={value ? value : ''}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        disabled={!permissions.canEdit}
                        step="any"
                    />
                </div>
            ))}
        </div>
    );
});

VariableInputs.displayName = 'VariableInputs';

export default VariableInputs;