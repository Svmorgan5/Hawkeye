import './Register.css'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Dashboard from '../Dashboard/Dashboard';
import App from '../../App';
import NavBar from '../NavBar/NavBar';
import Header from '../../Header/Header';
import '../../App.css'
import { useTokenContext } from '../../Context/Context';
import SignUp from '../SignUp';
import TheSignUp from '../../pages/TheSignUp/TheSignUp';

// import User from './User';



const SignIn:React.FC = () =>{
    
  

  // State variables to store user credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {token, userName, dispatch} = useTokenContext();
  
  const navigate = useNavigate();
  
  
  // Function to handle form submission and obtain JWT token from reqres.in
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();    


    try {
      // Make a POST request to your login endpoint with user credentials
      const response = await axios.post("http://127.0.0.1:5000/users/login", {
  email,
  password,
  
})
      
      // Log and extract JWT token from response
      console.log("The returned data ", response.data)
      const jwtToken = response.data.token;
      sessionStorage.setItem('jwtToken_key', jwtToken);
      dispatch({type:'SET_TOKEN',payload:jwtToken})
      // dispatch({type:'SET_USER_NAME',payload:jwtToken})
      
      
      
      
      // Set the token so the User component will show up on the page
     
      
      // Store JWT token in local storage or state for future use
      // You can see this by going to:
      // developer tools | Application tab | Session Storage dropdown
      
      // Optional: Redirect user to another page upon successful login
      // history.push('/dashboard');
 
       
    
    } catch (error) {
      console.error('Login failed:', error);
    }finally{
      navigate('/')
    }
  };


//   const logoutUser = () => {
//     // Clear JWT from session storage
//     sessionStorage.clear();
//     setToken("")
//   };
 






//           <label htmlFor="password">Password:</label>
//           <input type="password" id="password" value={password}
//             onChange={(e) => setPassword(e.target.value)} />

//         <button type="submit">Login</button>
//       </form>
//      



    return (
      
      
           <div className="container-signin">
              <div className="div-left-signin" >
       
                <SignUp message='Log  in!' />
              </div>
       <div className='div-right-signin'>
        <form className="form" onSubmit={handleLogin}>
        <p className="Welcome">Welcome Back! <br></br>Please Log In:</p>
     


        <div className='form-div'>
            <label  className='label'>User Name:</label>
            <input  className='text'  type='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className='form-div' style={{paddingBottom:'35px'}}>
            <label className='label-signin'>Password:</label>
            <input className='text'  type='password' value={password} onChange={(e) => setPassword(e.target.value)} ></input>
        </div>
        
        
        
        <div className='button-container'></div>
         <button className='submit-register' type='submit' style={{marginLeft:'145px'}}>
            Submit
        </button>
        <p className='already-signed'>Not a user yet? Click here to <a href="/register" className='a-login'>Register</a></p> 
        
        </form>
         {/* <button onClick={logoutUser}>Logout</button>
//       {token &&
//         <User />
//       }   */}
        </div>
      </div>

  
       
    );
};

export default SignIn