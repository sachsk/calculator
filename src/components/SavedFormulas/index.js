import React, { memo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFeatureFlags } from '../../context/FeatureFlagsContext';
import './style.css';

const SavedFormulas = memo(({ currentFormula, onFormulaLoad, maxSaved }) => {
    const { permissions } = useFeatureFlags();
    const [savedFormulas, setSavedFormulas] = useLocalStorage('savedFormulas', []);
    const [formulaName, setFormulaName] = React.useState('');

    const handleSave = () => {
        if (!currentFormula || !formulaName) return;
        if (savedFormulas.length >= maxSaved) {
            alert(`Maximum limit of ${maxSaved} saved formulas reached`);
            return;
        }

        const newFormula = {
            id: Date.now(),
            name: formulaName,
            formula: currentFormula,
            timestamp: new Date().toISOString()
        };

        setSavedFormulas(prev => [...prev, newFormula]);
        setFormulaName('');
    };

    const handleDelete = (id) => {
        setSavedFormulas(prev => prev.filter(formula => formula.id !== id));
    };

    return (
        <div className="saved-formulas">
            <h3>Saved Formulas</h3>

            {permissions.canSave && (
                <div className="save-controls">
                    <input
                        type="text"
                        value={formulaName}
                        onChange={(e) => setFormulaName(e.target.value)}
                        placeholder="Formula name"
                        className="formula-name-input"
                    />
                    <button
                        onClick={handleSave}
                        disabled={!currentFormula || !formulaName}
                        className="save-button"
                    >
                        Save Formula
                    </button>
                </div>
            )}

            <div className="formulas-grid">
                {savedFormulas.map((saved) => (
                    <div key={saved.id} className="formula-card">
                        <h4>{saved.name}</h4>
                        <p className="formula-text">{saved.formula}</p>
                        <div className="card-actions">
                            <button
                                onClick={() => onFormulaLoad(saved.formula)}
                                className="load-button"
                            >
                                Load
                            </button>
                            {permissions.canDelete && (
                                <button
                                    onClick={() => handleDelete(saved.id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

SavedFormulas.displayName = 'SavedFormulas';

export default SavedFormulas;