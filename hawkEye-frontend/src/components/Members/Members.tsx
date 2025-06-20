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
    active:string

}


const Members = () => {
  const [members, setMembers] = useState<Member[]>([{id:0,name:'',email:'',role:'',groups:'',active:''}])
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
  getMembers();
  
  },[]);
  
  
  
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
                  <td className='active-table'>
                     Active
                  </td>
                  <td className='active-table'>
                    Inactive
                  </td> 
                </tr>
              </table>
            </div>
            <input type='button' className='member-add member-header-right' value='+ Add Member'></input>
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
          {members?.map(member=>
            <tr key={member.id} className='tr'>
              <td className='left-cell'><img src='\src\assets\member.png'></img><span className='member'>{member.name}</span></td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>{member.groups}</td>
              <td>NA</td>


            </tr>

          )}
        </tbody>
      </table>
      
    
    </div>
  );
};

export default Members