import '../../UnderConstruction.css'
import LiveStreamPlayer from '../Cameras/LiveStreamPlayer';
import unlock from '../../assets/Unlock.png'
import './CameraCard.css'

const CameraCard = () => {
  return (
    <div className="camera-card-holder">
  
        <div className='camera-card-video'>
            <LiveStreamPlayer />
        </div>
        <div className='card-video'>

            <img src={unlock}></img> 
            Lunch Room
       
        </div>
    </div>
  );
};

export default CameraCard;