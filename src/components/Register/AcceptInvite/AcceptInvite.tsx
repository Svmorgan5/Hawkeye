import axios from "axios"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {toast} from 'react-toastify'

const AcceptInvite: React.FC = () => {

    const { token } = useParams();
    const [inviteResults, setInviteResults] = useState<any>(null)
    const [name,setName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')
    const [phone,setPhone] = useState<string>('')
    
    

    useEffect(() => {
        axios.get(`/institutions/invite/accept/${token}`)
        .then((results)=>{
            setInviteResults(results.data)
        })
        .catch(error=>console.log(`error: ${error}`))

    },[token])

    
    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        try {
            const results = await axios.post(`http://localhost:5000/institutions/invite/accept/${token}`,
                {
                    name:`${name}`,
                    password:`${password}`,
                    phone : `${phone}`,
                
                })
        } catch (error: any) {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("Response Error:", error.response.data);
      toast.warning(`Error: ${error.response.data.error || "Something went wrong."}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No Response:", error.request);
      toast.warning("No response from server. Check if the backend is running.");
    } else {
      // Something else went wrong
      console.error("Axios Error:", error.message);
      toast.warning(`Error: ${error.message}`);
    }
  }
    }
    


    return(
        <>
        Welcome to Hawkeye! Please sign up here:
        <form onSubmit={handleSubmit}>
        Name
        <input type='text' value={name} onChange={(e)=>setName(e.target.value)}></input>
        Password
         <input type='text' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        Phone
         <input type='text' value={phone} onChange={(e)=>setPhone(e.target.value)}></input>
        <input type='submit' value='submit'></input>
        </form>

        </>
    )
}
export default AcceptInvite