import '../../components/Dashboard/Dashboard.css'
import './Alerts.css'
import Alert from '../../assets/Alert.png'
import axios from 'axios'
import { useEffect, useState } from 'react';
import { useTokenContext } from '../../Context/Context';
import { useInstitutionContext } from '../../Context/InstitutionContext';


type Alert = {
    id:any,
    code:string,
    location:string,
    timestamp: string,
    alert_type:string,
    message:string,
    institution:any,

}


const Alerts = () => {
  const [alerts,setAlerts] = useState<Alert[]>()
  const [search,setSearch] = useState<string>('')
  const [alertState, setAlertState] = useState<string>('all')

 const {token, user_id, user_name, user_institution_id, user_image, dispatch:tokenDispatch} = useTokenContext();
   const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext(); 
 
 

  const getAlerts =  async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/alerts/", {
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
      const filteredAlerts= response.data.filter((myAlert:Alert)=>
        myAlert.code.toLowerCase().includes(search.toLowerCase())
      ||myAlert.location.toLowerCase().includes(search.toLowerCase())
      ||myAlert.alert_type.toLowerCase().includes(search.toLowerCase())
      ||myAlert.message.toLowerCase().includes(search.toLowerCase())
      ||myAlert.timestamp.toLowerCase().includes(search.toLowerCase()));
      setAlerts(filteredAlerts)
    
      console.log(response.data)
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    
  };


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
            <div className='breadcrumb'>
              Alert

            </div>
            
              
           
          
          </div>
        </div>
      
    <div className = 'alerts-body'>
                {/* <div className="alert-cards">
                {/* <div><DashCard  heading='Shared Alerts' message='View all shared alerts. ' picture={Alert} link='/alerts' sizing='double'/></div>
                  <div> <DashCard  heading='Alerts' message='View all recent alerts.' picture={Bars} link='/alerts'/></div>
                    */}
                {/* </div>  */}
      {/* <div className='alert-header-bottom'> */}
        <div className='alert-types-and-search'>
          <div>
            <table className="alerts-type-table">
              <tbody>
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
                </tbody>
              </table>
          </div>
        {/* </div>   */}
        <div className='alert-search-table-cell'>
             
                
          <input type='text' placeholder='Search alerts' className='alert-search' onChange={(e)=>setSearch(e.target.value)} value={search}></input>
          <button onClick={clearSearch} className='alert-search-cancel'>Clear Search</button>
          
              <a href="/addalert"><input type='button' className='alert-add' value='+ Add Alert' ></input></a>
        </div>
          
               
                    
       
      
                
        
              
       
      </div>
    

    <table className='alert-info-table'>
      <thead>
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
        <table className='alerts-table-in-table'> 
 
        <tbody>

    
      {alerts?.map(alert=> {
            if((alertState==='all'||alertState===alert.alert_type)&&alert.institution.id===instId){  
            return(
            <tr key={alert.id} className='tr'>
            
              <td >{alert.code}</td>
              <td>{(alert.timestamp).split('T')[0]}</td>
              <td>{(alert.timestamp).split('T')[1]}</td>
              <td>{alert.location}</td>
              <td>{alert.message}</td>
            </tr>
              
           )}
            
           return null;
            
            
          })}
          </tbody>
    </table>
    </div>
    </div>
    </div>
    
  );
};

export default Alerts;





