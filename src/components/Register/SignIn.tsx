import './Register.css'
import { useState } from 'react';
import axios from 'axios';
// import User from './User';


const SignIn:React.FC = () =>{
    

  // State variables to store user credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('')


  // Function to handle form submission and obtain JWT token from reqres.in
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();    


    try {
      // Make a POST request to your login endpoint with user credentials
      const response = await axios.post("http://127.0.0.1:5000/users/login", {
  email,
  password
})
      // Log and extract JWT token from response
      console.log("The returned data ", response.data)
      const jwtToken = response.data.token;
      // Set the token so the User component will show up on the page
      setToken(jwtToken)

      // Store JWT token in local storage or state for future use
      // You can see this by going to:
      // developer tools | Application tab | Session Storage dropdown
      sessionStorage.setItem('jwtToken_key', jwtToken);
      // Optional: Redirect user to another page upon successful login
      // history.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
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
        <div className='main-page'>
        <form className="form" onSubmit={handleLogin}>
        <p className="Welcome">Login Here:</p>
     


        <div className='form-div'>
            <label  className='label'>User Name:</label>
            <input  className='text'  type='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className='form-div'>
            <label className='label'>Password:</label>
            <input className='text'  type='password' value={password} onChange={(e) => setPassword(e.target.value)} ></input>
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
        <p className='already-signed'>Not a user yet? Click here to <a href="#">register</a></p> 
        
        </form>
         {/* <button onClick={logoutUser}>Logout</button>
//       {token &&
//         <User />
//       }   */}
        </div>
        
       
    );
};

export default SignIn