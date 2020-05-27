import React, { FC, useState, useEffect } from 'react';
import { Preview } from './Preview';
import { Spectrum } from './Spectrum';
import { getHashParams } from '../api/utils';
import spotifyApi from '../api/spotify';
import { AxiosRequestConfig } from 'axios';
import { spotifyBaseUrl } from '../api/constants';
import './styling/Player.css';
interface ITokenState {
  accessToken: string;
  refreshToken: string;
}

interface ITrackState {
  artist: string;
  name: string;
  art: string;
  id: string;
}

// TODO:
// 1. api call for data analysis
//    a. will need to figure out how to sync recieved data with animation
// 2. pass data to spectrum component
//    a. decide if it needs to be cleaned up here or in spectrum or in some intermediate
export const Player: FC<{}> = () => {
  // Set initial states
  const setInitialTokenState: () => ITokenState = () => {
    return {
      accessToken: '',
      refreshToken: '',
    };
  };
  const setInitialSongState: () => ITrackState = () => {
    return {
      artist: '',
      name: '',
      id: '',
      art: '',
    };
  };

  // Hooks
  const [tokens, setTokens] = useState(setInitialTokenState());
  const [currentSong, setCurrentSong] = useState(setInitialSongState());

  // Spotify api instance
  const apiConfig: AxiosRequestConfig = {
    baseURL: spotifyBaseUrl,
  };
  let spotify: spotifyApi;

  // Update State
  const getTokens = () => {
    const params = getHashParams();
    if (params) {
      setTokens({
        accessToken: params.access_token,
        refreshToken: params.refresh_token,
      });
    }
  };

  // on player mount
  useEffect(() => {
    getTokens();
  }, []);

  // on accessToken update
  useEffect(() => {
    const setConfig = (token: string) => {
      apiConfig.headers = {
        Authorization: 'Bearer ' + token,
      };
      spotify = new spotifyApi(apiConfig);
    };
    // Get current song data
    const getCurrentSong = () => {
      spotify
        .getCurrent()
        .then((response) => {
          const playerData = response.data.item;
          setCurrentSong({
            artist: playerData.artists[0].name,
            name: playerData.name,
            art: playerData.album.images[0].url,
            id: playerData.id,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    setConfig(tokens.accessToken);
    getCurrentSong();
  }, [tokens.accessToken]);

  return (
    <div className='player_container'>
      <Preview currentSong={currentSong} />
      <Spectrum />
    </div>
  );
};
