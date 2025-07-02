import '../../components/Dashboard/Dashboard.css'
import '../Alerts/Alerts.css'
import DashCard from '../Dashboard/DashCard';
import Alert from '../../assets/Alert.png'
import axios from 'axios'
import { useEffect, useState } from 'react';

type Alert = {
    id:any,
    code:string,
    location:string,
    timestamp: string,
    alert_type:string,
    message:string

}


const Alerts = () => {
  const [alerts,setAlerts] = useState<Alert[]>()
  const [search,setSearch] = useState<string>('')
  const getAlerts =  async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/alerts/", {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
      });
      setAlerts(response.data)
      console.log(response.data)
    
      
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };

    
    useEffect(()=> {
    const getAlerts = async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/alerts/", {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
      });
      setAlerts(response.data)
      console.log(response.data)
    
      
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };

  getAlerts()
  },[]);

  useEffect(()=>{
      getAlerts()
  },[search]);

  const clearSearch = () => {
    setAlerts([]);
   
  }


 
  return (
    
    <div>
       <div className ='alert-header'>
          <div className='alert-header-top'>
            <div className='breadcrumb'>Alert</div>
            <div className='alert-header-right'>
              <div className='alerts-search-wrapper'>
          
                <input type='text' placeholder='Search alerts' className='alert-search' onChange={(e)=>setSearch(e.target.value)} value={search}></input>
                <button onClick={clearSearch} className='alert-search-cancel'>X</button>
               
              </div>
              <button className='alert-search-button'  onClick={getAlerts}>Search</button>
              
            </div>
          </div>
    <div className="alert-cards">
     <div><DashCard  heading='Shared Alerts' message='View all shared alerts. ' picture={Alert} link='/alerts'/></div>
      <div> <DashCard  heading='Alerts' message='View all recent alerts.' picture={Alert} link='/alerts'/></div>
       



    </div>
    <div className='table'>
    <table className='alerts-table'>
      <thead className='alerts-table-head'>
        <th> 
          <input  
            type="checkbox"></input>
        </th>
        <th> Code </th>
        <th> Date/Time </th>
        <th> Location </th>
        
        
      </thead>
      </table>
      </div>
      <div className='table'>

      <table>
      {alerts?.map(alert=> {
          
              return(
              <>
            <tr key={alert.id} className='tr'>
              
              <td className='second-left-cell'><input type='checkbox'></input></td>
              <td className='second-left-cell'>{alert.code}</td>
              <td>{alert.timestamp}</td>
              <td>{alert.location}</td>
             
             
            </tr>
            </>
            )
            
            
          })}
    </table>
    </div>
    </div>
    </div>
    
  );
};

export default Alerts;





