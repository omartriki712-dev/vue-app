import {BACKEND_URL} from "../../../environment.js";

const getForm = async () => {
    const access = localStorage.getItem('access');
    return await fetch(`${BACKEND_URL}/form`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access}`
        }
    }).then(res => res.json());
}

const updateForm = async (data) => {
    const access = localStorage.getItem('access');
    return await fetch(`${BACKEND_URL}/form`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}
export {getForm, updateForm};
