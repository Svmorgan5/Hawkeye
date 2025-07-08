import './Register.css'
import axios from 'axios'
import { useState } from 'react';

   
const Register:React.FC = () =>{
     const [firstName,setFirstName] = useState<string>('')
    const [lastName,setLastName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [phone,setPhone] = useState<string>('')

type User = {
    name: string,
    email:string,
    phone:string,
}
    const handleSubmit = async (e:Event)=> {
        e.preventDefault();
        const token = sessionStorage.getItem('jwtToken_key')
        try {
        await axios.post("http://127.0.0.1:5000/users/", {

        email: `${email}`,
        name: `${firstName} ${lastName}`,
        phone: `${phone}`,
       
        
      },{
            headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            }
        });
        
        } catch (error:any){

        console.error('Error message:', error.message);
        }
    // Log and extract JWT token from response
    
  };
  

    return (
        <div className='main-page'>
        <form className="form" onSubmit={()=>handleSubmit}>
        <p className="Welcome">Welcome!</p>
        <div className='form-div'>
            <label  className='label'>Enter First Name:</label>
            <input className='text' type='text'></input>
        </div>
        <div className='form-div'>
            <label  className='label'>Enter Last Name:</label>
            <input  className='text'  type='text' value={lastName} onChange={(e)=>setLastName(e.target.value)}></input>
        </div>
        <div className='form-div'>
            <label  className='label'>E-mail Address:</label>
            <input  className='text'  type='email'></input>
        </div>
        <div className='form-div'>
            <label className='label'>Password:</label>
            <input className='text'  type='password'  ></input>
        </div>
        <div className='form-div'>
            <label className='label'>Re-Type Password:</label>
            <input className='text'  type='password'  ></input>
        </div>
        
        

         
        <div className='password-div'>
        
       
       
            <div className='password-rules'>
            <div className='password-intro'>Password Should Contain At Least:</div>
            One Number 
            <br></br>One Capital Letter 
            <br></br> One Special Charecter 
            </div>
       
            
        </div>
        
        <div className='button-container'></div>
         <button className='submit' type='submit'>
            Submit
        </button>
        <p className='already-signed'>Already a User <a href="#">Log-in</a></p> 
        
        </form>
        </div>
        
       
    );
};

export default Register