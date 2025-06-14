import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://64.225.55.178:3000/api/v1', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
