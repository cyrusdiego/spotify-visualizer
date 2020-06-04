import React, { FC } from 'react';
import './styling/Preview.css';

interface IPreviewProps {
  currentTrack: {
    artist: string;
    name: string;
    art: string;
  };
  refresh: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Preview: FC<IPreviewProps> = ({ currentTrack, refresh }) => {
  const { artist, name, art } = currentTrack;
  const refreshOnClick = refresh;
  return (
    <div className='current_song'>
      <img src={art} alt='' className='album_art'></img>
      <div className='song_info'>
        {' '}
        <h2>{name}</h2>
        <h3>{artist}</h3>
      </div>
      <div className='refresh_container'>
        <button
          type='button'
          className='refresh_button btn btn-block btn-primary'
          onClick={refreshOnClick}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='25'
            height='25'
            viewBox='0 0 24 24'
            fill='white'
          >
            <path d='M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z' />
          </svg>
        </button>
      </div>
    </div>
  );
};
