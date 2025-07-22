
import axios from 'axios'
import '../../../assets/member.png'
import './AddAlert.css'
import {toast} from 'react-toastify'

import { useEffect, useState} from 'react'
import { useTokenContext } from '../../../Context/Context';
import { useInstitutionContext } from '../../../Context/InstitutionContext';

type Alert = {
    id:any,
    code:string,
    location:string,
    time: Date,
    alert_type:string,
    message:string

}


       

const AddAlert = () => {

   


const [code,setCode] = useState<string>('Code Red')
const [location,setLocation] = useState<string>('')
const [time,setTime] = useState<string|null>('')
const [alert_type,setAlert_type] = useState<string>('scheduled')
const [message,setMessage] = useState<string>('')
const [camera,setCamera] = useState<string|null>(null)
 const {token, user_id, user_name, user_institution_id, user_image, dispatch:tokenDispatch} = useTokenContext();
  const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext();

  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
       
    try {
      const utcTime = time? new Date(time).toISOString():null;
      await axios.post("http://127.0.0.1:5000/alerts/", {
          code:`${code}`,
          location:`${location}`,
          timestamp: utcTime,
          scheduled_time:time,
          alert_type:`${alert_type}`,
          message:`${message}`,
          camera:parseInt(`${camera}`)
        
      },{
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
       
      });
      console.log("User-entered time:", time);
      console.log("Converted UTC:", utcTime);
      toast.success("New Alert Added")
      
       
        setCode('Code Red');
        setLocation('');
        setTime(null);
        setAlert_type('scheduled');
        setMessage('');
        setCamera(null);
    } catch (error:any){
        toast.warning(`Could not add new Alert. Please check that all data was inputted correctly. ${error.message}`)
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };
 
  
  
  
  
  return (
    
    <div className='body-addmembers'>
      
      
        <form className='new-member-form' onSubmit={handleSubmit}>
            <label className='form-header' ><div className='header-text'>Add Alert</div></label>
            <div className='alert-div-body'>   
                <div className='alert-label-wrapper'>
                  Code:
                  <select defaultValue='Code Red' className='body-select role-box-addmembers' value={code} onChange={(e)=>setCode(e.target.value)}>
                  <option value='Code Red' >Code Red</option>
                  <option value='Code Blue'>Code Blue</option>
                  <option value='Lockdown'>Lockdown</option>
                  <option value='Shelter in place'>Shelter in place</option>
                  <option value='Fire Drill'>Fire Drill</option>
                  </select>

                  </div>
                <div className='alert-label-wrapper '>
                  Location:
                  <input type='text' className='body-text ' value={location} onChange={(e)=>setLocation(e.target.value)}></input>
                  </div>
                
                

                <div className='alert-label-wrapper'>
                  Alert Type
                  <select className='body-select ' value={alert_type} onChange={(e)=>setAlert_type(e.target.value)}>
                  <option selected={true} value='scheduled' >Scheduled</option>
                  <option value='test'>Test</option>
                  <option value='real'>Real</option>
                  <option value='archived'>Archived</option>
              
                  </select>

                </div>



                <div className='alert-label-wrapper '>
              
                  Message
                  <input type='text'  className='body-text'value={message} onChange={(e)=>setMessage(e.target.value)}></input>
                  </div>
               
                <div className='alert-label-wrapper'>
            
                Camera:
                  <input className='body-text ' type='text' value={camera} onChange={(e)=>setCamera(e.target.value)}></input>
               
              </div>
              <div className='alert-label-wrapper'>
                  Time
                  <input className='body-text time-box-addalerts' type='datetime-local' value={time} onChange={(e)=>setTime(e.target.value)}></input>
                  </div>
           
                  
           
            <div className='form-footer'>
                <a href='/alerts'>
                <input
                    type="button"
                    className='cancel-button'
                    value="Cancel">
                    </input>
                </a>
                <input
                    type="submit"
                    className='save-button'
                    value="Save">
                    </input>

            </div>
            </div>
        </form>
    
    </div>
  );
};

export default AddAlert




// # Create Alert
// @alerts_bp.route('/', methods=['POST'])
// def create_alert():
//     try:
//         alert_data = alert_schema.load(request.json)
//     except ValidationError as e:
//         return jsonify(e.messages), 400

//     camera_ids = request.json.get('camera_ids', [])
//     cameras = db.session.query(Camera).filter(Camera.id.in_(camera_ids)).all() if camera_ids else []

//     new_alert = alert_data
//     new_alert.cameras = cameras

//     db.session.add(new_alert)
//     db.session.commit()

//     from backend.application import socketio
//     socketio.emit('new_alert', {
//         'id': new_alert.id,
//         'message': new_alert.message,
//         'code': new_alert.code,
//         'location': new_alert.location,
//         'alert_type': new_alert.alert_type.value,
//         'timestamp': new_alert.timestamp.isoformat(),
//     })

//     return alert_schema.jsonify(new_alert), 201

