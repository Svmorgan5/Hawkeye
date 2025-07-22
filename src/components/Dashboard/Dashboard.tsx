import '../../UnderConstruction.css'
import './Dashboard.css'
import DashCard from './DashCard';
import bars from '../../assets/bars.png'
import settings from  '../../assets/setting.png'
import members from '../../assets/members.png'
import Training from '../../assets/training.png'
import Alert from '../../assets/alert.png'
import Camera1 from '../../assets/Camera1.png'
import Avatar1 from '../../assets/Avatar1.png'
import Avatar2 from '../../assets/Avatar2.png'
import Avatar3 from '../../assets/Avatar3.png'
import Avatar4 from '../../assets/Avatar4.png'
import Avatar from '../../assets/Avatar.png'
import Avatar5 from '../../assets/Avatar5.png'
import { useNavigate } from 'react-router-dom';
import { useTokenContext } from '../../Context/Context';
import { useEffect } from 'react';
import axios from 'axios';
import { useInstitutionContext } from '../../Context/InstitutionContext';




const Dashboard = () => {
  const navigate = useNavigate();
  const {token, user_id, user_name, user_institution_id, user_image, dispatch:tokenDispatch} = useTokenContext();
  const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext();
  useEffect(()=>{
    {!token &&(navigate('/'))}
  },[token])
  useEffect(()=>{
      
        const getInstitution = async() =>
        {
          if(instId)
            return;
            try {
              const response = await axios.get("http://127.0.0.1:5000/institutions/", {
              headers: {
              'Authorization': `Bearer ${token}`
                      }
                })
        
        institutionDispatch({type:"SET_INST_ID",payload:response.data.id});
        institutionDispatch({type:"SET_INST_NAME",payload:response.data.name})
        institutionDispatch({type:"SET_IS_SCHOOL",payload:response.data.is_school})
        institutionDispatch({type:"SET_INST_ADDRESS",payload:response.data.address})
        institutionDispatch({type:"SET_INST_PHONE",payload:response.data.phone})
        institutionDispatch({type:"SET_INST_LOGO",payload:response.data.logo})
        institutionDispatch({type:"SET_INST_IMAGE1",payload:response.data.image1})
        institutionDispatch({type:"SET_INST_IMAGE2",payload:response.data.image2})
       
        //tokenDispatch({type:"SET_USER_NAME"})
      
        } catch (error: any) {
        console.error('Error message:', error.message);
        }

    
       
    }
      getInstitution();
    },[]);
  
  const navigateToCameras = () => {
    console.log('test cameras')
    navigate('/cameras')
  }
   console.log('user name:',user_name)
  return (

    <>
    <p className='breadcrumb'>Dashboard</p>
     <p className='dashboard-head' > 
        Welcome, {user_name}</p>
    <div className="card-container">
        <div className='dash-board-dash-card'><DashCard  heading='Alerts' message='Lorem ipsum odor amet, consectetuer adipiscing elit.' picture={Alert} link='/alerts' /></div>
        <div className='dash-board-dash-card'><DashCard heading='Reports' message='Lorem ipsum odor amet, consectetuer adipiscing elit. ' picture={bars} link='/reports'/></div>
        <div className='dash-board-dash-card'><DashCard heading='Lockdowns' message='Lorem ipsum odor amet, consectetuer adipiscing elit. ' picture={bars} /></div>
   
        <div className='dash-board-dash-card'><DashCard heading='Members' message='Lorem ipsum odor amet, consectetuer adipiscing elit.'  picture={members} link='/members' /></div>
        <div className='dash-board-dash-card'><DashCard heading='Training' message='Lorem ipsum odor amet, consectetuer adipiscing elit.' picture={Training} link='/video'/></div>
        <div className='dash-board-dash-card'><DashCard heading='Settings' message='Lorem ipsum odor amet, consectetuer adipiscing elit.' picture={settings} /></div>
     
    </div>
    <div className='cameras'>
      <img className='camera-frame' src={Camera1}></img>
      <img className='camera-frame' src={Avatar}></img>
      <img className='camera-frame' src={Avatar1}></img>
      <img className='camera-frame' src={Avatar2}></img>
      <img className='camera-frame' src={Avatar3}></img>
      <img className='camera-frame' src={Avatar4}></img>
      <img className='camera-frame' src={Avatar5}></img>
   
    </div>
    <div className='camera-button-holder'>
    <button className='camera-button' onClick={navigateToCameras}>View all cameras</button> 
    </div>
  </>


  );
};

export default Dashboard;