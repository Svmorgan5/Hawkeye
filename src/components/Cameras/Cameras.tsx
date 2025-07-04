import '../../UnderConstruction.css'
import CameraCard from './CameraCard'
import './Camera.css'
import {useEffect, useState } from 'react'
import axios from 'axios'

type Camera = {
  id:number,
  stream_url: string,
  name:string
}

const Cameras = () => {

  const [cameras, setCameras] = useState<Camera[]>([])
  useEffect(()=> {
    const getCameras = async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/cameras/", {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2ODIyMTUsImlhdCI6MTc1MTYzOTAxNSwic3ViIjoiMSJ9.C0vmsC7QpiZvOR6uYl8hGLvZX-A639HARNAwiChOzeM`
        }
        
      });
      console.log(response.data)
      setCameras(response.data)
      
    
      
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };

  getCameras()
  },[]);

  return (
    <div className="main-camera-page">
      <div className='camera-header-top'>
            <div className='breadcrumb'>Cameras</div>
   <div className='camera-search-table-cell'>
                <input type='text' placeholder='Search cameras' className='camera-search'  value='change to search'></input>
                <button className='camera-search-cancel'>Clear Search</button>
                
                   <a href="/addcamera"><input type='button' className='camera-add' value='+ Add Camera' ></input></a>
          </div>
        
          </div>
    
      {cameras.map((camera)=>
           <div className='camera-cards-page'>
             <div className='camera-cards-holder'>
              
            <div className='camera-cards-element'>{camera.stream_url} <CameraCard URL={camera.stream_url} location="hello" status={false} /></div>
          
           <div className='camera-cards-element'>{camera.stream_url} <CameraCard URL=' https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location="hello" status={false} /></div>
          
          
          
         


             </div>
           </div>
      )
      
      }
     
 
    </div>
  );
};

export default Cameras;