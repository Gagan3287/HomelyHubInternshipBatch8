//centeralized API setup

import axios from 'axios';
import qs from 'qs';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://homelyhubinternshipbatch8-ycne.onrender.com/api',
    withCredentials: true,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
})

