// LiveStreamPlayer.js
import {useEffect, useRef } from 'react'
import Hls from 'hls.js'
import './LiveStreamPlayer.css'

type LiveProps = {
  URL:string
  status: boolean,
  location:string,
  name:string
}


const LiveStreamPlayer = ({URL, status,location,name}:LiveProps) => {
 
 
  const videoRef= useRef<HTMLVideoElement|null>(null);
  useEffect(()=>{
     
    const video= videoRef.current;
    const hls= new Hls();
    if(!video || !URL )
      return;
    if(video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src=URL;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      })
    } else if(Hls.isSupported()){
      
      hls.loadSource(URL);
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED,()=>{
         video.play();
      })
     
    }

    return () =>{
      if (hls) {
        hls.destroy();
      }
    }
  },[URL]);

  return (
    <video
      ref={videoRef}
      controls
      muted
      autoPlay
      className='video-player'
      
    />
      
  )
}
 
export default LiveStreamPlayer;


