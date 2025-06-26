
import axios from 'axios'


import { useEffect, useState} from 'react'


type Member = {
    id:any,
    name:string,
    email:string,
    role: string,
    groups:string,
    active:string

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

  useEffect(()=> {
    const getMembers = async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/members/", {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
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
        groups: `${groups}`,
        active:`${active}`,
        
      },{
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
       
      });
       alert('Edit Successful');
        setEmail('');
        setName('');
        setRole('Teacher');
        setActive(true);
        setGroup('');
    } catch (error:any){
        alert(`Could not add Edit Member. ${error.message}`)
      console.error('Error message:', error.response.data);
      console.error('Error message:', error.message);
     
    }

 
    
  };
 
  
  
  
  
  return (
    
    <div className='body'>
      
      
        <form className='new-member-form' onSubmit={handleSubmit}>
            <label className='form-header' ><div className='header-text'>Edit Member</div></label>
            <div className='div-body'>   
                <div className='label-wrapper'>
                Name: 
                <input type='text' className='body-text name-box' value={name} onChange={(e)=>setName(e.target.value)}></input>
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
                <select className='body-select group-box' value={groups} onChange={(e)=>setGroup(e.target.value)}>
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