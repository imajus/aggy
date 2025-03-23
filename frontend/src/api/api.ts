import axios from 'axios';

const API_BASE_URL = 'https://your-api-url.com'; // Replace with your API base URL

// Example function to fetch data with authorization
export async function fetchData(endpoint: string, token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the authorization token
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
} 