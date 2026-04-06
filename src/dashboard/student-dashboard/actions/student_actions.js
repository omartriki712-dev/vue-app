import {BACKEND_URL} from "../../../../environment.js";

const getProfile = async () => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/auth/profile`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}
const updateProfile = async (profileData) => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/students/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`
        },
        body: JSON.stringify(profileData)
    });
    return await res.json();
}

export {getProfile, updateProfile};
