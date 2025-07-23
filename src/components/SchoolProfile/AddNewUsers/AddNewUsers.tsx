
import addImage from '../../../assets/addimage.png'
import {useState, type ReactEventHandler} from 'react'
import { useInstitutionContext } from '../../../Context/InstitutionContext'
import {toast} from 'react-toastify'
import './AddNewUsers.css'
import axios from 'axios'
import { useTokenContext } from '../../../Context/Context';
import { useNavigate } from 'react-router-dom'
const AddNewUsers = () => {
  
  //temp - should be deleted
const [name,setName] =useState<string>('')
const [phone,setPhone] = useState<string>('')
const [email,setEmail] = useState<string>('')
const [role,setRole] = useState<string>('')
const navigate = useNavigate()
  
  const {token, user_institution_id, user_id} = useTokenContext()
  const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext();
  



//   const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>,fileType:string) =>{
//   if(e.target.files){
//     if(fileType==='logoFile')  
//       setLogoFile(e.target.files[0])
//     if(fileType==='mapOneFile')  
//       setMapOneFile(e.target.files[0])
//     if(fileType==='mapTwoFile')  
//       setMapTwoFile(e.target.files[0])
//   }
//   }
//   const handleUpload = async (fileType:string,file:File|null) => {
    
//     if(file){
//         console.log('Uploading file...');

//         const formData =new FormData();
//         formData.append('file',file);
//         formData.append('field_name',fileType)
       

//         try{
//             const response = await fetch(`http://localhost:5000/institutions/${instId}/upload-image`,{
//                 method:'POST',
//                 body:formData,
//                  headers:{
//                     'Authorization':  `Bearer ${token}`
                  
//                 },  
//         });
//         if (!response.ok){
//             throw new Error(`HTTP error! status: ${response.status}`)
//         }
   
//     const data = await response.json();  // parse JSON body
//     console.log('Upload response:', data);
//     alert('New Images Succefully Added!')
   
//         // const data = await result.json();
//         // console.log(data);
//     } catch(error){
//         console.log(error);
//         alert(`Unable To Upload Files. ${error}`)
//     }
//     }
// }
  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
 
    try {
      await axios.post(`http://127.0.0.1:5000/institutions/${instId}/invite_user`, {
        // id:instId,
        name: `${name}` ,
        phone: `${phone}`,
        email: `${email}`,
        role: `${role}`,
        
        
      },{
        headers:{
          'Authorization':  `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
       
      });
        toast.success('New Institution Added');
        setName('');
        setPhone('');
        setEmail('');
        setRole('');
        navigate('/displayprofile')
       
    } catch (error: any) {
         if (error.response) {
        // Server responded with a status outside 2xx
        console.error('Error Status:', error.response.status);
        console.error('Error Status Text:', error.response.statusText);
        console.error('Error Data:', error.response.data);
navigate('/displayprofile')
        toast.warning(`Could not add new Institution: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        toast.warning('Could not reach server. Please try again.');
        navigate('/displayprofile')
      } else {
        // Other errors (e.g., setup issues)
        console.error('Error setting up request:', error.message);
        toast.warning(`Unexpected error: ${error.message}`);
        navigate('/displayprofile')
      }
    }
        
  };
 



  return (
    <div className='body-addusers'>
      
      
        <form className='new-users-form' onSubmit={handleSubmit}>
            <label className='form-header' ><div className='header-text'>Add Administrator Information:</div></label>
            <div className='div-body'>   
                <div className='label-wrapper-newuser'>
                <div>Name:</div> 
                <div><input className='body-text ' type='text' value={name} onChange={(e)=>setName(e.target.value)}></input>
                </div>
                </div>

                <div className='label-wrapper-newuser'>
                Role:
                <select className='body-select ' value={role} onChange={(e)=>setRole(e.target.value)}>
                <option value='Teacher' >Admin Primary</option>
                <option value='Principal'>Admin</option>
                <option value='Office Staff'>Account Payable</option>
                <option value='Kitchen Staff'>Teacher</option>
                <option value='Kitchen Staff'>Employee</option>
                <option value='Kitchen Staff'>Security Gaurd</option>
                <option value='Kitchen Staff'>SRO</option>
                </select>

                </div>


                <div className='label-wrapper-newuser'>
                <div>Email Address:</div>
                <div><input type='email'  className='body-text 'value={email} onChange={(e)=>setEmail(e.target.value)}></input></div>
                </div>
  <div className='label-wrapper-newuser'>
                <div>Phone Number:</div>
              <div><input className='body-select ' type='text' value={phone} onChange={(e)=>setPhone(e.target.value)}></input><br></br></div> 
              
              
                </div>
            <div className='form-footer'>
                <a href='/members'>
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
            </div>
        </form>
    
    </div>
   
  );
};

export default AddNewUsers; 


    
      

 

   

  
 



