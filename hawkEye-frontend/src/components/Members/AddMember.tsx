
import axios from 'axios'
import '../../assets/member.png'
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
const [role,setRole] = useState<string>('')
const [groups,setGroup] = useState<string>('')
  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
        setEmail(''),
        setName(''),
        setRole(''),
        setLast(''),
        setGroup('')
    try {
      await axios.post("http://127.0.0.1:5000/members/", {

        email: `${email}`,
        name: `${name} ${last}`,
        role: `${role}`,
        groups: `${groups}`,
        action: "none",
        active:true,
        
      },{
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
       
      });
       alert('New Member Added')
    } catch (error:any){
        alert(`Could not add new Member. ${error.response.data}`)
      console.error('Error message:', error.response);
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
                <input type='text' className='body-text role-box' value={role} onChange={(e)=>setRole(e.target.value)}></input>

                </div>
                <div className='label-wrapper bottom-label'>
                Group:
                <input type='text' className='body-text group-box' value={groups} onChange={(e)=>setGroup(e.target.value)}></input>
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