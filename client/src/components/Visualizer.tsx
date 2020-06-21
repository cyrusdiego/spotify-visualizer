import React, { FC } from 'react';
import { Player } from './Player';
import { Spectrum } from './Spectrum';
import './styling/Visualizer.css';
import { useSpotifyHooks } from './hooks/UseSpotifyHooks';

interface IPlayerProps {
  accessToken: string;
  refreshToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

export const Visualizer: FC<IPlayerProps> = (props) => {
  const { accessToken, refreshToken, setAccessToken } = props;
  const { trackInfo, trackAnalysis, updateTrackHandler } = useSpotifyHooks(
    accessToken,
    refreshToken,
    setAccessToken
  );
  const isReady = trackInfo.is_playing && trackAnalysis.available;
  const isAvailable = trackAnalysis.available;
  const refreshClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // will need to find a way to get new access token when it expires...
    updateTrackHandler();
  };

  return (
    <div className='player_container'>
      <Player
        currentTrack={trackInfo}
        refresh={refreshClick}
        isReady={isReady}
      />
      {isReady ? (
        <Spectrum
          trackAnalysis={trackAnalysis}
          trackProgress={trackInfo.progress_s}
          timeMeasured={trackInfo.timeMeasured_s}
          updateTrack={updateTrackHandler}
        />
      ) : (
        <div className='error_container'>
          <h1>
            {isAvailable
              ? 'Ensure track is playing'
              : 'Track analysis unavailble, pick a different track'}
          </h1>
          <h3>Press refresh button</h3>
        </div>
      )}
    </div>
  );
};
