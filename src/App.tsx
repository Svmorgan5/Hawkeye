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
import Profile from './components/SchoolProfile/SchoolProfile';
import EditMembers from './components/Members/Edit Members/EditMembers';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PreAddMember from './components/Members/PreAddMember/PreAddMember';
import MemberList from './components/Members/MemberList/MemberList';

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
  
  return (
    <div className='container-main'>
          <div className="div-left"><NavBar /></div>
        
        
          <div className="container div-right" >
              <div> <Header /></div>
             
             <div>
              <Routes>
                
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cameras" element={<Cameras />} />
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
                
                
                


                
              </Routes>
              </div>
        </div>
    </div>
    // <div className="container">
    //   <div className="div-left" >
       
    //   <TheSignUp />
    //   </div>
    //   <div className="div-right" >
    //   <Register />
    //   </div>
    // </div>
  );
}

export default App;