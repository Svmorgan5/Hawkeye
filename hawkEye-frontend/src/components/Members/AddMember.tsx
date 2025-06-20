
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
const [role,setRole] = useState<string>('')
const [groups,setGroup] = useState<string>('')
  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  

    try {
      await axios.post("http://127.0.0.1:5000/members/", {

        email: `${email}`,
        name: `${name}`,
        role: `${role}`,
        groups: `${groups}`,
        action: "none",
        active:"true",
        
      },{
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
       
      });
  
    } catch (error:any){

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
                Name: 
                <input type='text' value={name} onChange={(e)=>setName(e.target.value)}></input>
                </div>
                <div className='label-wrapper'>
                Email Address:
                <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                </div>
                <div className='label-wrapper'>
                Role:
                <input type='text' value={role} onChange={(e)=>setRole(e.target.value)}></input>

                </div>
                <div className='label-wrapper'>
                Group:
                <input type='text' value={groups} onChange={(e)=>setGroup(e.target.value)}></input>
            </div>
            <div className='form-footer'>
                <input
                    type="button"
                    className='cancel-button'
                    value="Cancel">
                    </input>
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