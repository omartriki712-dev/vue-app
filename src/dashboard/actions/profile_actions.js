import {BACKEND_URL} from "../../../environment.js";

const getProfile = async () => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/students/profile`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

const updateProfile = async (data) => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/auth/profile`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

export {getProfile, updateProfile};
