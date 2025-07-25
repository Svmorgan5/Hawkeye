


import { useState } from 'react'
import { useNavigate, useParams} from 'react-router-dom';
import axios from 'axios'
import {toast} from 'react-toastify'



const UploadImage = () => {
const { memberId } = useParams<{memberId:string}>()
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
        formData.append('image',file);

        try{
            const response = await fetch(`http://localhost:5000/members/${memberId}`,{
                method:'PUT',
                body:formData,
                 headers:{
                    'Authorization':  `Bearer ${token}`
                  
                },  
        });
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
   
    const data = await response.json();  // parse JSON body
    console.log('Upload response:', data);
    toast.success('New Images Succefully Added!')
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
                <div><input type='file'  accept="image/*"  className='file' onChange={handleFileChange}></input></div>
                
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
                    onClick={handleUpload}>Upload Image</button>
                </div>

            </div>

        </div>
    
    
  )
};

export default UploadImage