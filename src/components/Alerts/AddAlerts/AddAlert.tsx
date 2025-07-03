
import axios from 'axios'
import '../../../assets/member.png'
import './AddAlert.css'

import { useEffect, useState} from 'react'


type Alert = {
    id:any,
    code:string,
    location:string,
    time: Date,
    alert_type:string,
    message:string

}


       

const AddAlert = () => {

   


const [code,setCode] = useState<string>('')
const [location,setLocation] = useState<string>('')
const [time,setTime] = useState<string>('')
const [alert_type,setAlert_type] = useState<string>('scheduled')
const [message,setMessage] = useState<string>('')
const [camera,setCamera] = useState<number|null>(null)

  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
       
    try {
      await axios.post("http://127.0.0.1:5000/alerts/", {
          code:`${code}`,
          location:`${location}`,
          timestamp: `${time}`,
          alert_type:`${alert_type}`,
          message:`${message}`,
          // camera?:`${camera}`
        
      },{
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`,
          'Content-Type': 'application/json'
        }
       
      });
       alert('New Alert Added');
       
        setCode('');
        setLocation('');
        setTime(null);
        setAlert_type('scheduled');
        setMessage('');
        setCamera(null);
    } catch (error:any){
        alert(`Could not add new Alert. ${error.message}`)
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };
 
  
  
  
  
  return (
    
    <div className='body-addmembers'>
      
      
        <form className='new-member-form' onSubmit={handleSubmit}>
            <label className='form-header' ><div className='header-text'>Add Alert</div></label>
            <div className='div-body'>   
               <div className='label-wrapper'>
                Code:
                <select className='body-select role-box-addmembers' value={code} onChange={(e)=>setCode(e.target.value)}>
                <option selected={true} value='Code Red' >Code Red</option>
                <option value='Code Blue'>Code Blue</option>
                <option value='Lockdown'>Lockdown</option>
                <option value='Shelter in place'>Shelter in place</option>
                <option value='Fire Drill'>Fire Drill</option>
                </select>

                </div>
                <div className='label-wrapper '>
                Location:
                <input type='text' className='body-text location-box-addalerts' value={location} onChange={(e)=>setLocation(e.target.value)}></input>
                </div>
                
                

                <div className='label-wrapper'>
                Alert Type
                <select className='body-select alert-box-addalerts' value={alert_type} onChange={(e)=>setAlert_type(e.target.value)}>
                <option selected={true} value='scheduled' >Scheduled</option>
                <option value='test'>Test</option>
                <option value='real'>Real</option>
                <option value='archived'>Archived</option>
            
                </select>

                </div>



                <div className='label-wrapper '>
              
                Message
                <input type='text'  className='body-text message-box-addalerts'value={message} onChange={(e)=>setMessage(e.target.value)}></input>
                </div>
               <div className='label-wrapper'>
                Time
                <input className='body-text time-box-addalerts' type='datetime-local' value={time} onChange={(e)=>setTime(e.target.value)}></input>
                </div>
                <div className='label-wrapper'>
                  
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

