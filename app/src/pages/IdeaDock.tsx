import React from 'react';
import StationIntro from '../components/StationIntro';

const IdeaDock: React.FC = () => (
  <div className="p-4">
    <StationIntro
      badge="Idea Station"
      title="Design Dock"
      description="MythologIQ Creation Lab reminds you to describe who you are building for, sketch the tiniest first step, and stay curious while the AI helper offers gentle questions."
      tip="Answer the question 'Who is this for?' and pick one small thing to try."
    />
  </div>
);

export default IdeaDock;
