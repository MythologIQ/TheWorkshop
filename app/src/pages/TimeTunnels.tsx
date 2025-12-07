import React from 'react';
import StationIntro from '../components/StationIntro';

const TimeTunnelsPage: React.FC = () => (
  <div className="p-4">
    <StationIntro
      badge="Replay Station"
      title="Time Tunnels"
      description="The Creation Lab keeps a replay history so you can open a past snapshot, compare what changed, and bring it back into the story without losing progress."
      tip="Take a snapshot before you try something new, and the AI helper will remind you how the old version felt."
    />
  </div>
);

export default TimeTunnelsPage;
