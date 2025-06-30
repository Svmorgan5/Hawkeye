import './Members.css'
import axios from 'axios'
import '../../../assets/member.png'
import { useNavigate } from 'react-router-dom'


import { useEffect, useState} from 'react'
// import EditMembers from './Edit Members/EditMembers'


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
  const [search,setSearch] = useState<string>('')
  const navigate = useNavigate();

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
  
  const getMembers = async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/members/", {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
      });
      const filteredMembers= response.data.filter((myMember:Member)=>
        myMember.name.toLowerCase().includes(search.toLowerCase())
      ||myMember.email.toLowerCase().includes(search.toLowerCase())
      ||myMember.groups.toLowerCase().includes(search.toLowerCase())
      ||myMember.role.toLowerCase().includes(search.toLowerCase()));
      setMembers(filteredMembers)
    
      
    } catch (error:any){
    
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };

  useEffect(()=>{
      getMembers()
  },[search]);
  const clearSearch = () => {
    setSearch('');
   
  }
  const deleteMember = async(id:any) =>{
    const confirmed = window.confirm('Are you sure you want to delete this member? This action cannot be undone!');
    if(confirmed){
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
    }
      // Log and extract JWT token from response
      
  };
  const editMember = (id:number) =>{
    navigate(`/editmember/${id}`)
  }
 
  const makeInactive = async (member:Member) => {
       try {
      await axios.put(`http://127.0.0.1:5000/members/${member.id}`, {
        id:`${member.id}`,
        email: `${member.email}`,
         name: `${member.name}`,
        role: `${member.role}`,
        groups: `${member.groups}`,
        active:`${!member.active}`,
        
      },{
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAzODc3MzIsImlhdCI6MTc1MDM0NDUzMiwic3ViIjoiMSJ9.T8OYCfeOPJZjy_Rc15TM5z5a8Ial7z_8Nlg0Zqd8DbM`
        }
       
      });
  
        toggleIsActive(member.id)
    } catch (error:any){
        alert(`Could not add Edit Member. ${error.message}`)
      console.error('Error message:', error.response.data);
      console.error('Error message:', error.message);
     
    }
  }
  
  
  
  
  return (
    
    <div>
      
        <div className ='member-header'>
          <div className='member-header-top'>
            <div className='breadcrumb'>Members</div>
            <div className='member-header-right'>
              <div className='members-search-wrapper'>
          
                <input type='text' placeholder='Search members' className='member-search' onChange={(e)=>setSearch(e.target.value)} value={search}></input>
                <button onClick={clearSearch} className='member-search-cancel'>X</button>
               
              </div>
              <button className='member-search-button'  onClick={getMembers}>Search</button>
              
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
           <a href="/preaddmember"><input type='button' className='member-add member-header-right' value='+ Add Member' ></input></a>
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
        </table>
        <div className="tbody">
        <table className='table-in-table'>
        <tbody>
        
          {members?.map(member=> {
            if (member.active=== activeState && member.isVisible !== false){
              return(
              
            <tr key={member.id} className='tr'>
              <td className='left-cell'><img src='\src\assets\member.png'></img><span className='member'>{member.name}</span></td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>{member.groups}</td>
              <td>
                <button onClick={()=>deleteMember(member.id)} className='delete'>Delete </button>
                <button className='edit' onClick={()=>editMember(member.id)}>Edit</button> 
                 
                
                <button onClick={()=>makeInactive(member)} className='active'>
                  {member.active?('Deactivate'):('Reactivate')}
                  </button></td>
            </tr>
            )
            }
            
          })}
       
        </tbody>
        </table>
        </div>


     

     
    
    </div>
  );
};

export default Members