const getMembers = async (searchTerm = '') => {
  try {
    // URL with search parameter if provided
    let url = "http://127.0.0.1:5000/institutions/members/";
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
        // No Content-Type needed for GET requests
      }
    });
    
    return response.data; // Backend already filtered and processed
    
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};