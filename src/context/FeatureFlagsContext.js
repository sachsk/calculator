import React, { createContext, useContext } from 'react';
import { featureFlags, permissions } from '../config/features';

const FeatureFlagsContext = createContext();

export const FeatureFlagsProvider = ({ children }) => {
    return (
        <FeatureFlagsContext.Provider value={{ featureFlags, permissions }}>
            {children}
        </FeatureFlagsContext.Provider>
    );
};

export const useFeatureFlags = () => {
    const context = useContext(FeatureFlagsContext);
    if (!context) {
        throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
    }
    return context;
};