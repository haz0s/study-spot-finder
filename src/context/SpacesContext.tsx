import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StudySpace } from '@/types/space';
import { loadSpaces } from '@/lib/csv-parser';

interface SpacesContextType {
  spaces: StudySpace[];
  loading: boolean;
  checkIn: (id: string) => void;
  checkOut: (id: string) => void;
  pcCheckIn: (id: string) => void;
  pcCheckOut: (id: string) => void;
}

const SpacesContext = createContext<SpacesContextType | null>(null);

export function SpacesProvider({ children }: { children: React.ReactNode }) {
  const [spaces, setSpaces] = useState<StudySpace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpaces().then(data => { setSpaces(data); setLoading(false); });
  }, []);

  const checkIn = useCallback((id: string) => {
    setSpaces(prev => prev.map(s =>
      s.id === id && s.currentCheckIns < s.capacity
        ? { ...s, currentCheckIns: s.currentCheckIns + 1 }
        : s
    ));
  }, []);

  const checkOut = useCallback((id: string) => {
    setSpaces(prev => prev.map(s =>
      s.id === id && s.currentCheckIns > 0
        ? { ...s, currentCheckIns: s.currentCheckIns - 1 }
        : s
    ));
  }, []);

  const pcCheckIn = useCallback((id: string) => {
    setSpaces(prev => prev.map(s =>
      s.id === id && s.totalPCs > 0 && s.currentPCCheckIns < s.totalPCs
        ? { ...s, currentPCCheckIns: s.currentPCCheckIns + 1 }
        : s
    ));
  }, []);

  const pcCheckOut = useCallback((id: string) => {
    setSpaces(prev => prev.map(s =>
      s.id === id && s.currentPCCheckIns > 0
        ? { ...s, currentPCCheckIns: s.currentPCCheckIns - 1 }
        : s
    ));
  }, []);

  return (
    <SpacesContext.Provider value={{ spaces, loading, checkIn, checkOut, pcCheckIn, pcCheckOut }}>
      {children}
    </SpacesContext.Provider>
  );
}

export function useSpaces() {
  const ctx = useContext(SpacesContext);
  if (!ctx) throw new Error('useSpaces must be used within SpacesProvider');
  return ctx;
}
