import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from './api';

type artists = {
  name: string;
};
export type image = {
  height: number;
  width: number;
  url: string;
};
type album = {
  name: string;
  images: image[];
};
interface IPlayerResp {
  item: {
    album: album;
    artists: artists[];
    name: string;
    id: string;
  };
}
export default class spotifyApi extends api {
  constructor(config: AxiosRequestConfig) {
    super(config);
    this.getCurrent = this.getCurrent.bind(this);
  }

  getCurrent(): Promise<AxiosResponse<IPlayerResp>> {
    const url = '/me/player/currently-playing';
    try {
      return this.get<IPlayerResp>(url);
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  }
}
