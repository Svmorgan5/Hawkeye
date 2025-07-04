
import axios from 'axios'
import '../../../assets/member.png'
import './AddCamera.css'

import { useEffect, useState} from 'react'


type Camera = {
    id:any,
    URL:string,
    location:string,
}


       

const AddCamera = () => {


const [URL,setURL] = useState<string>('')
const [location,setLocation] = useState<string>('')


  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
       
    try {
      await axios.post("http://127.0.0.1:5000/cameras/", {
          stream_url:`${URL}`,
          location:`${location}`,
     
     
         
      
      },{
        headers:{
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2ODIyMTUsImlhdCI6MTc1MTYzOTAxNSwic3ViIjoiMSJ9.C0vmsC7QpiZvOR6uYl8hGLvZX-A639HARNAwiChOzeM`,
          'Content-Type': 'application/json'
        }
       
      });
       alert('New Camera Added');
       
        setURL('');
        setLocation('');
       
    } catch (error: any) {
            if (error.response?.data?.errors) {
                alert(`Could not add new camera: ${JSON.stringify(error.response.data.errors)}`);
            } else {
                alert(`Could not add new camera: ${error.message}`);
            }
            console.error('Error details:', error.response?.data || error.message);
            
    }
    // Log and extract JWT token from response
    
  };
 
  
  
  
  
  return (
    
    <div className='body-addmembers'>
      
      
        <form className='new-member-form' onSubmit={handleSubmit}>
            <label className='form-header' ><div className='header-text'>Add Camera</div></label>
            <div className='div-body'>   
              
               <div className='label-wrapper '>
              
                    URL
                    <input type='text'  className='body-text message-box-addalerts'value={URL} onChange={(e)=>setURL(e.target.value)}></input>
                </div>
                <div className='label-wrapper '>
                Location:
                <input type='text' className='body-text location-box-addalerts' value={location} onChange={(e)=>setLocation(e.target.value)}></input>
                </div>
            </div>
            <div className='form-footer'>
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




