import '../../UnderConstruction.css'
import LiveStreamPlayer from '../Cameras/LiveStreamPlayer';
import unlock from '../../assets/Unlock.png'
import './CameraCard.css'

type CameraCardProps ={
  URL: string,
  status: boolean,
  location: string,
}

const CameraCard = (props:CameraCardProps) => {
  return (
    <div className="camera-card-holder">
     
        <div className='camera-card-video'>
            <LiveStreamPlayer />
        </div>
         
         <div className='card-video'>
        <table className='video-table'>
          <tr>
            <td className=' video-location td-lock'>
               <img src={unlock}></img> 
            </td>
           <td className='video-location '>
              {props.location}
            </td>
          </tr>
          <tr >
            <td className='video location td-lock'></td>
            <td className='video-info'>
              {status?'Unlocked':'Locked'}
            </td>
          </tr>
        </table>
        </div>
        
    </div>
    
  );
};

export default CameraCard;