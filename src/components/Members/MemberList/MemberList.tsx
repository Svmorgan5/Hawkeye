
import './MemberList.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {toast} from 'react-toastify'



const MemberList = () => {
const token = sessionStorage.getItem('jwtToken_key')
const navigate = useNavigate();
const [file,setFile] = useState<File|null>(null)
  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    if(e.target.files){
        setFile(e.target.files[0])
    }
  }

const handleUpload = async () => {
    
    if(file){
        console.log('Uploading file...');

        const formData =new FormData();
        formData.append('file',file);

        try{
            const response = await fetch('http://localhost:5000/members/upload',{
                method:'POST',
                 headers:{
                    'Authorization':  `Bearer ${token}`,
                 
                },
                body:formData,
            
                
            
        });
   
    const data = await response.json();  // parse JSON body
    console.log('Upload response:', data);
    toast.success('New Members Succefully Added File!')
    navigate('/members');
        // const data = await result.json();
        // console.log(data);
    } catch(error){
        console.log(error);
        toast.warning(`Unable To Upload Files. ${error}`)
    }
    }
}
 
  
  return (
    
   
      
      
        <div className='new-member-form-memberlist' >
            
            <label className='form-header-memberlist' ><div className='header-text'>Import File</div></label>
            <div className='div-body-memberlist'>   
                <div className='upload'>Upload File (.csv or .rtf): </div>
                <div><input type='file' className='file' onChange={handleFileChange}></input></div>
                
            </div>  

            <div className='form-footer-memberlist'>
                <div>
                <a href='/members'>
                <input
                    type="button"
                    className='cancel-button-memberlist'
                    value="Cancel" />
                 
                </a>
               </div>
               <div>
                <button
                    className='upload-button-memberlist'
                    onClick={handleUpload}>Import</button>
                </div>

            </div>

        </div>
    
    
  )
};

export default MemberList