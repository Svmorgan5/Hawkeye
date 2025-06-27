






const MemberList = () => {



  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
 }  
 
  
  
  return (
    
   
      
      
        <form className='new-member-form' onSubmit={handleSubmit}>
            
            <label className='form-header' ><div className='header-text'>Add Member</div></label>
            <div className='div-body'>   
                Upload File (.csv or .rtf): 
                <input type='button' value='Choose File'></input>
                <input type='text' placeholder="No file Chosen"></input>
            </div>  

            <div className='form-footer'>
                <a href='/members'>
                <input
                    type="button"
                    className='cancel-button'
                    value="Cancel">
                    </input>
                </a>
                <input
                    type="submit"
                    className='save-button'
                    value="Save">
                    </input>

            </div>
         
        </form>
    
    
  )
};

export default MemberList