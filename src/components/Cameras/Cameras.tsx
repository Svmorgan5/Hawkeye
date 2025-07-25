import '../../UnderConstruction.css'
import CameraCard from './CameraCard'
import './Camera.css'
import {useEffect, useState } from 'react'
import axios from 'axios'


type Camera = {
  id:number,
  stream_url: string,
  location:string,
  name:string

}

const Cameras = () => {

  const [cameras, setCameras] = useState<Camera[]>([])
  const token=sessionStorage.getItem('jwtToken_key')
  const [search,setSearch] = useState<string>('')
  useEffect(()=> {
    const getCameras = async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/cameras/", {
        headers:{
          'Authorization': `Bearer ${token}`
        }
        
      });
      const filteredCameras:Camera[]= response.data.filter((myCamera:Camera)=>
        myCamera.location.toLowerCase().includes(search.toLowerCase()))
   
   
      setCameras(filteredCameras)
      
    
      
    } catch (error:any){
    console.log({token})
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };

  getCameras()
  },[search]);

  return (
    <div className="main-camera-page">
      <div className='camera-header-top'>
            <div className='breadcrumb'>Cameras</div>
   <div className='camera-search-table-cell'>
                <input type='text' placeholder='Search cameras' className='camera-search'  value={search} onChange={(e)=>setSearch(e.target.value)}></input>
                <button className='camera-search-cancel' onClick={()=>setSearch('')}>Clear Search</button>
                
                   <a href="/addcamera"><input type='button' className='camera-add' value='+ Add Camera' ></input></a>
          </div>
        
          </div>
    <div className='camera-cards-page'>
               <div className='camera-cards-holder'>
      {cameras.map((camera)=>
         
              
            <div className='camera-cards-element'> <CameraCard URL={camera.stream_url} location={camera.location} status={false} name={camera.location} /></div>
          
             
      )
      
      }
      </div>
        </div>
         
     
 
    </div>
  );
};

export default Cameras;