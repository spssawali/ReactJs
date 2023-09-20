import { API_CALL, SET_CONTACTS, SET_CONTACTS_PAGINATION, API_CALL_PAGINATION } from './actionTypes';

const initialState = {
    APICall: false,
    APICallPagination: false,
    isLoading : true,
    Contacts: null
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case API_CALL:
            return { ...state, APICall: action.payload };
        case SET_CONTACTS:
            console.log("SET_CONTACTS : ",action.payload)

            return { ...state, Contacts: action.payload, APICall: false, isLoading : false };
        case API_CALL_PAGINATION:
            return { ...state, APICallPagination: action.payload };
        case SET_CONTACTS_PAGINATION:
            console.log("SET_CONTACTS_PAGINATION : ",action.payload)
            return { ...state, Contacts: action.payload, APICallPagination: false };
        default:
            return state;
    }
}
export default reducer;