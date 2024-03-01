import axios from 'axios';
import { BASE_URL, ADMIN_BASE_URL } from '../constants';

export default axios.create({
  baseURL: BASE_URL,
});

export const ADMIN_API = axios.create({
  baseURL: ADMIN_BASE_URL,
});

export const IP_API = axios.create({
  baseURL: 'https://api.ipgeolocation.io/ipgeo?apiKey=d08628d29e25441d839b4f5d63a6f4fa'
});
