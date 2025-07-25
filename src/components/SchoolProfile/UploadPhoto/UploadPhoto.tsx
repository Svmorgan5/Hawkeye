
import '../../../components/Members/Edit Members/EditMembers.css'
import addImage from '../../../assets/addimage.png'
import {useState, type ReactEventHandler} from 'react'
import { useInstitutionContext } from '../../../Context/InstitutionContext'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTokenContext } from '../../../Context/Context';



const UploadPhoto = () => {


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
                
        }
    
        );
        if (!response.ok){
              console.log('FormData contents:');
        for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
            throw new Error(`HTTP error! status: ${response.status}`)
                  
        }
        }


      
    const data = await response.json();  // parse JSON body
    console.log('Upload response:', data);
    if (fileType === 'logoFile') {
     
    institutionDispatch({ type: 'SET_INST_LOGO', payload: data.logo }); // replace with actual key
    }
    if (fileType === 'image1') {
    institutionDispatch({ type: 'SET_INST_IMAGE1', payload: data.image1 });
    }
    if (fileType === 'image2') {
    institutionDispatch({ type: 'SET_INST_IMAGE2', payload: data.image2 });
    }
   
     
    toast.success('New Images Succefully Added!')
   
        // const data = await result.json();
        // console.log(data);
    } catch(error){
        console.log(error);
        toast.warning(`Unable To Upload Files. ${error}`)
    }
    }
}



  return (
    <div className='body-add-inst'>
      
      
        <form className='add-inst-form' >
            
            <label className='add-profile-form-header' ><div className='header-text'>Create New Institution:</div></label>
            <div className='div-body'>   
                <div className='inst-label-wrapper'>
                            <div>Upload Logo:</div>
                            <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'logoFile')}></input></div>
                            <button  onClick={(e)=>{e.preventDefault(),handleUpload(`logo`,logoFile)}}>Upload Logo</button>
                </div>
                <div className='inst-label-wrapper'>
                            <div>Upload Map 1:</div>
                            <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'mapOneFile')}></input></div>
                            <button  onClick={(e)=>{e.preventDefault(),handleUpload(`image1`,mapOneFile)}}>Upload Map 1</button>
                </div>
                <div className='inst-label-wrapper'>
                            <div>Upload Map 2:</div>
                            <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'mapTwoFile')}></input></div>
                            <button  onClick={(e)=>{e.preventDefault(),handleUpload(`image2`,mapTwoFile)}}>Upload Map 2</button>
                </div>
            </div>
           

        </form>
    </div>
 
    
  );
};

export default UploadPhoto;


 
   
  //  logo
  // 
  // <br></br>
  //  map/image1
  //  <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'mapOneFile')}></input></div><br></br>
  //   <button  onClick={()=>handleUpload('image1',mapOneFile)}>Upload Map 1</button>
  //  map/images2
  //  <div><input type='file'  accept="image/*"  className='file' onChange={e=>handleFileChange(e,'mapTwoFile')}></input></div><br></br>
  //  <button  onClick={()=>handleUpload('image2',mapTwoFile)}>Upload Map 2</button>

  //   </div>

  
  
   
  