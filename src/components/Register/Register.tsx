import './Register.css'
import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TheSignUp from '../../pages/TheSignUp/TheSignUp';
import {toast} from 'react-toastify'

   
const Register:React.FC = () =>{
     const [firstName,setFirstName] = useState<string>('')
    const [lastName,setLastName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [phone,setPhone] = useState<string>('')
     const [password,setPassword] = useState<string>('')
     const [role,setRole] = useState<string>('Admin')
     const [passwordConfirm,setPasswordConfirm] = useState<string>('')
     const [submitData, setSubmitData] = useState<boolean>(false)
     const navigate = useNavigate()

type User = {
    name: string,
    email:string,
    phone:string,
    password:string,
    role:string,
}
    const handleSubmit = async (e:React.FormEvent)=> {

        e.preventDefault();
        const token = sessionStorage.getItem('jwtToken_key')
        

        if(password!=passwordConfirm){
            toast.warning('Passwords do not match');
            setSubmitData(false);
        }
        else if(firstName===''){
            toast.warning('First Name Missing');
            setSubmitData(false);
            console.log(`firstName:${firstName}`)
        }
        else if(lastName==='')
            {
            toast.warning('Last Name Missing');
            setSubmitData(false);
        }
        else if(email==='')
            {
            toast.warning('Email Missing');
            setSubmitData(false);
        }
        else if(role==='')
            {
            toast.warning('Role Missing');
            setSubmitData(false);
        }
        else if(password==='')
            {
            toast.warning('Password Missing');
            setSubmitData(false);
        }
        else
            setSubmitData(true)

        if(submitData===true)
        {
                try {
                await axios.post("http://127.0.0.1:5000/users/", {

                email: `${email}`,
                name: `${firstName} ${lastName}`,
                password: `${password}`,
                role:`${role}`,
            
                
            },{
                    headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    }
                });
                toast.success('New User has been created! You are now being redirected to login page to log in');
                setFirstName('');
                setLastName('');
                setPassword('');
                setEmail('');
                setPhone('');
                setRole('');
                setPasswordConfirm('');
                navigate('/signin')
                } catch (error) {
                if (axios.isAxiosError(error)) {
                    // Most likely a backend response error
                    if (error.response) {
                        console.error("Backend responded with an error:", error.response.data);
                        toast.warning(`Error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
                    } else if (error.request) {
                        console.error("Request made but no response received:", error.request);
                        toast.warning("No response from the server. Please try again later.");
                    } else {
                        console.error("Error in setting up the request:", error.message);
                        toast.warning(`Request error: ${error.message}`);
                    }
                } else {
                    console.error("Unexpected error:", error);
                    toast.warning("An unexpected error occurred.");
                }
            }
        }
        
        
            // Log and extract JWT token from response
    
  };
  

    return (
        <div className="container-signin">
            <div className="div-left-signin" >
       
            <TheSignUp />
            </div>
       <div className='div-right-signin'>
        <form style={{'marginTop':'-150px'}} className="form" onSubmit={handleSubmit}>
        <p className="Welcome-signup">Welcome!</p>
         
        <div className='form-div'>
            <div><label  className='label'>Buisness Type:</label></div>
            <div className='form-div-top'><div><input type='radio'  className='bus-type' name="bus-type"></input>School</div><div>
          <input type='radio' name='bus-type' className='bus-type'></input>Other Business Type</div></div>
            
        </div>
        <div className='form-div'>
            <label  className='label'>Enter First Name:</label>
            <input className='text' type='text' value={firstName} onChange={(e)=>setFirstName(e.target.value)}></input>
        </div>
        <div className='form-div'>
            <label  className='label'>Enter Last Name:</label>
            <input  className='text'  type='text' value={lastName} onChange={(e)=>setLastName(e.target.value)}></input>
        </div>
        
        <div className='form-div'>
            <label  className='label'>E-mail Address:</label>
            <input  className='text'  type='email' value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        </div>
        <div className='form-div'>
            <label className='label'>Password:</label>
            <input className='text'  type='password'  value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        </div>
        <div className='form-div'>
            <label className='label'>Re-Type Password:</label>
            <input className='text'  type='password'  value={passwordConfirm} onChange={(e)=>setPasswordConfirm(e.target.value)}></input>
        </div>
        
        

         
        <div className='password-div'>
        
       
       
            <div className='password-rules'>
            <div className='password-intro'>Password Should Contain At Least:</div>
            One Number 
            <br></br>One Capital Letter 
            <br></br> One Special Charecter 
            </div>
       
            
        </div>
        
        
         <button className='submit' type='submit' onClick={handleSubmit}>
            Submit
        </button>
        
      <div className='already-signed-container'>
        <p className='already-signed'>Already a User <a href="signin" className='a-login'>Log-in</a></p> 
        </div>
       
        </form>
        </div>
        </div>
       
    );
};

export default Register