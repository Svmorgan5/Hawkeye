import '../../components/Dashboard/Dashboard.css'
import '../Alerts/Alerts.css'
import DashCard from '../Dashboard/DashCard';
import Alert from '../../assets/Alert.png'
const Alerts = () => {
  return (
    <div>
    <div className="alert-cards">
     <div><DashCard  heading='Shared Alerts' message='View all shared alerts. ' picture={Alert} link='/alerts'/></div>
      <div> <DashCard  heading='Alerts' message='View all recent alerts.' picture={Alert} link='/alerts'/></div>
       



    </div>
    <table className='alerts-table'>
      <thead className='alerts-table-head'>
        <th> 
          <input  
            type="checkbox"></input>
         </th>
        <th> Code </th>
         <th> Date/Time </th>
          <th> Location </th>
           <th> Table Header </th>
            <th> Create Report </th>
        
      </thead>
    </table>
    </div>
    
  );
};

export default Alerts;