
import axios from 'axios'
import '../../../assets/member.png'
import './AddCamera.css'

import {toast} from 'react-toastify'
import { useEffect, useState} from 'react'


type Camera = {
    id:any,
    URL:string,
    location:string,
}


       

const AddCamera = () => {


const [URL,setURL] = useState<string>('')
const token= sessionStorage.getItem('jwtToken_key')
const [location,setLocation] = useState<string>('')
const [name,setName] = useState<string>('')


  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
       
    try {
      await axios.post("http://127.0.0.1:5000/cameras/", {
          stream_url:`${URL}`,
          location:`${location}`,
          name:`${name}`
     
     
         
      
      },{
        headers:{
        'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
       
      });
       toast.success('New Camera Added');
       
        setURL('');
        setLocation('');
       
    } catch (error: any) {
            if (error.response?.data?.errors) {
                toast.warning(`Could not add new camera. Please check that all information was inputted correctly: ${JSON.stringify(error.response.data.errors)}`);
            } else {
                toast.warning(`Could not add new camera. Please check that all information was inputted correctly: ${error.message}`);
            }
            console.error('Error details:', error.response?.data || error.message);
            
    }
    // Log and extract JWT token from response
    
  };
 
  
  
  
  
  return (
    
    <div className='body-add-camera'>
      
      
        <form className='new-camera-form' onSubmit={handleSubmit}>
            <label className='camera-form-header' ><div className='header-text'>Add Camera</div></label>
            <div className='div-body'>   
              
                <div className='camera-label-wrapper '>
              
                    Name
                    <input type='text'  className='body-text message-box-addalerts'value={name} onChange={(e)=>setName(e.target.value)}></input>
                </div>
               <div className='camera-label-wrapper '>
              
                    URL
                    <input type='text'  className='body-text message-box-addalerts'value={URL} onChange={(e)=>setURL(e.target.value)}></input>
                </div>
                <div className='camera-label-wrapper '>
                Location:
                <input type='text' className='body-text location-box-addalerts' value={location} onChange={(e)=>setLocation(e.target.value)}></input>
                </div>
            </div>
            <div className='camera-form-footer'>
                <a href='/cameras'>
                <input
                    type="button"
                    className='cancel-button'
                    value="Cancel">
                    </input>
                </a>
                <input
                    type="submit"
                    className='save-button'
                    value="Save">
                    </input>

            </div>
        
        </form>
    
    </div>
  );
};

export default AddCamera




