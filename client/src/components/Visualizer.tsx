import React, { FC } from 'react';
import { Player } from './Player';
import { Spectrum } from './Spectrum';
import './styling/Player.css';
import { useSpotifyHooks } from './hooks/UseSpotifyHooks';
import { useHover } from './hooks/UseHoverHooks';

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
    // updateTrackHandler();
  };

  return (
    <div className='player_container'>
      <Player currentTrack={trackInfo} refresh={refreshClick} />
      <Spectrum
        trackAnalysis={trackAnalysis}
        trackProgress={trackInfo.progress_s}
        timeMeasured={trackInfo.timeMeasured_s}
        duration={trackInfo.duration_s}
      />
    </div>
  );
};
