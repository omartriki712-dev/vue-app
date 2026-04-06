import {BACKEND_URL} from "../../../environment.js";

const getQuestions = async () => {
    const access = localStorage.getItem('access');
    return await fetch(`${BACKEND_URL}/questions`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access}`
        }
    }).then(res => res.json())
}
export {getQuestions};
