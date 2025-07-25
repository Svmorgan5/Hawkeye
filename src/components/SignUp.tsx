
import './signUp.css'



export interface SignInProps{
    message:string,
    button?: React.ReactElement;
    button2?:React.ReactElement;
    message2?: string;
    myLink?: React.ReactElement
}

const SignUp:React.FC<SignInProps>=({message,button,button2,message2,myLink}) =>{
    return (
        <div className='AutoLayout'>
             <p className='HAWKEYEEDS'>HAWKEYE EDS</p>
             <p className='TypeOfBuis'>{message}</p>
             {button}
             {button2}
             {message2}
             {myLink}
           
        </div>
       
    )
}
export default SignUp

