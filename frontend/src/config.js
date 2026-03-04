const isLocalhost = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.');

const API_URL = isLocalhost
    ? 'http://localhost:5000/api/users'
    : 'https://backend-payment-b6h8.onrender.com/api/users';

export default API_URL;
