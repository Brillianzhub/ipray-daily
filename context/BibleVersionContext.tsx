import React, { createContext, useContext, useState } from 'react';
import { BibleVersion } from '@/lib/database'; 

type BibleVersionContextType = {
  version: BibleVersion;
  setVersion: (version: BibleVersion) => void;
};


const BibleVersionContext = createContext<BibleVersionContextType>({
    version: 'KJV',
    setVersion: () => { },
});

export const BibleVersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [version, setVersion] = useState<BibleVersion>('KJV');

    return (
        <BibleVersionContext.Provider value={{ version, setVersion }}>
            {children}
        </BibleVersionContext.Provider>
    );
};

export const useBibleVersion = () => useContext(BibleVersionContext);