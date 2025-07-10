
import './Messages.css'
import avatar3 from '../../assets/Avatar3.png'
const Messages: React.FC = () => {
    return(
        <>
        <div className='message-inbox'>
       <p className='inbox-title'>Inbox </p>
       <input className='inbox-search' type='text' placeholder='Search char or contact'></input>
        <div className='inbox-contacts'>
            <div className="contact-holder">
                <div >
                    <img className='contact-image' src={avatar3}></img>
                </div>
                <div className='contact-name'>
                    Jane  Doe
                </div>
                <div>
                    Hi, I want to make enquiries abou...
                </div>
            </div>

             <div className="contact-holder">
                <div >
                    <img className='contact-image' src={avatar3}></img>
                </div>
                <div className='contact-name'>
                    Jane  Doe
                </div>
                <div>
                    Hi, I want to make enquiries abou...
                </div>
            </div>

             <div className="contact-holder">
                <div >
                    <img className='contact-image' src={avatar3}></img>
                </div>
                <div className='contact-name'>
                    Jane  Doe
                </div>
                <div>
                    Hi, I want to make enquiries abou...
                </div>
            </div>

             <div className="contact-holder">
                <div >
                    <img className='contact-image' src={avatar3}></img>
                </div>
                <div className='contact-name'>
                    Jane  Doe
                </div>
                <div>
                    Hi, I want to make enquiries abou...
                </div>
            </div>

             <div className="contact-holder">
                <div >
                    <img className='contact-image' src={avatar3}></img>
                </div>
                <div className='contact-name'>
                    Jane  Doe
                </div>
                <div>
                    Hi, I want to make enquiries abou...
                </div>
            </div>

             <div className="contact-holder">
                <div >
                    <img className='contact-image' src={avatar3}></img>
                </div>
                <div className='contact-name'>
                    Jane  Doe
                </div>
                <div>
                    Hi, I want to make enquiries abou...
                </div>

                 <div className="contact-holder">
                <div >
                    <img className='contact-image' src={avatar3}></img>
                </div>
                <div className='contact-name'>
                    Jane  Doe
                </div>
                <div>
                    Hi, I want to make enquiries abou...
                </div>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}
export default Messages;