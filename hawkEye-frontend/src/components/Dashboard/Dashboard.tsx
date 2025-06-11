import '../../UnderConstruction.css'
import './Dashboard.css'
import DashCard from './DashCard';
import bars from '../../assets/bars.png'
import settings from  '../../assets/setting.png'
const Dashboard = () => {
  return (
    <>
    <div className="card-container">
        <DashCard heading='Alerts' message='Hello' />
        <DashCard heading='Reports' message='Lorem ipsum odor amet, consectetuer adipiscing elit. ' picture={bars}/>
        <DashCard heading='Lockdowns' message='Lorem ipsum odor amet, consectetuer adipiscing elit. ' picture={bars} />
     
    </div>
    <div className="card-container">
        <DashCard heading='Members' message='Hello'  />
        <DashCard heading='Training' message='Hello' />
        <DashCard heading='Settings' message='Hello' picture={settings} />
     
    </div>

         
  </>


  );
};

export default Dashboard;