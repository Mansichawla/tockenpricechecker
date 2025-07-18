import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/', // backend runs on port 5000
});

// GET /price
export const fetchPrice = async ({ token, network, timestamp }) => {
  const response = await API.get('/price', {
    params: { token, network, timestamp },
  });
  return response.data;
};

// POST /schedule
export const scheduleFetch = async ({ token, network }) => {
  const response = await API.post('/schedule', { token, network });
  return response.data;
};
