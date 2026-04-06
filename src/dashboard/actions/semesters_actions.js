import {BACKEND_URL} from "../../../environment.js";

const getSemesters = async (filter) => {
    const access = localStorage.getItem('access');
    const query = (new URLSearchParams(filter)).toString();
    return await fetch(`${BACKEND_URL}/semesters?${query}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access}`,
        }
    }).then(res => res.json())
}

const createSemester = async (data) => {
    return await fetch(`${BACKEND_URL}/semesters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data}`,
        }
    }).then(res => res.json())
}

const updateSemester = async (id, data) => {
    return await fetch(`${BACKEND_URL}/semesters/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data}`,
        }
    }).then(res => res.json())
}

const deleteSemester = async (id) => {
    const access = localStorage.getItem('access');
    return await fetch(`${BACKEND_URL}/semesters/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
        }
    })
}

export {getSemesters, createSemester, updateSemester, deleteSemester};
