import '../../components/Dashboard/Dashboard.css'
import './Alerts.css'
import DashCard from '../Dashboard/DashCard';
import Alert from '../../assets/Alert.png'
import Bars from '../../assets/bars.png'
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
  const [alertState, setAlertState] = useState<string>('all')

  const getAlerts =  async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/alerts/", {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
      });
      const filteredAlerts= response.data.filter((myAlert:Alert)=>
        myAlert.code.toLowerCase().includes(search.toLowerCase())
      ||myAlert.location.toLowerCase().includes(search.toLowerCase())
      ||myAlert.alert_type.toLowerCase().includes(search.toLowerCase())
      ||myAlert.message.toLowerCase().includes(search.toLowerCase())
      ||myAlert.timestamp.toLowerCase().includes(search.toLowerCase()));
      setAlerts(filteredAlerts)
    
      
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    
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

    setSearch('');
   
  }

  const activeTableClass = (theClass:string) =>{
    if(theClass===alertState)
      return 'active-table alerts-type-table-td'
    else
      return 'inactive-table alerts-type-table-td'
  } 
  
 

 
  return (
    
    <div>
       <div className ='alert-header'>
          <div className='alert-header-top'>
            <div className='breadcrumb'>Alert</div>
            
              
           
          
          </div>
    <div className = 'alerts-body'>
    <div className="alert-cards">
     <div><DashCard  heading='Shared Alerts' message='View all shared alerts. ' picture={Alert} link='/alerts' sizing='double'/></div>
      <div> <DashCard  heading='Alerts' message='View all recent alerts.' picture={Bars} link='/alerts'/></div>
       



    </div>
    <div className='member-header-bottom'>
            <div className='alert-types-and-search'>
              <div>
              <table className="alerts-type-table">
                <tr >
                  {/* {activeState? */}
                  {/* (
                    <> */}
                  <td  style={{ cursor: 'pointer' }} className={activeTableClass("all")} onClick={()=>setAlertState('all')}>
                     All Alerts
                  </td>
                  <td  style={{ cursor: 'pointer' }}className={activeTableClass("scheduled")} onClick={()=>setAlertState('scheduled')}>
                    Scheduled
                  </td> 
                  <td style={{ cursor: 'pointer' }} className={activeTableClass("test")} onClick={()=>setAlertState('test')}>
                     Test Alert
                  </td>
                  <td  style={{ cursor: 'pointer' }}className={activeTableClass("real")} onClick={()=>setAlertState('real')}>
                    Real Alert
                  </td> 
                   <td  style={{ cursor: 'pointer' }}className={activeTableClass("archived")} onClick={()=>setAlertState('archived')}>
                    Archive
                  </td> 
                 
                  
                </tr>
              </table>
              </div>
             
              <div className='alert-search-table-cell'>
             
                
                <input type='text' placeholder='Search alerts' className='alert-search' onChange={(e)=>setSearch(e.target.value)} value={search}></input>
                <button onClick={clearSearch} className='alert-search-cancel'>Clear Search</button>
                
                   <a href="/addalert"><input type='button' className='alert-add' value='+ Add Alert' ></input></a>
                </div>
          
               
                    
       
      
                
        
              
       
            </div>
          </div>

    <table className='table'>
      <thead className='thead'>
        <tr className='th'>
       
        <th > Code </th>
        <th > Date </th>
        <th > Time </th>
        <th > Location </th>
        <th > Message </th>
        </tr>
        
      </thead>
      </table>
      
      <div className="tbody-alerts">
        <table className='table-in-table'>
        <tbody>

    
      {alerts?.map(alert=> {
          
              return(
              <>
              {(alertState==='all'||alertState===alert.alert_type)&&
            <tr key={alert.id} className='tr'>
              <td >{alert.code}</td>
              <td>{(alert.timestamp).split('T')[0]}</td>
              <td>{(alert.timestamp).split('T')[1]}</td>
              <td>{alert.location}</td>
              <td>{alert.message}</td>
             
              
             
            </tr>
             }
            </>
            )
            
            
          })}
          </tbody>
    </table>
    </div>
    </div>
    </div>
   </div>
    
  );
};

export default Alerts;





