import React from 'react';
import Calculator from './components/Calculator';
import {FeatureFlagsProvider} from './context/FeatureFlagsContext';
import './App.css';

function App() {
    return (
        <FeatureFlagsProvider>
            <div className="App">
                <Calculator/>
            </div>
        </FeatureFlagsProvider>
    );
}

export default App;