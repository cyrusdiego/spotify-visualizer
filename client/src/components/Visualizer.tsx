import React, { FC } from 'react';
import { Preview } from './Preview';
import { Spectrum } from './Spectrum';
import './styling/Player.css';
import { useSpotifyHooks } from './hooks/UseSpotifyHooks';

interface IPlayerProps {
  accessToken: string;
  refreshToken: string;
}

export const Visualizer: FC<IPlayerProps> = (props) => {
  const { accessToken, refreshToken } = props;
  const { trackInfo, trackAnalysis, updateTrackHandler } = useSpotifyHooks(
    accessToken
  );

  const refreshClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // will need to find a way to get new access token when it expires...
    updateTrackHandler();
  };

  return (
    <div className='player_container'>
      <Preview currentTrack={trackInfo} refresh={refreshClick} />
      <Spectrum
        trackAnalysis={trackAnalysis}
        progress={trackInfo.progress_ms}
      />
    </div>
  );
};
