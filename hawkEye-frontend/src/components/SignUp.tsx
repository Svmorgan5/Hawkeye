
import './signUp.css'



export interface SignInProps{
    message:string,
    button?: React.ReactElement;
}

const SignUp:React.FC<SignInProps>=({message,button}) =>{
    return (
        <div className='AutoLayout'>
             <p className='HAWKEYEEDS'>HAWKEYE EDS</p>
             <p className='TypeOfBuis'>{message}</p>
             {button}
           
        </div>
       
    )
}
export default SignUp

