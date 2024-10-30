import React, { memo } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useFeatureFlags } from '../../context/FeatureFlagsContext';
import './style.css';

const LatexRenderer = memo(({ formula }) => {
    const { featureFlags } = useFeatureFlags();

    if (!featureFlags.LATEX_PREVIEW) {
        return null;
    }
    console.log('formula-->',formula);
    return (
        <div className="latex-display">
            {formula && <InlineMath math={formula} />}
        </div>
    );
});

LatexRenderer.displayName = 'LatexRenderer';

export default LatexRenderer;