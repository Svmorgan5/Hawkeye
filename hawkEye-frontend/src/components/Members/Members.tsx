import './Members.css'
import axios from 'axios'
import '../../assets/member.png'


import { useEffect, useState} from 'react'


type Member = {
    id:any,
    name:string,
    email:string,
    role: string,
    groups:string,
    active:boolean,
    isVisible:boolean

   

}


const Members = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [activeState,setActiveState] = useState<boolean>(true)

  const toggleActiveState = () =>{
    setActiveState(prev=>!prev);
  }

  const toggleIsActive = (id:any) => {
    setMembers(prevMembers => 
      prevMembers.map(member=>
        member.id===id?
          {...member,active:!member.active}:
          member
        ))
  }
  const toggleIsVisible = (id:any) => {
    setMembers(prevMembers => 
      prevMembers.map(member=>
        member.id===id?
          {...member,isVisible:false}:
          member
        ))
  }
  



  useEffect(()=> {
    const getMembers = async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/members/", {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
      });
      setMembers(response.data)
    
      
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };

  getMembers()
  },[]);
  

  const deleteMember = async(id:any) =>{
    try {
      await axios.delete(`http://127.0.0.1:5000/members/${id}`, {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
      });
    
      toggleIsVisible(id);
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };
 
  
  
  
  
  
  return (
    
    <div>
      
        <div className ='member-header'>
          <div className='member-header-top'>
            <div className='breadcrumb'>Members</div>
            <div className='member-header-right'>
              <input type='text' placeholder='Search members' className='member-search' ></input>
              <input type='button' className='member-search-button' value='Search'></input>
              
            </div>
          </div>
          <div className='member-header-bottom'>
            <div>
              <table>
                <tr >
                  {activeState?
                  (
                    <>
                  <td style={{ cursor: 'pointer' }} className='active-table' onClick = {toggleActiveState}>
                     Active
                  </td>
                  <td  style={{ cursor: 'pointer' }}className='inactive-table' onClick = {toggleActiveState}>
                    Inactive
                  </td> 
                  </>
                  )
                  :
                  (
                    <>
                  <td  style={{ cursor: 'pointer' }} className='inactive-table' onClick = {toggleActiveState}>
                     Active
                  </td>
                  <td  style={{ cursor: 'pointer' }} className='active-table' onClick = {toggleActiveState}>
                    Inactive
                  </td> 
                  </>
                  )
                  }
                </tr>
              </table>
            </div>
           <a href="/add_member"><input type='button' className='member-add member-header-right' value='+ Add Member' ></input></a>
          </div>
        </div>
      

      
      <table className='table'>
          
          <thead className="thead">
              <tr  className='th'>
              <th>
                Name
              </th>
              <th>
                Email
              </th>
              <th>
                Role
              </th>
              <th>
                Groups
              </th>
              <th>
                Actions
              </th> 
            </tr>
        </thead>
        
        <tbody className="tbody">
          {members?.map(member=> {
            if (member.active=== activeState && member.isVisible !== false){
              return(
              
            <tr key={member.id} className='tr'>
              <td className='left-cell'><img src='\src\assets\member.png'></img><span className='member'>{member.name}</span></td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>{member.groups}</td>
              <td>
                <button onClick={()=>deleteMember(member.id)} className='delete'>DELETE </button>
               
                <button className='edit'>EDIT </button>
                
                <button onClick={()=>toggleIsActive(member.id)} className='active'>
                  {member.active?('DEACTIVATE'):('REACTIVATE')}
                  </button></td>
            </tr>
            )
            }
            
          })}
        </tbody>


      </table>
      
    
    </div>
  );
};

export default Members