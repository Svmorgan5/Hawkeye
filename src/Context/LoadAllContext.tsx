
import { useTokenContext } from "./Context";
import { useInstitutionContext } from "./InstitutionContext";
import axios from "axios";
import { useEffect } from "react";



const LoadAllContext = () => {
    const {token, user_id, user_name, user_institution_id, user_image, dispatch:tokenDispatch} = useTokenContext();
  const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext(); 

    useEffect(()=>{
      
        const getInstitution = async() =>
        {
        console.log(`test:${instId}`)
          if(instId || !token)
            return;
            try {
              const response = await axios.get("http://127.0.0.1:5000/institutions/", {
              headers: {
              'Authorization': `Bearer ${token}`
                      }
                })
        
        institutionDispatch({type:"SET_INST_ID",payload:response.data.id});
        institutionDispatch({type:"SET_INST_NAME",payload:response.data.name})
        institutionDispatch({type:"SET_IS_SCHOOL",payload:response.data.is_school})
        institutionDispatch({type:"SET_INST_ADDRESS",payload:response.data.address})
        institutionDispatch({type:"SET_INST_PHONE",payload:response.data.phone})
        institutionDispatch({type:"SET_INST_LOGO",payload:response.data.logo})
        institutionDispatch({type:"SET_INST_IMAGE1",payload:response.data.image1})
        institutionDispatch({type:"SET_INST_IMAGE2",payload:response.data.image2})
        tokenDispatch({type:"SET_USER_IMAGE",payload:response.data.user_image})
        tokenDispatch({type:"SET_USER_NAME",payload:response.data.user_name})
        tokenDispatch({type:"SET_USER_ID",payload:response.data.user_id})
        

       
        //tokenDispatch({type:"SET_USER_NAME"})
      
        } catch (error: any) {
        console.error('Error message:', error.message);
        }

    
       
    }
      getInstitution();
    },[]);
  return null;
}

export default LoadAllContext