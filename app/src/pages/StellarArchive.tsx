import React from 'react';
import StationIntro from '../components/StationIntro';

const StellarArchivePage: React.FC = () => (
  <div className="p-4">
    <StationIntro
      badge="Memory Station"
      title="Stellar Archive"
      description="Capture the wins and lessons so you never forget what worked. The Creation Lab stores snapshots with gentle prompts to celebrate each tiny success."
      tip="Write one proud moment and one thing you learned so future projects remember both."
    />
  </div>
);

export default StellarArchivePage;
