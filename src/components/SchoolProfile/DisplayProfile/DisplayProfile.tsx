
import { useState, useEffect } from "react"
import axios from "axios"
import { useInstitutionContext } from "../../../Context/InstitutionContext"

type Institution = {
    id: number;
    name: string;
    image: string;
    address:string;
    phone:string;
}




const DisplayProfile:React.FC = () =>{
   const {instId,instName,instType,instAddress,instPhone,instLogo,instImage1,instImage2,dispatch:institutionDispatch} = useInstitutionContext();
    const token = sessionStorage.getItem('jwtToken_key')
  
    return(
        <>
        Logo
        {instLogo?(<img style={{width:'80px',height:'auto'}} src={instLogo}></img>):('No image')}<br></br>
        Name:
        {instName}<br></br>
        Address:
        {instAddress}<br></br>
        Phone:
        {instPhone}<br></br>
        Map 1:
        {instImage1?(<img style={{width:'80px',height:'auto'}} src={instImage1}></img>):('No image')}<br></br>
        Map 2:
        {instImage2?(<img style={{width:'80px',height:'auto'}} src={instImage2}></img>):('No image')}<br></br>
        </>
    )
}
export default DisplayProfile
