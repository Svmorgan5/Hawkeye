
import './LandingPage.css'
import LandingImages from '../../../assets/LandingImages.png'
import {useNavigate,Routes,Route} from 'react-router-dom'
import Dashboard from '../../Dashboard/Dashboard'
import { useEffect } from 'react'
import logo from '../../../assets/logo.png'

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
    <div className='landing-page-container'>
        <div className="desktop-header">
       <p className='HAWKEYEEDS-desktop'>HAWKEYE EDS</p>

            <div className='header-container-right'>
            
                <a className='a-landing' href="/signin">Log In</a>
                <a href='/addbus'>
                    <button className="landing-sign-up">
                    Sign Up
                    </button>
                </a>
            </div>
        </div>
        <div className='desktop-middle'>
            <img src={LandingImages} className='desktop-image'></img>
        </div>
        <div className="desktop-footer">
             <div className='desktop-footer-left'>
                <img className='desktop-logo-image' src={logo}></img>
            </div>
        </div>
    </div>
    
    )
    }
    </>

  );
};

export default LandingPage;