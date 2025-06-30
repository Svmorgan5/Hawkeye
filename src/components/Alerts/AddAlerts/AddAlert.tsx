
import axios from 'axios'
import '../../../assets/member.png'
import './AddMembers.css'

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

   
    message:string

const [code,setCode] = useState<string>('')
const [location,setLocation] = useState<string>('')
const [time,setTime] = useState<Date|null>()
const [alert_type,setAlert_type] = useState<string>('Teacher')
const [message,setMessage] = useState<string>('')

  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
       
    try {
      await axios.post("http://127.0.0.1:5000/members/", {
          code:`${code}`,
          location:`${location}`,
          time: `${time}`,
          alert_type:`${alert_type}`,
          message:`${message}`,
        
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
        setAlert_type('');
        setMessage('');
    } catch (error:any){
        alert(`Could not add new Alert. ${error.response.data}`)
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
                First Name: 
                <input type='text' className='body-text name-box-addmembers' value={name} onChange={(e)=>setName(e.target.value)}></input>
                </div>
                <div className='label-wrapper'>
                Last Name: 
                <input className='body-text' type='text' value={last} onChange={(e)=>setLast(e.target.value)}></input>
                </div>
                <div className='label-wrapper'>
                Email Address:
                <input type='email'  className='body-text email-box'value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                </div>
                <div className='label-wrapper'>
                Role:
                <select className='body-select role-box-addmembers' value={role} onChange={(e)=>setRole(e.target.value)}>
                <option value='Teacher' >Teacher</option>
                <option value='Student'>Student</option>
                <option value='Principal'>Principal</option>
                <option value='Office Staff'>Office Staff</option>
                <option value='Kitchen Staff'>Kitchen Staff</option>
                <option value='Parent'>Parent</option>
                </select>

                </div>
                <div className='label-wrapper bottom-label'>
                Group:
                <select className='body-select  group-box-addmembers' value={groups} onChange={(e)=>setGroup(e.target.value)}>
                <option value='Employee' >Employee</option>
                <option value='Former Staff'>Former Staff</option>
                <option value='Admin'>Admin</option>
                <option value='Student'>Student</option>
                <option value='KParent'>Parent</option>
                <option value='Other'>Other</option>
                </select>
                </div>
            <div className='form-footer'>
                <a href='/members'>
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

export default AddMembers