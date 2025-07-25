import '../../UnderConstruction.css'
import './Dashboard.css'
import {useState} from 'react'
type DashCardProps ={
    heading:string,
    message:string,
    picture?:string,
    link?:string,
    sizing?:string,
}
const DashCard = ({heading, message, picture,link,sizing}:DashCardProps) => {
    

  



  return (
    <>
        
        <div className={`card ${sizing}`}>
          <div className={`card-head ${sizing}`}>
             <div  className={`split-div ${sizing}`}>{heading}</div>
             <div className={`card-button split-div ${sizing}`}>
                <a className={`a ${sizing}`} href={link}>View</a>
            </div>
          </div>
          
          
          
          <div className={`card-body ${sizing}`}>
            <img className='card-image' src={picture}></img>
            <p className='card-text'>{message}</p>
          </div>
        </div>  
 
  </>

  


  );
};

export default DashCard;