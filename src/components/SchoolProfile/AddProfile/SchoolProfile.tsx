import './SchoolProfile.css'
import addImage from '../../../assets/addimage.png'
import {useState, type ReactEventHandler} from 'react'
import { useInstitutionContext } from '../../../Context/InstitutionContext'

import axios from 'axios'
import { useTokenContext } from '../../../Context/Context';
const Profile = () => {
  const [busName,setBusName] = useState<string>('')
  const [address,setAddress] = useState<string>('')
  const [phone,setPhone] = useState<string>('')
  //temp - should be deleted

  const [logoFile, setLogoFile] = useState<File|null>(null)
  const [mapOneFile, setMapOneFile] = useState<File|null>(null)
  const [mapTwoFile, setMapTwoFile] = useState<File|null>(null)
  const [isSchool,setIsSchool] = useState<boolean>(true)
  const {token, user_institution_id, user_id} = useTokenContext()
  const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext();
  



  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>,fileType:string) =>{
  if(e.target.files){
    if(fileType==='logoFile')  
      setLogoFile(e.target.files[0])
    if(fileType==='mapOneFile')  
      setMapOneFile(e.target.files[0])
    if(fileType==='mapTwoFile')  
      setMapTwoFile(e.target.files[0])
  }
  }
  const handleUpload = async (fileType:string,file:File|null) => {
    
    if(file){
        console.log('Uploading file...');

        const formData =new FormData();
        formData.append('file',file);
        formData.append('field_name',fileType)
       

        try{
            const response = await fetch(`http://localhost:5000/institutions/${instId}/upload-image`,{
                method:'POST',
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
    alert('New Images Succefully Added!')
   
        // const data = await result.json();
        // console.log(data);
    } catch(error){
        console.log(error);
        alert(`Unable To Upload Files. ${error}`)
    }
    }
}
  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
 
    try {
      await axios.post("http://127.0.0.1:5000/institutions/", {
        // id:instId,
        name: busName,
        is_school: isSchool,
        address: `${address}`,
        phone: `${phone}`,
        
        
      },{
        headers:{
          'Authorization':  `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
       
      });
        alert('New Institution Added');
        setBusName('');
        setIsSchool(false);
        setAddress('');
        setPhone('');
       
    } catch (error: any) {
         if (error.response) {
        // Server responded with a status outside 2xx
        console.error('Error Status:', error.response.status);
        console.error('Error Status Text:', error.response.statusText);
        console.error('Error Data:', error.response.data);

        alert(`Could not add new Institution: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        alert('Could not reach server. Please try again.');
      } else {
        // Other errors (e.g., setup issues)
        console.error('Error setting up request:', error.message);
        alert(`Unexpected error: ${error.message}`);
      }
    }
        
  };
 



  return (
    <div>
    <form onSubmit={handleSubmit}>
 
   Name of school
   <input 
    type="text"
    value={busName}
    onChange={(e)=>setBusName(e.target.value)}/><br></br>
   address
   <input 
    type="text"
    value={address}
    onChange={(e)=>setAddress(e.target.value)}/><br></br>
   phone number
   <input 
    type="text"
    value={phone}
    onChange={(e)=>setPhone(e.target.value)}/><br></br>
    <input
    type='submit'
    value='submit'
    />
     </form>
   logo
   <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'logoFile')}></input></div>
  <button  onClick={()=>handleUpload('logo',logoFile)}>Upload Logo</button>
  <br></br>
   map/image1
   <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'mapOneFile')}></input></div><br></br>
    <button  onClick={()=>handleUpload('image1',mapOneFile)}>Upload Map 1</button>
   map/images2
   <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'mapTwoFile')}></input></div><br></br>
   <button  onClick={()=>handleUpload('image2',mapTwoFile)}>Upload Map 2</button>

    </div>
  );
};

export default Profile;