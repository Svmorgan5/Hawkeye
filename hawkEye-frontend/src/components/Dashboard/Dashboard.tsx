import '../../UnderConstruction.css'
import './Dashboard.css'
import DashCard from './DashCard';
const Dashboard = () => {
  return (
    <>
    <div className="card-container">
        <DashCard heading='Alerts' message='Hello' />
        <DashCard heading='Reports' message='Hello' />
        <DashCard heading='Lockdowns' message='Hello' />
     
    </div>
    <div className="card-container">
        <DashCard heading='Members' message='Hello' />
        <DashCard heading='Training' message='Hello' />
        <DashCard heading='Settings' message='Hello' />
     
    </div>

         
  </>

  


  );
};

export default Dashboard;