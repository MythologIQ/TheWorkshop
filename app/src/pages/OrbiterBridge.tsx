import React from 'react';
import StationIntro from '../components/StationIntro';

const OrbiterBridgePage: React.FC = () => (
  <div className="p-4">
    <StationIntro
      badge="Reflect Station"
      title="Orbiter Bridge"
      description="The Creation Lab gently asks what felt good, what surprised you, and what to try next. Reflect with the AI helper and decide the story you want to keep."
      tip="Tell the AI one thing that helped you and one thing you'd change for next time."
    />
  </div>
);

export default OrbiterBridgePage;
