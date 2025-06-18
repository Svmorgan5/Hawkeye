import './Members.css'
import axios from 'axios'
import '../../assets/member.png'

import { useEffect, useState} from 'react'


type Member = {
    id:any,
    name:string,
    email:string,
    password?:string,
    phone?:number,

}


const Members = () => {
  const [members, setMembers] = useState<Member[]>([{id:0,name:'',email:''}])
  useEffect(()=> {
    const getMembers = async() =>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/users/", {
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAyMjcxODIsImlhdCI6MTc1MDE4Mzk4Miwic3ViIjoiMSJ9.at8C6X1UxE91dyOXoSFU9DOurupPKCMhHeyh9SCwTho`
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
              <td>NA</td>
              <td>NA</td>
              <td>NA</td>


            </tr>

          )}
        </tbody>
      </table>
      
    
    </div>
  );
};

export default Members