export type image = {
  height: number;
  width: number;
  url: string;
};

export type artists = {
  name: string;
};

export type album = {
  name: string;
  images: image[];
};

export interface IPlayerResp {
  item: {
    album: album;
    artists: artists[];
    name: string;
    id: string;
    duration_ms: number;
  };
  progress_ms: number;
}

export interface IAudioFeatures {
  duration_ms: number;
  time_signature: number;
}

export interface IAudioAnalysis {
  bars: timeInterval[];
  beats: timeInterval[];
  sections: section[];
  segments: segment[];
  tatums: timeInterval[];
}

export type timeInterval = {
  start: number;
  duration: number;
  confidence: number;
};

export type segment = {
  start: number;
  duration: number;
  confidence: number;
  loudnessStart: number;
  loudnessMax: number;
  loudnessMaxTime: number;
  loudnessEnd: number;
  pitches: number[];
  timbre: number[];
};

export type section = {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempoConfidence: number;
  key: number;
  keyConfidence: number;
  mode: number;
  modeConfidence: number;
  timeSignature: number;
  timeSignatureConfidence: number;
};

export interface ITokenResp {
  access_token: string;
}
