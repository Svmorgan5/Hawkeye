import '../../UnderConstruction.css'
import CameraCard from './CameraCard'
import './Camera.css'

const Cameras = () => {
  return (
    <div className="under-construction">
      <h1>🚧 Cameras Under Construction 🚧</h1>
      <p>Please come back soon!</p>
      <div className='camera-cards-holder'>
       <div className='camera-cards-element'> <CameraCard /></div>
      <div className='camera-cards-element'> <CameraCard /></div>
      <div className='camera-cards-element'> <CameraCard /></div>
      </div>
      <div className='camera-cards-holder'>
      <div className='camera-cards-element'> <CameraCard /></div>
      <div className='camera-cards-element'> <CameraCard /></div>
      <div className='camera-cards-element'> <CameraCard /></div>
      </div>
    </div>
  );
};

export default Cameras;