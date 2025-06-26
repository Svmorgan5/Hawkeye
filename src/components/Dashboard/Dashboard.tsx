import '../../UnderConstruction.css'
import './Dashboard.css'
import DashCard from './DashCard';
import bars from '../../assets/bars.png'
import settings from  '../../assets/setting.png'
import members from '../../assets/members.png'
import Training from '../../assets/training.png'
import Alerts from '../../assets/alerts.png'
import Camera1 from '../../assets/Camera1.png'
import Avatar1 from '../../assets/Avatar1.png'
import Avatar2 from '../../assets/Avatar2.png'
import Avatar3 from '../../assets/Avatar3.png'
import Avatar4 from '../../assets/Avatar4.png'
import Avatar from '../../assets/Avatar.png'
import Avatar5 from '../../assets/Avatar5.png'
const Dashboard = () => {
  return (
    <>
    <p className='breadcrumb'>Dashboard</p>
     <p className='dashboard-head' > 
        Welcome, Principal Roberts! </p>
    <div className="card-container">
        <DashCard heading='Alerts' message='Lorem ipsum odor amet, consectetuer adipiscing elit.' picture={Alerts} link='/alerts' />
        <DashCard heading='Reports' message='Lorem ipsum odor amet, consectetuer adipiscing elit. ' picture={bars} link='/reports'/>
        <DashCard heading='Lockdowns' message='Lorem ipsum odor amet, consectetuer adipiscing elit. ' picture={bars} />
     
    </div>
    <div className="card-container">
        <DashCard heading='Members' message='Lorem ipsum odor amet, consectetuer adipiscing elit.'  picture={members} link='/members' />
        <DashCard heading='Training' message='Lorem ipsum odor amet, consectetuer adipiscing elit.' picture={Training} link='/tr'/>
        <DashCard heading='Settings' message='Lorem ipsum odor amet, consectetuer adipiscing elit.' picture={settings} />
     
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
    <button className='camera-button'>View all cameras</button> 
  </>


  );
};

export default Dashboard;