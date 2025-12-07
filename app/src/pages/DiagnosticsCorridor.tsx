import React from 'react';
import StationIntro from '../components/StationIntro';

const DiagnosticsCorridorPage: React.FC = () => (
  <div className="p-4">
    <StationIntro
      badge="Test Station"
      title="Diagnostics Corridor"
      description="Creation Lab uses this hallway to answer, 'What should it do?'—try it, look for what works, and write down the discoveries with calm help from the AI."
      tip="Ask the question, try the idea, then jot the result so you can fix or celebrate it."
    />
  </div>
);

export default DiagnosticsCorridorPage;
