import {BACKEND_URL} from "../../../../environment.js";

const getEvolutions = async (filter) => {
    const access = localStorage.getItem('access');
    const query = (new URLSearchParams(filter)).toString();
    return await fetch(`${BACKEND_URL}/evolutions?${query}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access}`,
        }
    }).then(res => res.json());
}

const createEvolution = async (evolution) => {
    const access = localStorage.getItem('access');
    return await fetch(`${BACKEND_URL}/evolutions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(evolution)
    }).then(res => res.json());
}

const updateEvolution = async (id,evolution) => {
    const access = localStorage.getItem('access');
    return await fetch(`${BACKEND_URL}/evolutions/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(evolution)
    }).then(res => res.json());
}

export {createEvolution, getEvolutions};
