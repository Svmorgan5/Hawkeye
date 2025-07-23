
import './Members.css'
import axios from 'axios'
import '../../../assets/member.png'
import { useNavigate } from 'react-router-dom'
import addimage from '../../../assets/addimage.png'
import UploadImage from '../UpoloadImage/UploadImage'
import {toast} from 'react-toastify'

import { useEffect, useState } from 'react'
// import EditMembers from './Edit Members/EditMembers'

type Member = {
  id: any,
  name: string,
  email: string,
  role: string,
  groups: string,
  active: boolean,
  image: string,
  isVisible: boolean
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/'

function normalizeImageUrl(imagePath: string): string {
  if (!imagePath) return ''
  if (/^https?:\/\//.test(imagePath)) return imagePath
  const prefix = imagePath.startsWith('/') ? '' : '/static/'
  return `${baseURL}${prefix}${imagePath}`
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [activeState, setActiveState] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const navigate = useNavigate()
  const token = sessionStorage.getItem('jwtToken_key')

  const toggleActiveState = () => {
    setActiveState(prev => !prev)
  }

  const toggleIsActive = (id: any) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id
          ? { ...member, active: !member.active }
          : member
      ))
  }

  const toggleIsVisible = (id: any) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id
          ? { ...member, isVisible: !member.isVisible }
          : member
      ))
  }

  const addImage = (memberId: number) => {
    navigate(`/uploadimages/${memberId}`)
  }

  const getMembers = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/institutions/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const filteredMembers = response.data;
      const newMembers=filteredMembers.filter((myMember: Member) =>
         myMember.name.toLowerCase().includes(search.toLowerCase()) ||
         myMember.email.toLowerCase().includes(search.toLowerCase()) ||
         myMember.groups.toLowerCase().includes(search.toLowerCase()) ||
         myMember.role.toLowerCase().includes(search.toLowerCase())
      )
      setMembers(newMembers)
    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMembers()
  }, [])

  useEffect(() => {
    getMembers(),
    console.log(search)
    console.log('members:',{members})
  }, [search])

  const clearSearch = () => {
    setSearch('')
  }

  const deleteMember = async (id: any) => {
    const confirmed = window.confirm('Are you sure you want to delete this member? This action cannot be undone!')
    if (confirmed) {
      try {
        await axios.delete(`http://127.0.0.1:5000/members/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        toast.success('Member has been successfully deleted.')
        toggleIsVisible(id)
      } catch (error: any) {
        console.error('Error message:', error.message)
      }
    }
  }

  const editMember = (id: number) => {
    navigate(`/editmember/${id}`)
  }

  const makeInactive = async (member: Member) => {
    try {
      await axios.put(`http://127.0.0.1:5000/members/${member.id}`, {
        id: `${member.id}`,
        email: `${member.email}`,
        name: `${member.name}`,
        role: `${member.role}`,
        groups: `${member.groups}`,
        active: !member.active,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      toggleIsActive(member.id)
    } catch (error: any) {
      toast.warning(`Could not change member. ${error.message}`)
      console.error('Error message:', error.response?.data)
    }
  }

  return (
    <div>
      <div className='member-header'>
        <div className='member-header-top'>
          <div className='breadcrumb'>Members</div>
          <div className='member-header-right'>
            <div className='members-search-wrapper'>
              <input
                type='text'
                placeholder='Search members'
                className='member-search'
                onChange={(e) =>{setSearch(e.target.value)}}
                value={search}
              />
              <button onClick={clearSearch} className='member-search-cancel'>X</button>
            </div>
          </div>
        </div>

        <div className='member-header-bottom'>
          <div>
            <table>
              <tr>
                {activeState ? (
                  <>
                    <td className='active-table' style={{ cursor: 'pointer' }} onClick={toggleActiveState}>
                      Active
                    </td>
                    <td className='inactive-table' style={{ cursor: 'pointer' }} onClick={toggleActiveState}>
                      Inactive
                    </td>
                  </>
                ) : (
                  <>
                    <td className='inactive-table' style={{ cursor: 'pointer' }} onClick={toggleActiveState}>
                      Active
                    </td>
                    <td className='active-table' style={{ cursor: 'pointer' }} onClick={toggleActiveState}>
                      Inactive
                    </td>
                  </>
                )}
              </tr>
            </table>
          </div>
          <a href="/preaddmember">
            <input type='button' className='member-add member-header-right' value='+ Add Member' />
          </a>
        </div>
      </div>

      <table className='table'>
        <thead className="thead">
          <tr className='th'>
            <th className='left-cell'></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Groups</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>

      <div className="tbody">
        <table className='table-in-table'>
          <tbody>
            {members?.map(member => {
              if (member.active !== activeState && !member.isVisible) {
                return (
                  <tr key={member.id} className='tr'>
                    <td className='left-cell'>
                      <img
                        className='profile-image'
                        src={member.image ? normalizeImageUrl(member.image) : addimage}
                        alt={member.name}
                        onClick={!member.image ? () => addImage(member.id) : undefined}
                      />
                    </td>
                    <td className='second-left-cell'><span className='member'>{member.name}</span></td>
                    <td>{member.email}</td>
                    <td>{member.role}</td>
                    <td>{member.groups}</td>
                    <td>
                      <button onClick={() => deleteMember(member.id)} className='delete'>Delete</button>
                      <button className='edit' onClick={() => editMember(member.id)}>Edit</button>
                      <button onClick={() => makeInactive(member)} className='active'>
                        {!member.active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                )
              }
              return null
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Members




//orgiinal code on top is with sam's fixes
// import './Members.css'
// import axios from 'axios'
// import '../../../assets/member.png'
// import { useNavigate } from 'react-router-dom'
// import addimage from '../../../assets/addimage.png'
// import UploadImage from '../UpoloadImage/UploadImage'


// import { useEffect, useState} from 'react'
// // import EditMembers from './Edit Members/EditMembers'


// type Member = {
//     id:any,
//     name:string,
//     email:string,
//     role: string,
//     groups:string,
//     active:boolean,
//     image:string,
//     isVisible:boolean

   

// }


// const Members = () => {
//   const [members, setMembers] = useState<Member[]>([])
//   const [activeState,setActiveState] = useState<boolean>(true)
//   const [search,setSearch] = useState<string>('')
//   const navigate = useNavigate();
//   const token = sessionStorage.getItem('jwtToken_key')
//   const baseURL = import.meta.env.VITE_API_URL

//   const toggleActiveState = () =>{
//     setActiveState(prev=>!prev);
//   }

//   const toggleIsActive = (id:any) => {
//     setMembers(prevMembers => 
//       prevMembers.map(member=>
//         member.id===id?
//           {...member,active:!member.active}:
//           member
//         ))
//   }
//   const toggleIsVisible = (id:any) => {
//     setMembers(prevMembers => 
//       prevMembers.map(member=>
//         member.id===id?
//           {...member,isVisible:!member.isVisible}:
//           member
//         ))
//   }
  
//   const addImage = (memberId:number) => {
//     console.log('test')
//     navigate(`/uploadimages/${memberId}`)
//   }


//   useEffect(()=> {
//     const getMembers = async() =>{
//     try {
//       const response = await axios.get("http://127.0.0.1:5000/members/", {
//         headers:{
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setMembers(response.data)
//       console.log(response.data)
    
      
//     } catch (error:any){
    
//       console.error('Error message:', error.message);
//     }
//     // Log and extract JWT token from response
    
//   };

//   getMembers()
//   },[]);
  
//   const getMembers = async() =>{
//     try {
//       const response = await axios.get("http://127.0.0.1:5000/members/", {
//         headers:{
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const filteredMembers= response.data.filter((myMember:Member)=>
//         myMember.name.toLowerCase().includes(search.toLowerCase())
//       ||myMember.email.toLowerCase().includes(search.toLowerCase())
//       ||myMember.groups.toLowerCase().includes(search.toLowerCase())
//       ||myMember.role.toLowerCase().includes(search.toLowerCase()));
//       setMembers(filteredMembers)
    
      
//     } catch (error:any){
    
//       console.error('Error message:', error.message);
//     }
//     // Log and extract JWT token from response
    
//   };

//   useEffect(()=>{
//       getMembers()
//   },[search]);
//   const clearSearch = () => {
//     setSearch('');
   
//   }
//   const deleteMember = async(id:any) =>{
//     const confirmed = window.confirm('Are you sure you want to delete this member? This action cannot be undone!');
//     if(confirmed){
//       try {
//         await axios.delete(`http://127.0.0.1:5000/members/${id}`, {
//           headers:{
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         alert('Member has been successfully deleted.')
//         toggleIsVisible(id);
//       } catch (error:any){
      
//         console.error('Error message:', error.message);
//       }
//     }
//       // Log and extract JWT token from response
      
//   };
//   const editMember = (id:number) =>{
//     navigate(`/editmember/${id}`)
//   }
 
//   const makeInactive = async (member:Member) => {
//        try {
//       await axios.put(`http://127.0.0.1:5000/members/${member.id}`, {
//         id:`${member.id}`,
//         email: `${member.email}`,
//          name: `${member.name}`,
//         role: `${member.role}`,
//         groups: `${member.groups}`,
//         active:`${!member.active}`,
        
//       },{
//         headers:{
//           'Authorization': `Bearer ${token}`
//         }
       
//       });
  
//         toggleIsActive(member.id)
//     } catch (error:any){
//         alert(`Could not add Edit Member. ${error.message}`)
//       console.error('Error message:', error.response.data);
//       console.error('Error message:', error.message);
     
//     }
//   }
  
  
  
  
//   return (
    
//     <div>
      
//         <div className ='member-header'>
//           <div className='member-header-top'>
//             <div className='breadcrumb'>Members</div>
//             <div className='member-header-right'>
//               <div className='members-search-wrapper'>
          
//                 <input type='text' placeholder='Search members' className='member-search' onChange={(e)=>setSearch(e.target.value)} value={search}></input>
//                 <button onClick={clearSearch} className='member-search-cancel'>X</button>
               
//               </div>
          
              
//             </div>
//           </div>
//           <div className='member-header-bottom'>
//             <div>
//               <table>
//                 <tr >
//                   {activeState?
//                   (
//                     <>
//                   <td style={{ cursor: 'pointer' }} className='active-table' onClick = {toggleActiveState}>
//                      Active
//                   </td>
//                   <td  style={{ cursor: 'pointer' }}className='inactive-table' onClick = {toggleActiveState}>
//                     Inactive
//                   </td> 
//                   </>
//                   )
//                   :
//                   (
//                     <>
//                   <td  style={{ cursor: 'pointer' }} className='inactive-table' onClick = {toggleActiveState}>
//                      Active
//                   </td>
//                   <td  style={{ cursor: 'pointer' }} className='active-table' onClick = {toggleActiveState}>
//                     Inactive
//                   </td> 
//                   </>
//                   )
//                   }
//                 </tr>
//               </table>
//             </div>
//            <a href="/preaddmember"><input type='button' className='member-add member-header-right' value='+ Add Member' ></input></a>
//           </div>
//         </div>
      

      
//       <table className='table'>
          
//           <thead className="thead">
//               <tr  className='th'>
//               <th className='left-cell'></th>
//               <th >
//                 Name
//               </th>
//               <th>
//                 Email
//               </th>
//               <th>
//                 Role
//               </th>
//               <th>
//                 Groups
//               </th>
//               <th>
//                 Actions
//               </th> 
//             </tr>
//         </thead>
//         </table>
//         <div className="tbody">
//         <table className='table-in-table'>
//         <tbody>
        
//           {members?.map(member=> {
//             if (member.active!= activeState &&!member.isVisible){
//               return(
              
//             <tr key={member.id} className='tr'>
//               {!member.image?
//                   <td className='left-cell'><img className='profile-image' src={addimage} onClick={()=>addImage(member.id)}></img></td>
//                   :
//                   <td><img src={member.image} />{member.image}</td>
//               }
//               <td className='second-left-cell'><span className='member'>{member.name}</span></td>
//               <td>{member.email}</td>
//               <td>{member.role}</td>
//               <td>{member.groups}</td>
//               <td>
//                 <button onClick={()=>deleteMember(member.id)} className='delete'>Delete </button>
//                 <button className='edit' onClick={()=>editMember(member.id)}>Edit</button> 
                 
                
//                 <button onClick={()=>makeInactive(member)} className='active'>
//                   {!member.active?('Deactivate'):('Reactivate')}
//                   </button></td>
//             </tr>
//             )
//             }
            
//           })}
       
//         </tbody>
//         </table>
//         </div>


     

     
    
//     </div>
//   );
// };

// export default Members






