import './Header.css'
import { useTokenContext } from '../Context/Context';
import { useInstitutionContext } from '../Context/InstitutionContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import {ToastContainer, toast} from 'react-toastify'
import {io } from 'socket.io-client';

const Header = () => {

const {token, user_id, user_name, user_institution_id, user_image, dispatch:tokenDispatch} = useTokenContext();
  const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext(); 
  const navigate=useNavigate(); 
  
  
  
  const logout = async (e: React.FormEvent) => {
   
    e.preventDefault();  
       
    try {
      await axios.post("http://127.0.0.1:5000/users/logout",{}, {
        headers:{
          'Authorization': `Bearer ${token}`,
        }
        
      });
      sessionStorage.clear(),
      tokenDispatch({type:"CLEAR_USER"}),
      institutionDispatch({type:"CLEAR_INSTITUTION"});
      toast.success('Logout Succesful!')
      navigate('/')
      
       
      
    } catch (error:any){
        toast.warning(`Regular logout failed. ${error.message}. Forcing Logout.`)
        tokenDispatch({type:"CLEAR_USER"}),
        tokenDispatch({type:"CLEAR_USER"}),
        institutionDispatch({type:"CLEAR_INSTITUTION"});
      toast.success('Logout Succesful!')
      console.error('Error message:', error.message);
    }
    // Log and extract JWT token from response
    
  };
return (
    <div className="desktop-header">
        <div className='search-wrapper'>
            
            <input type='search' placeholder='Search' className='search-bar'>
            </input> 
            <button className='search-button-header'>
                
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2125 13.3516L10.1547 9.29375C10.7844 8.47969 11.125 7.48438 11.125 6.4375C11.125 5.18438 10.6359 4.00937 9.75156 3.12344C8.86719 2.2375 7.68906 1.75 6.4375 1.75C5.18594 1.75 4.00781 2.23906 3.12344 3.12344C2.2375 4.00781 1.75 5.18438 1.75 6.4375C1.75 7.68906 2.23906 8.86719 3.12344 9.75156C4.00781 10.6375 5.18438 11.125 6.4375 11.125C7.48438 11.125 8.47813 10.7844 9.29219 10.1562L13.35 14.2125C13.3619 14.2244 13.376 14.2338 13.3916 14.2403C13.4071 14.2467 13.4238 14.2501 13.4406 14.2501C13.4575 14.2501 13.4741 14.2467 13.4897 14.2403C13.5052 14.2338 13.5194 14.2244 13.5312 14.2125L14.2125 13.5328C14.2244 13.5209 14.2338 13.5068 14.2403 13.4912C14.2467 13.4757 14.2501 13.459 14.2501 13.4422C14.2501 13.4254 14.2467 13.4087 14.2403 13.3931C14.2338 13.3776 14.2244 13.3635 14.2125 13.3516ZM8.9125 8.9125C8.25 9.57344 7.37187 9.9375 6.4375 9.9375C5.50312 9.9375 4.625 9.57344 3.9625 8.9125C3.30156 8.25 2.9375 7.37187 2.9375 6.4375C2.9375 5.50312 3.30156 4.62344 3.9625 3.9625C4.625 3.30156 5.50312 2.9375 6.4375 2.9375C7.37187 2.9375 8.25156 3.3 8.9125 3.9625C9.57344 4.625 9.9375 5.50312 9.9375 6.4375C9.9375 7.37187 9.57344 8.25156 8.9125 8.9125Z" fill="#262626"/>
                </svg>
            </button>
        </div>
        <div className="school-wrapper">
            
            <img width="45" height="auto"  src={instLogo}></img>
            <div className='school-text'> 
            {instName}
            </div>

        </div>
        <div className='header-container-right'>
           
             <div className='header-name-display'><p onClick={logout}>Logout</p></div> 
            {/* <div className='header-name-display'>{user_name}</div> */}
            <div className='lockdown-button' onClick={()=>toast.warning('Lockdown functionality has not yet been implemented.')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.9327 13.375L8.43272 2.125C8.33584 1.95781 8.16866 1.875 7.99991 1.875C7.83116 1.875 7.66241 1.95781 7.56709 2.125L1.0671 13.375C0.874908 13.7094 1.11553 14.125 1.49991 14.125H14.4999C14.8843 14.125 15.1249 13.7094 14.9327 13.375ZM7.49991 6.5C7.49991 6.43125 7.55616 6.375 7.62491 6.375H8.37491C8.44366 6.375 8.49991 6.43125 8.49991 6.5V9.375C8.49991 9.44375 8.44366 9.5 8.37491 9.5H7.62491C7.55616 9.5 7.49991 9.44375 7.49991 9.375V6.5ZM7.99991 12C7.80365 11.996 7.61677 11.9152 7.47939 11.775C7.34201 11.6348 7.26506 11.4463 7.26506 11.25C7.26506 11.0537 7.34201 10.8652 7.47939 10.725C7.61677 10.5848 7.80365 10.504 7.99991 10.5C8.19617 10.504 8.38304 10.5848 8.52042 10.725C8.65781 10.8652 8.73475 11.0537 8.73475 11.25C8.73475 11.4463 8.65781 11.6348 8.52042 11.775C8.38304 11.9152 8.19617 11.996 7.99991 12Z" fill="white"/>
            </svg>
            
            Activate Lockdown
            </div>
        </div>
    </div>
  );
};

export default Header;