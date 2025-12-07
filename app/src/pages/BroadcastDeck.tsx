import React from 'react';
import StationIntro from '../components/StationIntro';

const BroadcastDeckPage: React.FC = () => (
  <div className="p-4">
    <StationIntro
      badge="Share Station"
      title="Broadcast Deck"
      description="Use the Creation Lab to collect your favorite moments, add a quick note, and let your adults or classmates see what you built."
      tip="Tell the story you are proud of—the AI helper will keep the tone kind and ready for sharing."
    />
  </div>
);

export default BroadcastDeckPage;
