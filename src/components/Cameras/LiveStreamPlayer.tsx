import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const LiveStreamPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamUrl = "https://ireplay.tv/test/blender.m3u8";

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js error:', data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default LiveStreamPlayer;