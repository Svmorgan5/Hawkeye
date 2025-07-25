import './Video.css'
import pic1 from '../../assets/Rectangle 2.png'
import pics2 from '../../assets/Rectangle 22.png'
import pics3 from '../../assets/Rectangle 2222.png'
import pics4 from '../../assets/Rectangle 2222222.png'
import VideoCard from './VideoCard/VideoCard'

const Video = () => {
  return (
   <div>
      <div className='video-header'>
        <div className='video-header-top'>
          <div className='breadcrumb'>Training/Videos</div>
          <div className='video-header-right'>
            <div className='video-search-wrapper'>
              <input
                type='text'
                placeholder='Search Training Videos'
                className='video-search'
                // onChange={(e) => setSearch(e.target.value)}
                // value={search}
              />
              <button /*onClick={clearSearch}*/ className='video-search-cancel'>X</button>
            </div>
          </div>
        </div>

      <div className='video-tutorials-body'>
      <div className='video-heading'>Video Tutorials</div>
    
   
     <div className='video-intro-par'>Welcome to our Video Tutorials section! Here, you'll find a collection of easy-to-follow videos designed to help you master the tools and features of our system. Whether you're new or just need a refresher, these tutorials will guide you through everything you need to know.</div>
      <div className='video-choice-container'>
        <div className='video-choice-item'>Identifying Potential Threats </div>
        <div className='video-choice-item'>Emergency Lockdown Procedures</div>
        <div className='video-choice-item'>Responding to Active Threats </div>
        <div className='video-choice-item'>Handling Suspicious Behavior </div>
        <div className='video-choice-item'>Evacuation Protocols</div>
        <div className='video-choice-item'>Crisis Communication Strategies </div>
        <div className='video-choice-item'>Law Enforcement </div>
        <div className='video-choice-item'>Intruder Detection and Response </div>
        <div className='video-choice-item'>Preventing Unauthorized Access </div>
        <div className='video-choice-item'>Incident Guidelines</div>
    </div> 


<div className='video-card-holder'>
<div><VideoCard heading='Evacuation Protocols' message='Learn what to do in an Evacuation' picture={pic1} /></div>
<div><VideoCard heading='Evacuation Protocols' message='Learn what to do in an Evacuation' picture={pics2} /></div>
<div><VideoCard heading='Evacuation Protocols' message='Learn what to do in an Evacuation' picture={pics3} /></div>
<div><VideoCard heading='Evacuation Protocols' message='Learn what to do in an Evacuation' picture={pics4} /></div>

</div>

</div>

    </div>
    <div className='video-card-button-holder'><input className='video-card-button' type='button'  value='See all' />
    </div>
    </div>
  );
};

export default Video;