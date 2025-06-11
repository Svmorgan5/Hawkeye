import '../../UnderConstruction.css'
import './Dashboard.css'
import {useState} from 'react'
type DashCardProps ={
    heading:string,
    message:string,
    picture?:string,
    link?:string,
}
const DashCard = ({heading, message, picture,link}:DashCardProps) => {
    

  



  return (
    <>
        
        <div className="card">
          <div className='card-head'>
             {heading}
             <div className='card-button'>
                <a href={link}>View</a>
            </div>
          </div>
          
          
          
          <div className='card-body'>
            <img className='card-image' src={picture}></img>
            <p className='card-text'>{message}</p>
          </div>
        </div>  
 
  </>

  


  );
};

export default DashCard;