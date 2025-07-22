import Addphoto from '../../../assets/AddPhoto.png'
import { useState, useEffect } from "react"
import axios from "axios"
import NewInstBlank from "../NewInstBlank/NewInstBlank"
import { useInstitutionContext } from "../../../Context/InstitutionContext"
import './DisplayProfiles.css'
import UploadPhoto from '../UploadPhoto/UploadPhoto'
import { useNavigate } from 'react-router-dom'
type Institution = {
    id: number;
    name: string;
    image: string;
    address:string;
    phone:string;
}




const DisplayProfile:React.FC = () =>{
   const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext();
    const token = sessionStorage.getItem('jwtToken_key')
    const navigate= useNavigate();
    const uploadPhoto =(type:string)=>{
        console.log('testlogo')
        return(
            
            navigate('/uploadphoto')
        )
    }
    return(
        <>
 {(instId!>0)?
    (<div className="main-camera-page">
      <div className='camera-header-top'>
            <div className='breadcrumb'>Cameras</div>
            <div className='camera-search-table-cell'>
            <input type='text' placeholder='Search cameras' className='camera-search'  onChange={(e)=>setSearch(e.target.value)}></input>
            <button className='camera-search-cancel' >Clear Search</button>
            <a href="/addcamera"><input type='button' className='camera-add' value='+ Add Camera' ></input></a>
            </div>
            
           
        
        </div>
      
         
      <div className='display-inst-body'>
                
                <div className='display-inst-top'>
                    <div className='display-profile-logo'>
                    {instLogo?
                    (<><img className='display-profile-logo-image' src={instLogo} /></>)
                    :
                    (<><img className='display-profile-logo-image' style={{cursor:'pointer'}} src={Addphoto} onClick={()=>uploadPhoto('logo')}/></>)
                    }
                    
                    </div>
                    <div className='display-inst-top-schoolname'>{instName}</div>
                </div>
                <div className='display-inst-middle'>
                    <div className='display-inst-body-middle-left'>
                       {instImage1?
                       <img className='display-inst-map1' src={instImage1}></img>:
                       <img className='display-inst-map1' src={Addphoto} style={{cursor:'pointer'}} onClick={()=>uploadPhoto('logo')}></img>}
                    </div>
                    <div className='display-inst-body-middle-right'>
                       
                       <div className='display-inst-map2-container'>
                        {instImage2?<img src={instImage2} className='display-inst-map2'></img>:
                        <img src={Addphoto} className='display-inst-map2' style={{cursor:'pointer'}} onClick={()=>uploadPhoto('logo')}></img>
                        }
                        
                        </div>
                       <p>Address:</p>
                       <p>{instAddress} </p>
                    </div>
                </div>
                <div className='display-inst-body-bottom'>
                   <p className='display-inst-body-bottom-title'>Administrators:</p> 
                </div>



            </div>
 
    </div>):
    (<NewInstBlank />)
    }

        {/* <div className='inst_display_page_logo'>
        {instLogo?(<img style={{width:'80px',height:'auto'}} src={instLogo}></img>):('No image')}<br></br>
       </div>
       <div>
       <p  className='inst_display_page_name'> {instName}</p>

       </div>
       
       <div >
        {instImage1?(<img  className='map1-display' src={instImage1}></img>):('No image')}<br></br>
        </div>
        Address:
        {instAddress}<br></br>
        Phone:
        {instPhone}<br></br>
        
        Map 2:
        {instImage2?(<img style={{width:'80px',height:'auto'}} src={instImage2}></img>):('No image')}<br></br> */}
        </>
    )
}
export default DisplayProfile
