import '../../UnderConstruction.css'
import './Dashboard.css'
import DashCard from './DashCard';
import bars from '../../assets/bars.png'
import settings from  '../../assets/setting.png'
import members from '../../assets/members.png'
import Training from '../../assets/training.png'
import Alerts from '../../assets/alerts.png'
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

         
  </>


  );
};

export default Dashboard;