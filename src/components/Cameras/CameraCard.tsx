import '../../UnderConstruction.css'
import LiveStreamPlayer from '../Cameras/LiveStreamPlayer';
import unlock from '../../assets/Unlock.png'
import lock from '../../assets/lock.png'
import './CameraCard.css'
import LiveStreamBlocked from '../Cameras/LiveStreamBlocked';

type CameraCardProps ={
  URL: string,
  status: boolean|any,
  location: string,
  name:string
}

const CameraCard = (props:CameraCardProps) => {
  return (
    <div className="camera-card-holder">
     
        <div className='camera-card-video'>
            {props.status?<LiveStreamBlocked />:<LiveStreamPlayer URL={props.URL} status={false} location={props.location} name={props.name}/>}
        </div>
         
         <div className='card-video'>
        <table className='video-table'>
          <tr>
            <td className=' video-location td-lock'>
               <img className='lock-image' src={props.status?(`${lock}`):(`${unlock}`)}></img> 
            </td>
           <td className='video-location '>
              {props.location}
            </td>
          </tr>
          <tr >
            <td className='video location td-lock'></td>
            <td className='video-info'>
              {props.status?'Locked':'Unlocked'}
            </td>
          </tr>
        </table>
        </div>
        
    </div>
    
  );
};

export default CameraCard;