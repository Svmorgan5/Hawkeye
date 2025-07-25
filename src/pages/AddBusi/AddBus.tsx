import SignUp from "../../components/SignUp";
import plus from '../../assets/plus for button.png'


const AddBus:React.FC = () =>{
    

    return (
        <SignUp 
        message='Add your Business Here!' 
        button={<button className='AddBusiness'><img src={plus} width='10%' height='auto'></img>Add Business</button>} />
    );
};

export default AddBus