import SignUp from "../SignUp";
import plus from '../../assets/plus for button.png'
import './Register.css'


const AddBus:React.FC = () =>{
    

    return (
        <div className='AutoLayout'>

             <p className='HAWKEYEEDS'>HAWKEYE EDS</p>
             <p className='TypeOfBuis'>Add your Business Here!</p>
             <a href='/register'>
           <button style={{cursor:'pointer'}} className='add-business'><img src={plus} width='20%' height='auto'></img>Add Business</button> 
        </a>
        <a href='/register'>
       <button style={{cursor:'pointer'}} className='add-business'><img src={plus} width='20%' height='auto'></img>Add School</button>
      </a>
       <p className='is-already-logged'>Already have an account?<a href='\signin' className='is-already-logged-a'> Login</a></p>
           
        </div>
     
    );
};

export default AddBus