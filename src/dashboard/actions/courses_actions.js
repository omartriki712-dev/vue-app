import {BACKEND_URL} from "../../../environment.js";

const getCourses = async (filter) => {
    const access = localStorage.getItem('access');
    const query = filter ? `?${new URLSearchParams(filter).toString()}` : '';
    const res = await fetch(`${BACKEND_URL}/courses${query}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();getCourseDetails
}

const getCourse = async (courseId) => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/courses/${courseId}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

const getCourseQuestions = async ({courseId}) => {
    const access = localStorage.getItem('access');
    const res = await fetch(`${BACKEND_URL}/courses/${courseId}/questions`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return await res.json();
}

export {getCourses, getCourse, getCourseQuestions};
