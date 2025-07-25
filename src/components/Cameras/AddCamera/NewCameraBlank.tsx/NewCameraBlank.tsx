
import camera from '../../../../assets/camera.png'

       

const NewCameraBlank = () => {
  
  return (
 
   

 
    <div className="member-main">
        <div className='img'><img   src={camera} ></img></div>
        <div className='member-main-text member-div'>Cameras</div><br></br>
        <div className='member-div member-notice'>Click to add a new Camera into the system.</div><br></br>
        <a className='a' href="/addcamera"><input type='button' className='member-add member-header-right member-add-preadd' value='+ Add Camera' ></input></a><br></br>
    
  </div>
  );
};



export default NewCameraBlank




