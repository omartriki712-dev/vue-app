import {BACKEND_URL} from "../../../../environment.js";

const getSemesters = async () => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/semesters`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

const getSemester = async (id) => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/semesters/${id}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

export {getSemesters, getSemester};
