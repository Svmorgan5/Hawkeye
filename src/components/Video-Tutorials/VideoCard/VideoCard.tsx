
import './VideoCard.css'
import {useState} from 'react'
type VideoCardProps ={
    heading:string,
    message:string,
    picture?:string,
    
}
const VideoCard = ({heading, message, picture}:VideoCardProps) => {
    

  



  return (
    <>
    
         
            
          
        
          
       
          <div className='video-card-body'>
                <img   src={picture}></img>
          <p className='video-card-body-title'>{heading}</p>
                       
                    
                   
                        
             <p className='video-card-text'>{message}</p>
        </div>
       
        
 
  </>

  


  );
};

export default VideoCard;