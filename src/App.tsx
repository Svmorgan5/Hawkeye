import './App.css';
import Register from './components/Register/Register'
import SignIn from './components/Register/SignIn'
import TheSignUp from './pages/TheSignUp/TheSignUp';
import Dashboard from './components/Dashboard/Dashboard'
import NavBar from './components/NavBar/NavBar';
import {Routes, Route} from 'react-router-dom'
import './index.css'
import Cameras from './components/Cameras/Cameras';
import Alerts from './components/Alerts/Alerts';
import Reports from './components/Reports/Reports';
import Members from './components/Members/Member/Members';
import Help from './components/Help/Help';
import Header from './Header/Header';
import Landing from './pages/LandingPage/Landing'
import Video from './components/Video-Tutorials/Video';
import History from './components/History/History'
import Content from './components/Content/Content'
import AddMembers from './components/Members/AddMember/AddMember';
import Drills from './components/Drills/Drills'
import Integration from './components/Intergration/Integration';
import Billing from './components/Billing/Billing';
import Profile from './components/SchoolProfile/AddProfile/SchoolProfile';
import EditMembers from './components/Members/Edit Members/EditMembers';
import { useParams,useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PreAddMember from './components/Members/PreAddMember/PreAddMember';
import MemberList from './components/Members/MemberList/MemberList';
import AddAlert from './components/Alerts/AddAlerts/AddAlert';
import AddCamera from './components/Cameras/AddCamera/AddCamera';
import NewCameraBlank from './components/Cameras/AddCamera/NewCameraBlank.tsx/NewCameraBlank';
import LandingPage from './components/Register/LandingPage/LandingPage';
import { TokenProvider, useTokenContext } from './Context/Context';
import AddBus from './components/Register/AddBus';
import Messages from './components/Messages/Messages';
import UploadImage from './components/Members/UpoloadImage/UploadImage';
import DisplayProfile from './components/SchoolProfile/DisplayProfile/DisplayProfile';
import AddNewUsers from './components/SchoolProfile/AddNewUsers/AddNewUsers';
import AcceptInvite from './components/Register/AcceptInvite/AcceptInvite';
import { Socket } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import JoinSocket from './components/Socket/JoinSocket';
import LoadAllContext from './Context/LoadAllContext';
import UploadPhoto from './components/SchoolProfile/UploadPhoto/UploadPhoto';
import NewInstBlank from './components/SchoolProfile/NewInstBlank/NewInstBlank';



const EditMemberWrapper =() => {
    
    const {id} = useParams();
    const [idInt, setId] = useState<number>(0);
 
   
    
    useEffect(() =>{

    
      if(id!=undefined)
        setId(parseInt(id,10))
        
     
    },[id])
     return <EditMembers  id={idInt}/>

  }

 

function App() {
 
  const navigate = useNavigate();
  
  const {token, login, dispatch} = useTokenContext();
  

  useEffect(() =>{
      const tempToken = sessionStorage.getItem('jwtToken_key')
      if(tempToken){
        dispatch({type:'SET_TOKEN', payload:tempToken})
      }
  },[])
  useEffect(()=>{
    if(token){
      dispatch({type:'SET_LOGIN',payload:true})
     
      
    }
    else{
      dispatch({type:'SET_LOGIN',payload:false})
    }
    
    
  },[token])

   
    
  

  return (
    <>
    <JoinSocket />
    <LoadAllContext />
    <ToastContainer
        position="top-center"
        // autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        
      />
   
    {!login?
   
    
    
    (
        <>
        
        <div>
              <Routes>
                <Route path='/' element={<LandingPage />}/>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                 <Route path='/addbus' element={<AddBus />} />
                 <Route path='/invite/accept/:token' element={<AcceptInvite />}/>
              </Routes>
        </div>
          </>
     
    ):
    (
    <div className='container-main'>
          <div className="div-left"><NavBar /></div>
          <div className="container div-right" >
          <div> <Header /></div>
            <div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/members" element={<Members />} />
                <Route path="/addmember" element={<AddMembers />} />
                <Route path="/help" element={<Help />} />
                <Route path='/history' element={<History />}/>
                <Route path='/video' element={<Video />}/>
                <Route path='/landing' element={<Landing />}/>
                <Route path='/content' element={<Content />}/>
                <Route path='/drill' element={<Drills />}/>
                <Route path='/billing' element={<Billing />}/>
                <Route path='/integration' element={<Integration />}/>
                <Route path='/profile' element={<Profile />}/>
                <Route path='editmember/:id' element={<EditMemberWrapper />} />
                <Route path='/preaddmember' element={<PreAddMember />} />
                <Route path='/memberlist' element={<MemberList />} />
                <Route path='/addalert' element={<AddAlert />} />
                <Route path='/addcamera' element={<AddCamera />} />
                <Route path='/cameras' element={<Cameras />} />
                <Route path='/newCamera' element={<NewCameraBlank />} />
                <Route path='/messages' element={<Messages />}/>
                <Route path='/uploadimages/:memberId' element={<UploadImage />} />
                <Route path='/displayprofile' element={<DisplayProfile />}/>
                <Route path='/addnewusers' element={<AddNewUsers />}/>
                <Route path='/invite/accept/:token' element={<AcceptInvite />}/>
                <Route path='/uploadphoto' element={<UploadPhoto />}/>
                <Route path='/newinstprofile' element={<NewInstBlank/>}/>              
              </Routes>
            </div>
          </div>
    </div>
    )
    }

    </>

     
  );

}
export default App;