import React from 'react';
import { Tabs, Tab } from '@mui/material';

export interface Lounge {
  id: number;
  name: string;
}

interface LoungeTabsProps {
  lounges: Lounge[];
  selectedLoungeId: number | null;
  onChange: (id: number) => void;
}

const LoungeTabs: React.FC<LoungeTabsProps> = ({ lounges, selectedLoungeId, onChange }) => (
  <Tabs value={selectedLoungeId} onChange={(_, v) => onChange(v as number)} variant="scrollable" scrollButtons="auto">
    {lounges.map(lounge => (
      <Tab key={lounge.id} label={lounge.name} value={lounge.id} />
    ))}
  </Tabs>
);

export default LoungeTabs;