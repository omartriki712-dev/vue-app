import {BACKEND_URL} from "../../../environment.js";

const getPromotions = async () => {
    const access = localStorage.getItem('access');
    return await fetch(`${BACKEND_URL}/promotions`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    }).then(res => res.json)
}

export {getPromotions};
