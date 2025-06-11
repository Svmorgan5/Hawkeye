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
import Members from './components/Members/Members';
import Help from './components/Help/Help';
import Header from './Header/Header';

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
                <Route path="/help" element={<Help />} />

                
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