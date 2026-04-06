import {BACKEND_URL} from "../../../environment.js";

export const login = async ({usernameOrEmail, password}) => {
    const res =  await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({usernameOrEmail, password})
    });
    const data = await res.json();
    if(res.status !== 200) {
        return data;
    } else {
        localStorage.setItem('access', data.access);
        localStorage.setItem('studentPromotionId', data.studentPromotionId);
        localStorage.setItem('email', data.email);
        localStorage.setItem('name', data.name);
        localStorage.setItem('currentSemester', JSON.stringify(data.currentSemester));
    }
}
