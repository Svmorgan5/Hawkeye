
import axios from 'axios'
import './EditMembers.css'
import {toast} from 'react-toastify'

import { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

type Member = {
    id:any,
    name:string,
    email:string,
    role: string,
    groups:string,
    active:string
    created_by_user_id:number,
    institution_id:number,
  

}

type Props = {
    id:number,
}
const EditMembers: React.FC<Props> = ({id}) => {
    console.log(id)
    
    const [member, setMember] = useState<Member>()
    const [email,setEmail] = useState<string>('')
    const [name,setName] = useState<string>('')
    const [role,setRole] = useState<string>('')
    const [groups,setGroup] = useState<string>('')
    const [active,setActive] = useState<boolean>(true)
    const [createdBy, setCreatedBy] = useState<number>(0)
    const [instId,setInstId] = useState<number>(0)

    const navigate = useNavigate();
    const token = sessionStorage.getItem('jwtToken_key')
  useEffect(()=> {
    const getMembers = async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/members/", {
        headers:{
          'Authorization':  `Bearer ${token}`,
        }
      });
      const myMember = response.data.find((m:Member)=>m.id===id)
      if(myMember)
      {
          setMember(myMember)
          setMember(myMember);
          setEmail(myMember.email);
          setName(myMember.name);
          setRole(myMember.role);
          setGroup(myMember.groups);
          setActive(myMember.active);
          setCreatedBy(myMember.created_by_user);
          setInstId(myMember.institution_id);
        }
    
      
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };

  getMembers()
  },[id]);



    


  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
       
    try {
      await axios.put(`http://127.0.0.1:5000/members/${id}`, {
        id:`${id}`,
        email: `${email}`,
        name: `${name}`,
        role: `${role}`,
        groups: groups,
        active:active,
        
        
      },{
        headers:{
           'Authorization': `Bearer ${token}`,
        }
       
      });
       toast.success('Edit Successful');
        setEmail('');
        setName('');
        setRole('Teacher');
        setActive(true);
        setGroup('');
        setCreatedBy(0);
        setInstId(0);
        navigate('/members');
        
    } catch (error: any) {
    // Detailed error handling:
    if (error.response) {
      // Server responded with status outside 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      toast.warning('Edit failed. No response received from server.');
    } else {
      // Something else caused an error
      console.error('Error setting up request:', error.message);
      toast.warning(`Edit failed. Error: ${error.message}`);
    }
  }
};

 
    
  
 
  
  
  
  
  return (
    
    <div className='body-editmembers'>
      
      
        <form className='new-member-form' onSubmit={handleSubmit}>
            <label className='form-header' ><div className='header-text'>Edit Member</div></label>
            <div className='div-body'>   
                <div className='label-wrapper'>
                Name: 
                <input type='text' className='body-text name-box-editmembers' value={name} onChange={(e)=>setName(e.target.value)}></input>
                </div>
                
                <div className='label-wrapper'>
                Email Address:
                <input type='email'  className='body-text email-box-editmembers'value={email} onChange={(e)=>setEmail(e.target.value)}></input>
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
                <select className='body-select group-box' value={groups} onChange={(e)=>setGroup(e.target.value)}>
                <option value='Employee' >Employee</option>
                <option value='Former Staff'>Former Staff</option>
                <option value='Admin'>Admin</option>
                <option value='Student'>Student</option>
                <option value='Parent'>Parent</option>
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
                    onClick={()=>handleSubmit}
                    value="Save">

                    </input>

            </div>
            </div>
        </form>
    
    </div>
  );
};

export default EditMembers