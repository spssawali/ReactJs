import { API_CALL, SET_CONTACTS, API_CALL_PAGINATION, SET_CONTACTS_PAGINATION } from './actionTypes';
import Axios from 'axios';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MSwiZXhwIjoxNjM5NDY2NjE1fQ.9vE-glLQtV2NT3gNMkqeRkrWWZAhYCqX-_ibs7lC8GY';
Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const getContacts = (params, pagination) => {
    return async (dispatch, getState) => {
        if (pagination) {
            let state = getState();
            dispatch({ type: API_CALL_PAGINATION, payload: true });
            let data = await APICall(params);
            // if (data) {
            data = {
                ...data,
                contacts: { ...state.Contacts.contacts, ...data?.contacts },
                contacts_ids: [...state.Contacts.contacts_ids, ...data?.contacts_ids],
            }
            // } 
            dispatch({ type: SET_CONTACTS_PAGINATION, payload: { ...data, page: params.page } });
        } else {
            dispatch({ type: API_CALL, payload: true });
            let data = await APICall(params);
            dispatch({ type: SET_CONTACTS, payload: { ...data, page: 1 } });
        }
    }
}

export const clearContacts = () => {
    return async (dispatch) => {
        dispatch({ type: SET_CONTACTS, payload: null });
    }
}

const APICall = async (params) => {
    console.log("params : ", params)
    try {
        let response = await Axios.get('https://api.dev.pastorsline.com/api/contacts.json', {
            params: params,
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjU2MCwiZXhwIjoxNzI2NTY3MTc5LCJ0eXBlIjoiYWNjZXNzIiwidGltZXN0YW1wIjoxNjk1MDMxMTc5fQ.0y7NtuVDCvcPvmWbliMs1q02sov2oFC6u2Hi6H4A2W4',
            }
        });
        return response.data;
    } catch (error) {
        console.log("error : ", error)
        return null
    }
}