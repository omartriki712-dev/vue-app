import {BACKEND_URL} from "../../../environment.js";

export async function getModules(filter) {
    const access = localStorage.getItem('access');
    const query = (new URLSearchParams(filter)).toString();
    console.log(query);
    return await fetch(`${BACKEND_URL}/modules?${query}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access}`
        }
    }).then(res => res.json());
}

export const getModule = async (id) => {
    const access = localStorage.getItem('access');
    return await fetch(`${BACKEND_URL}/modules/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access}`
        }
    }).then(res => res.json())
}
