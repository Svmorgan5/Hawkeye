// LiveStreamPlayer.js
import React, {useEffect, useRef } from 'react'
import Hls from 'hls.js'
import './LiveStreamPlayer.css'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

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
    // Basic PTZ capability for when we have cameras to test
    // <TransformWrapper
    //   initialScale={1}
    //   initialPositionX={200}
    //   initialPositionY={100}>
    //   {({zoomIn,zoomOut,resetTransform,...reset})=> (
    //     <React.Fragment>
    //       <div className='tools'>
    //         <button onClick={()=>zoomIn}>+</button>
    //         <button onClick={()=>zoomOut}>+</button>
    //         <button onClick={()=>resetTransform}>Reset</button>
    //       </div>
        
    //      <TransformComponent>
          <video
            ref={videoRef}
            controls
            muted
            autoPlay
            className='video-player'
          />
    //   </TransformComponent>
    //   </React.Fragment>

    //   )}
     
    // </TransformWrapper>
      
  )
}
 
export default LiveStreamPlayer;


