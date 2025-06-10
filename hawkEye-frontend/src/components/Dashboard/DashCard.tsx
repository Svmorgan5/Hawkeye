import '../../UnderConstruction.css'
import './Dashboard.css'
import {useState} from 'react'
type DashCardProps ={
    heading:string,
    message:string,
}
const DashCard = ({heading, message}:DashCardProps) => {
    

  



  return (
    <>
        
        <div className="card">
          <div className='card-head'>
             {heading}
             <div className='card-button'>
                View
            </div>
          </div>
          
          <div className='card-body'>
            {message}
          </div>
        </div>  
 
  </>

  


  );
};

export default DashCard;