import './Reports.css'
const Reports = () => {
  return (
    <div >
    
    <table className='reports-table'>
      <thead className='reports-thead'>
        <th></th><th> Date</th><th> Incident</th><th>Threath level</th><th>Reported by:</th><th> Images</th><th className='reports-right-cell'>Narrative</th>
      </thead>
      <tbody>
        <tr>
        <td>
          Plsu box
        </td>
        <td>
          2024-09-04 
14:30
        </td>
        <td>
          Weapon
        </td>
        <td>
          Medium Threat
        </td>
        <td>
          NA
        </td>
       
        
        <td>
          <img></img>
        </td>
        <td className='reports-right-cell'>
          A parent arrived to pick up their child at the front entrance.  The system detected a small pocket knife in a holster on the side of the parent’s belt.
        </td>
        </tr>
      </tbody>
      
    </table>

    </div>
  );
};

export default Reports;