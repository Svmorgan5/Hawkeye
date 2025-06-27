
import axios from 'axios'
import '../../../assets/member.png'
import './AddMembers.css'

import { useEffect, useState} from 'react'


type Member = {
    id:any,
    name:string,
    email:string,
    role: string,
    groups:string,
    active:string

}


const AddMembers = () => {

const [email,setEmail] = useState<string>('')
const [name,setName] = useState<string>('')
const [last,setLast] = useState<string>('')
const [role,setRole] = useState<string>('Teacher')
const [groups,setGroup] = useState<string>('')

  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
       
    try {
      await axios.post("http://127.0.0.1:5000/members/", {

        email: `${email}`,
        name: `${name} ${last}`,
        role: `${role}`,
        groups: `${groups}`,
        active:true,
        
      },{
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`,
          'Content-Type': 'application/json'
        }
       
      });
       alert('New Member Added');
        setEmail('');
        setName('');
        setRole('Teacher');
        setLast('');
        setGroup('');
    } catch (error:any){
        alert(`Could not add new Member. ${error.response.data}`)
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };
 
  
  
  
  
  return (
    
    <div className='body'>
      
      
        <form className='new-member-form' onSubmit={handleSubmit}>
            <label className='form-header' ><div className='header-text'>Add Member</div></label>
            <div className='div-body'>   
                <div className='label-wrapper'>
                First Name: 
                <input type='text' className='body-text' value={name} onChange={(e)=>setName(e.target.value)}></input>
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
                <select className='body-select role-box' value={role} onChange={(e)=>setRole(e.target.value)}>
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
                <select className='body-select role-box' value={groups} onChange={(e)=>setGroup(e.target.value)}>
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