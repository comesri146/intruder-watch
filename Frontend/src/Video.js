import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const RTSPVideoPlayer = () => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);

  const rtspURL = `rtsp://${host}:${port}/path/to/your/video`;

  const handleLoadVideo = () => {
    if (host && port) {
      setVideoLoaded(true);
    }
  };

  return (
    <div>
      <h2>Load RTSP Video</h2>
      <div>
        <label>Host: </label>
        <input type="text" value={host} onChange={(e) => setHost(e.target.value)} />
      </div>
      <div>
        <label>Port: </label>
        <input type="text" value={port} onChange={(e) => setPort(e.target.value)} />
      </div>
      <button onClick={handleLoadVideo}>Load Video</button>
      {videoLoaded && (
        <div>
          <h3>Video Player</h3>
          <ReactPlayer url={rtspURL} controls={true} playing={true} />
        </div>
      )}
    </div>
  );
};

export default RTSPVideoPlayer;
