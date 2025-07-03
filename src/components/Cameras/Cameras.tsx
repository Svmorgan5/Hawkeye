import '../../UnderConstruction.css'
import CameraCard from './CameraCard'
import './Camera.css'

const Cameras = () => {
  return (
    <div className="under-construction">
    <div className='camera-cards-page'>
      <div className='camera-cards-holder'>
       <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Kitchen' status={true} /></div>
      <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Hallway' status={true} /></div>
      <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Room 501' status={true} /></div>
      </div>
      <div className='camera-cards-holder'>
      <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Main Office' status={false} /></div>
      <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Parking Lot' status={true} /></div>
      <div className='camera-cards-element'><CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Principal Office' status={true} /></div>
      </div>
      <div className='camera-cards-holder'>
      <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Main Office' status={false} /></div>
      <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Parking Lot' status={true} /></div>
      <div className='camera-cards-element'><CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Principal Office' status={true} /></div>
      </div>
      <div className='camera-cards-holder'>
      <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Main Office' status={false} /></div>
      <div className='camera-cards-element'> <CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Parking Lot' status={true} /></div>
      <div className='camera-cards-element'><CameraCard URL='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' location='Principal Office' status={true} /></div>
      </div>
      </div>
    </div>
  );
};

export default Cameras;