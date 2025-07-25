import './SchoolProfile.css'
import '../../../components/Members/Edit Members/EditMembers.css'
import addImage from '../../../assets/addimage.png'
import {useState, useEffect, type ReactEventHandler} from 'react'
import { useInstitutionContext } from '../../../Context/InstitutionContext'
import {toast} from 'react-toastify';

import axios from 'axios';
import { useTokenContext } from '../../../Context/Context';
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate();

  useEffect(()=>{
    if(instId)
      navigate('/uploadphoto')
  },[instId])

 
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
        toast.success('New Institution Added');
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

        toast.warning(`Could not add new Institution: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        toast.warning('Could not reach server. Please try again.');
      } else {
        // Other errors (e.g., setup issues)
        console.error('Error setting up request:', error.message);
        toast.warning(`Unexpected error: ${error.message}`);
      }
    }
        
  };
 



  return (
    <div className='body-add-inst'>
      
      
        <form className='add-inst-form' onSubmit={handleSubmit}>
            <label className='add-profile-form-header' ><div className='header-text'>Create New Institution:</div></label>
            <div className='div-body'>   
                <div className='inst-label-wrapper'>
                <div>Name of school:</div>
                <div className='text-wrapper'>
                <input 
                className='body-text name-box-editmembers'
                  type="text"
                  value={busName}
                  onChange={(e)=>setBusName(e.target.value)}/>
                  </div>
                </div>
                
                <div className='inst-label-wrapper'>
                <div>Address:</div>
                  <div className='text-wrapper'>
                    <input 
                    className='body-text name-box-editmembers'
                      type="text"
                      value={address}
                      onChange={(e)=>setAddress(e.target.value)}/>
                  </div>
                </div>
                <div className='inst-label-wrapper'>
               
                Phone number

                  <input 
                  className='body-text name-box-editmembers'
                    type="text"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}/>

                </div>
              
                 
                <div className='inst-label-wrapper bottom-label'>
               
            </div>
            <div className='add-profile-form-footer'>
                <a href='/newinstprofile'>
                <input
                    type="button"
                    className='cancel-button'
                    value="Cancel">
                    </input>
                </a>
                <input
                    type="submit"
                    className='save-button'
                    onClick={()=>handleSubmit}
                    value="Save">

                    </input>

            </div>
            </div>
        </form>
    
    </div>
    
  );
};

export default Profile;


 
   
  

  
  
   
  //  logo
  //  <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'logoFile')}></input></div>
  // <button  onClick={()=>handleUpload('logo',logoFile)}>Upload Logo</button>
  // <br></br>
  //  map/image1
  //  <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'mapOneFile')}></input></div><br></br>
  //   <button  onClick={()=>handleUpload('image1',mapOneFile)}>Upload Map 1</button>
  //  map/images2
  //  <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'mapTwoFile')}></input></div><br></br>
  //  <button  onClick={()=>handleUpload('image2',mapTwoFile)}>Upload Map 2</button>

  //   </div>