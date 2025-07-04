// LiveStreamPlayer.js
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

type LiveProps = {
  URL:string
  status: boolean,
  location:string
}

const LiveStreamPlayer = (liveProps:LiveProps) => {
  const videoRef = useRef(null);
  const streamUrl = `${liveProps.URL}`; // Replace with your live HLS URL

  
console.log('HLS supported:', Hls.isSupported());
  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    } else {
      console.error('This browser does not support HLS');
    }
  }, [streamUrl]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        muted
        style={{ width: '100%', maxWidth: '800px' }}
      />
    </div>
  );
};

export default LiveStreamPlayer;