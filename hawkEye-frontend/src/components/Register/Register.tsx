import './Register.css'

const Register:React.FC = () =>{
    

    return (
        <div className='main-page'>
        <form className="form">
        <p className="Welcome">Welcome!</p>
        <div className='form-div'>
            <label  className='label'>Enter First Name:</label>
            <input className='text' type='text'></input>
        </div>
        <div className='form-div'>
            <label  className='label'>Enter Last Name:</label>
            <input  className='text'  type='text'></input>
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