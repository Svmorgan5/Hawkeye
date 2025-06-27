
import './MemberList.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


const MemberList = () => {

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
                body:formData,
            
                
            
        });
   
    const data = await response.json();  // parse JSON body
    console.log('Upload response:', data);
    alert('New Members Succefully Added File!')
    navigate('/members');
        // const data = await result.json();
        // console.log(data);
    } catch(error){
        console.log(error);
        alert(`Unable To Upload Files. ${error}`)
    }
    }
}
 
  
  return (
    
   
      
      
        <div className='new-member-form' >
            
            <label className='form-header' ><div className='header-text'>Add Member</div></label>
            <div className='div-body'>   
                Upload File (.csv or .rtf): 
                <input type='file' className='file' onChange={handleFileChange}></input>
                
            </div>  

            <div className='form-footer'>
                <a href='/members'>
                <input
                    type="button"
                    className='cancel-button'
                    value="Cancel" />
                 
                </a>
               
                <button
                    className='upload-button'
                    onClick={handleUpload}>Upload File</button>

            </div>

        </div>
    
    
  )
};

export default MemberList