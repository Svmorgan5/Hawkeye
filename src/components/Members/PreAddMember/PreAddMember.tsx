
import memberman from '../../../assets/memberman.png'
import './PreAddMember.css'
import '../Member/Members.css'
const PreAddMember = () => {
  return (
    <div className="member-main">
        <div className='img'><img  src={memberman}  ></img></div>
        <div className='member-main-text member-div'>Members</div><br></br>
        <div className='member-div member-notice'>Click to include a new member in the system.</div><br></br>
        <a className='a' href="/addmember"><input type='button' className='member-add member-header-right member-add-preadd' value='+ Add Member' ></input></a><br></br>
        <div className='member-div bottom'>OR<br></br>
        Import Members List <a href="/memberlist">From Here</a></div>
    </div>
  );
};

export default PreAddMember;