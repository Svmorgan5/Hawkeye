
import './Messages.css'
import member from '../../assets/member.png'
const Messages: React.FC = () => {
    return(
        <>
            <div className='message-page-container'>
                                <div className='message-inbox'>
                            
                                <p className='inbox-title'>Inbox </p>
                            <input className='inbox-search' type='text' placeholder='Search chat or contact'></input>
                                <div className='inbox-contacts'>
                                

                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>

                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>


                                    <div className="contact-holder">
                                        <div className='image-container'>
                                            <img className='contact-image' src={member}></img>
                                        </div>
                                        <div className='message-container'>
                                            <div className='contact-name'>
                                                Jane  Doe
                                            </div>
                                            <div className='the-message'>
                                                Hi, I want to make enquiries abou...
                                            </div>
                                        </div>  
                                    </div>





                                </div>
                                </div>







                                <div className='the-actual-messages'>
                                    <div className='the-actual-messages-header'>
                                        <div className='tam-header-image-container'>
                                            <img className='tam-contact-image' src={member}></img>
                                        </div>
                                        <div className='tam-info-container'>
                                            <div className='tam-info-header'>
                                                <div className='tam-contact-name'>
                                                    Jane  Doe
                                                </div>
                                                <div className='tam-contact-title'>
                                                    Teacher
                                                </div>
                                            </div>
                                            <div className='tam-status'>
                                               <div className='circle'>{'\u{1F7E2}'}</div> <div>Online</div>
                                            </div>
                                        </div> 
                                    </div>

                                    <div className='message-body-container'>
                                        <div className='incoming-message'>
                                            Hello. How are you, so nice to see you today. I was wondering what time the alert will be happening.
                                        </div>
                                        <div className='outgoing-message'>
                                            <div>
                                            Yes! It was so good to see you. I was also wondering that, and it is also here for them.
                                            </div>
                                        </div>
                                    </div>
                                </div>
        </div>
        </>
    )
}
export default Messages;