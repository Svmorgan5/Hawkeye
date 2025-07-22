import '../../Members/PreAddMember/PreAddMember.css'
import image from '../../../assets/Frame 2610514.png'

const NewInstBlank = () => {
  return (
    <div className="member-main">
        <div className='img'><img src={image}  ></img></div>
        <div className='member-main-text member-div'>School or Business Profile</div><br></br>
        <div className='member-div member-notice'>Click to add you School or Business Profile</div><br></br>
        <a className='a' href="/addmember"><input type='button' className='member-add member-header-right member-add-preadd' value='+ Add Profile' ></input></a><br></br>
    
    </div>
  );
};

export default NewInstBlank;