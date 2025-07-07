
import './LandingPage.css'
import LandingImages from '../../../assets/LandingImages.png'
import {useNavigate,Routes,Route} from 'react-router-dom'
import Dashboard from '../../Dashboard/Dashboard'
import { useEffect } from 'react'

const LandingPage = () => {
    const navigate=useNavigate()
    const token = sessionStorage.getItem('jwtToken_key')
    
    useEffect(()=>{
        if(token)
        navigate('/')
    },[token])
  return (
    <>
  
       
    
    {!token&&
        
    
    (
    <div>
        <div className="desktop-header">
        

        <div className='header-container-right'>
            
        <a className='a-landing' href="/signin">Log In</a>
        <a href='register'>
        <button className="landing-sign-up">
            Sign Up
        </button>
        </a>
        </div>
    </div>
        <img src={LandingImages} style={{width:"100%"}}></img>
 <div className="desktop-header">
        

        <div className='header-container-right'>
            
            
        </div>
    </div>
    </div>
    
    )
    }
    </>

  );
};

export default LandingPage;