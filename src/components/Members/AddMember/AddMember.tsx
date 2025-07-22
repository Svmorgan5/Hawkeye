
import axios from 'axios'
import '../../../assets/member.png'
import './AddMembers.css'
import {toast} from 'react-toastify'

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
const [groups,setGroup] = useState<string>('Employee')
const token = sessionStorage.getItem('jwtToken_key')

  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
       
    try {
      await axios.post("http://127.0.0.1:5000/members/", {

        email: `${email}`,
        name: `${name} ${last}`,
        role: `${role}`,
        groups: `${groups}`,
        active:false,
        
      },{
        headers:{
          'Authorization':  `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
       
      });
       toast.success('New Member Added');
        setEmail('');
        setName('');
        setRole('Teacher');
        setLast('');
        setGroup('Employee');
    } catch (error:any){
        toast.warning(`Could not add new Member. Please check that all data was inputted correctly. ${error.response.data}`)
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };
 
  
  
  
  
  return (
    
    <div className='body-addmembers'>
      
      
        <form className='new-member-form' onSubmit={handleSubmit}>
            <label className='form-header' ><div className='header-text'>Add Member</div></label>
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
                <option value='Teacher' >Admin Primary</option>
                <option value='Principal'>Admin</option>
                <option value='Office Staff'>Account Payable</option>
                <option value='Kitchen Staff'>Teacher</option>
                <option value='Kitchen Staff'>Employee</option>
                <option value='Kitchen Staff'>Security Gaurd</option>
                <option value='Kitchen Staff'>SRO</option>
                </select>

                </div>
                <div className='label-wrapper bottom-label'>
                Group:
                <select className='body-select  group-box-addmembers' value={groups} onChange={(e)=>setGroup(e.target.value)}>
                <option value='Employee' >Administrators</option>
                <option value='Former Staff'>Teachers</option>
                <option value='Admin'>Employees</option>
                <option value='KParent'>Security Personnel</option>
                
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