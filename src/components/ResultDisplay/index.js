import React, { memo } from 'react';
import './style.css';

const ResultDisplay = memo(({ result, error }) => {
    const formatResult = (value) => {
        if (typeof value !== 'number') return '';
        return Math.abs(value) < 0.0001 ? value.toExponential(4) : value.toFixed(4);
    };

    return (
        <div className="result-container">
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="result">
                    {result !== null ? (
                        <>
                            <span className="result-label">Result:</span>
                            <span className="result-value">{formatResult(result)}</span>
                        </>
                    ) : (
                        <span className="result-placeholder">
              Enter a formula and values to calculate
            </span>
                    )}
                </div>
            )}
        </div>
    );
});

ResultDisplay.displayName = 'ResultDisplay';

export default ResultDisplay;