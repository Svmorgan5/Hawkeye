
import memberman from '../../../assets/memberman.png'
import './PreAddMember.css'
import '../Member/Members.css'
const PreAddMember = () => {
  return (
    <div className="member-main">
        <div className='img'><img  src={memberman}  ></img></div>
        <div className='member-main-text member-div'>Members</div>
        <div className='member-div'>Click to include a new member in the system.</div>
        <a href="/addmember"><input type='button' className='member-add member-header-right add-button' value='+ Add Member' ></input></a>
        <div className='member-div'>Import Member's List <a href="/#">From Here</a></div>
    </div>
  );
};

export default PreAddMember;