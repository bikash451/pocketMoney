import axios from "axios";

// const API_URL = "https://pocketmoney-nvc0.onrender.com/api-v1";
// const API_URL = "http://localhost:3000/api-v1";

const API_URL = "https://pocketmoney-wxw3.onrender.com/api-v1";
const api = axios.create({
    baseURL: API_URL,
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export default api;