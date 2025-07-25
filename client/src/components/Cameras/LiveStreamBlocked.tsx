// LiveStreamPlayer.js
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './Camera.css'

const LiveStreamBlocked = () => {


  return (
    <div className='video-blocked'>
     Video Unavaible.
    </div>
  );
};

export default LiveStreamBlocked;