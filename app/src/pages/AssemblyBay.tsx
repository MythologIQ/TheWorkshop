import React from 'react';
import StationIntro from '../components/StationIntro';

const AssemblyBayPage: React.FC = () => (
  <div className="p-4">
    <StationIntro
      badge="Build Station"
      title="Assembly Bay"
      description="In the Creation Lab, Assembly Bay keeps every task small and joyful: pick one tiny thing, finish it, and let the AI helper celebrate the win."
      tip="If a step feels big, break it into smaller bites and ask the helper for a friendly reminder."
    />
  </div>
);

export default AssemblyBayPage;
