import {BACKEND_URL} from "../../../../environment.js";

const getModules = async (filter) => {
    const access = localStorage.getItem('access');
    const query = (new URLSearchParams(filter)).toString()
    const res = await fetch(`${BACKEND_URL}/modules?${query}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

const getModuleDetails = async ({moduleId}) => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/modules/${moduleId}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

const updateModule = async ({moduleId}) => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/modules/${moduleId}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

const deleteModule = async (id) => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/modules/${moduleId}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

export {getModules, getModuleDetails, updateModule, deleteModule};
