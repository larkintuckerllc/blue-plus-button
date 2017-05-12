import { combineReducers } from 'redux';
import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { del, get, post } from '../apis/listValues';

// REDUCER MOUNT POINT
const reducerMountPoint = 'listValues';
// ACTIONS
export const FETCH_LIST_VALUES_REQUEST = `${ACTION_PREFIX}FETCH_LIST_VALUES_REQUEST`;
export const FETCH_LIST_VALUES_SUCCESS = `${ACTION_PREFIX}FETCH_LIST_VALUES_SUCCESS`;
export const FETCH_LIST_VALUES_ERROR = `${ACTION_PREFIX}FETCH_LIST_VALUES_ERROR`;
export const RESET_FETCH_LIST_VALUES_ERROR = `${ACTION_PREFIX}RESET_FETCH_LIST_VALUES_ERROR`;
export const ADD_LIST_VALUE_REQUEST = `${ACTION_PREFIX}ADD_LIST_VALUE_REQUEST`;
export const ADD_LIST_VALUE_SUCCESS = `${ACTION_PREFIX}ADD_LIST_VALUE_SUCCESS`;
export const ADD_LIST_VALUE_ERROR = `${ACTION_PREFIX}ADD_LIST_VALUE_ERROR`;
export const RESET_ADD_LIST_VALUE_ERROR = `${ACTION_PREFIX}RESET_ADD_LIST_VALUE_ERROR`;
export const UPDATE_LIST_VALUE_REQUEST = `${ACTION_PREFIX}UPDATE_LIST_VALUE_REQUEST`;
export const UPDATE_LIST_VALUE_SUCCESS = `${ACTION_PREFIX}UPDATE_LIST_VALUE_SUCCESS`;
export const UPDATE_LIST_VALUE_ERROR = `${ACTION_PREFIX}UPDATE_LIST_VALUE_ERROR`;
export const RESET_UPDATE_LIST_VALUE_ERROR = `${ACTION_PREFIX}RESET_UPDATE_LIST_VALUE_ERROR`;
export const REMOVE_LIST_VALUE_REQUEST = `${ACTION_PREFIX}REMOVE_LIST_VALUE_REQUEST`;
export const REMOVE_LIST_VALUE_SUCCESS = `${ACTION_PREFIX}REMOVE_LIST_VALUE_SUCCESS`;
export const REMOVE_LIST_VALUE_ERROR = `${ACTION_PREFIX}REMOVE_LIST_VALUE_ERROR`;
export const RESET_REMOVE_LIST_VALUE_ERROR = `${ACTION_PREFIX}RESET_REMOVE_LIST_VALUE_ERROR`;
// SCHEMA
const listValueSchema = new schema.Entity(
  'listValues',
  {},
  {
    idAttribute: 'fldListValue',
  }
);
const listValuesSchema = new schema.Array(listValueSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LIST_VALUES_SUCCESS:
    case ADD_LIST_VALUE_SUCCESS:
    case UPDATE_LIST_VALUE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.listValues,
      };
    }
    case REMOVE_LIST_VALUE_SUCCESS: {
      const newState = { ...state };
      delete newState[action.response.result];
      return newState;
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_LIST_VALUES_SUCCESS:
      return action.response.result;
    case ADD_LIST_VALUE_SUCCESS:
      return [...state, action.response.result];
    case REMOVE_LIST_VALUE_SUCCESS: {
      const newState = [...state];
      newState.splice(
        state.indexOf(action.response.result),
        1
      );
      return newState;
    }
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_LIST_VALUES_REQUEST:
    case ADD_LIST_VALUE_REQUEST:
    case UPDATE_LIST_VALUE_REQUEST:
    case REMOVE_LIST_VALUE_REQUEST:
      return true;
    case FETCH_LIST_VALUES_SUCCESS:
    case ADD_LIST_VALUE_SUCCESS:
    case UPDATE_LIST_VALUE_SUCCESS:
    case REMOVE_LIST_VALUE_SUCCESS:
    case FETCH_LIST_VALUES_ERROR:
    case ADD_LIST_VALUE_ERROR:
    case UPDATE_LIST_VALUE_ERROR:
    case REMOVE_LIST_VALUE_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_LIST_VALUES_ERROR:
    case ADD_LIST_VALUE_ERROR:
    case UPDATE_LIST_VALUE_ERROR:
    case REMOVE_LIST_VALUE_ERROR:
      return action.message;
    case FETCH_LIST_VALUES_REQUEST:
    case FETCH_LIST_VALUES_SUCCESS:
    case RESET_FETCH_LIST_VALUES_ERROR:
    case ADD_LIST_VALUE_REQUEST:
    case ADD_LIST_VALUE_SUCCESS:
    case RESET_ADD_LIST_VALUE_ERROR:
    case UPDATE_LIST_VALUE_REQUEST:
    case UPDATE_LIST_VALUE_SUCCESS:
    case RESET_UPDATE_LIST_VALUE_ERROR:
    case REMOVE_LIST_VALUE_REQUEST:
    case REMOVE_LIST_VALUE_SUCCESS:
    case RESET_REMOVE_LIST_VALUE_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_LIST_VALUES_REQUEST:
      return 'fetch';
    case ADD_LIST_VALUE_REQUEST:
      return 'add';
    case UPDATE_LIST_VALUE_REQUEST:
      return 'update';
    case REMOVE_LIST_VALUE_REQUEST:
      return 'remove';
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
  isAsync,
  asyncErrorMessage,
  lastAsync,
});
// ACCESSORS AKA SELECTORS
const getIsAsync = (state) => state[reducerMountPoint].isAsync;
const getLastAsync = (state) => state[reducerMountPoint].lastAsync;
export const getListValue = (state, id) => state[reducerMountPoint].byId[id];
const getListValuesIds = state => state[reducerMountPoint].ids;
const getListValuesById = state => state[reducerMountPoint].byId;
export const getListValues = createSelector(
  [getListValuesIds, getListValuesById],
  (listValuesIds, listValuesById) => listValuesIds.map(id => listValuesById[id])
);
export const getIsFetchingListValues = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchListValuesErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
export const getIsAddingListValue = (state) =>
  getLastAsync(state) === 'add' && getIsAsync(state);
export const getAddListValueErrorMessage = (state) => (
  getLastAsync(state) === 'add' ? state[reducerMountPoint].asyncErrorMessage : null);
export const getIsUpdatingListValue = (state) =>
  getLastAsync(state) === 'update' && getIsAsync(state);
export const getUpdateListValueErrorMessage = (state) => (
  getLastAsync(state) === 'update' ? state[reducerMountPoint].asyncErrorMessage : null);
export const getIsRemovingListValue = (state) =>
  getLastAsync(state) === 'remove' && getIsAsync(state);
export const getRemoveListValueErrorMessage = (state) => (
  getLastAsync(state) === 'remove' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
const validNewListValue = (state, listValue) =>
  !(listValue === undefined
  || listValue.fldListValue === undefined
  || typeof listValue.fldListValue !== 'string');
const validExistingListValue = (state, listValue) =>
  validNewListValue(state, listValue) && getListValue(state, listValue.fldListValue) !== undefined;
// ACTION CREATORS
export const fetchListValues = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_LIST_VALUES_REQUEST,
  });
  return get()
    .then(
      response => dispatch({
        type: FETCH_LIST_VALUES_SUCCESS,
        response: normalize(response, listValuesSchema),
      }),
      error => {
        dispatch({
          type: FETCH_LIST_VALUES_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchListValuesError = () => ({
  type: RESET_FETCH_LIST_VALUES_ERROR,
});
export const addListValueLocal = (listValue) => ({
  type: ADD_LIST_VALUE_SUCCESS,
  response: normalize(listValue, listValueSchema),
});
export const addListValue = (listValue) => (dispatch, getState) => {
  const state = getState();
  if (getIsAsync(state)) throw new Error();
  if (!validNewListValue(state, listValue)) throw new Error();
  dispatch({
    type: ADD_LIST_VALUE_REQUEST,
    listValue,
  });
  return post(listValue)
    .then(
      response => {
        dispatch(addListValueLocal(response));
      },
      error => {
        dispatch({
          type: ADD_LIST_VALUE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetAddListValueError = () => ({
  type: RESET_ADD_LIST_VALUE_ERROR,
});
/*
// PROBLEM AS UPDATING IS UPDATING KEY
export const updateListValueLocal = (listValue) => ({
  type: UPDATE_LIST_VALUE_SUCCESS,
  response: normalize(listValue, listValueSchema),
});
export const updateListValue = (listValue) => (dispatch, getState) => {
  const state = getState();
  if (getIsAsync(state)) throw new Error();
  if (!validExistingListValue(state, listValue)) throw new Error();
  dispatch({
    type: UPDATE_LIST_VALUE_REQUEST,
    listValue,
  });
  return put(listValue.fldListValue, listValue)
  .then(
      response => {
        dispatch(updateListValueLocal(response));
      },
      error => {
        dispatch({
          type: UPDATE_LIST_VALUE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetUpdateListValueError = () => ({
  type: RESET_UPDATE_LIST_VALUE_ERROR,
});
*/
export const removeListValueLocal = (fldListValue) => (dispatch, getState) => {
  const state = getState();
  const listValue = getListValue(state, fldListValue);
  if (!validExistingListValue(state, listValue)) throw new Error();
  dispatch({
    type: REMOVE_LIST_VALUE_SUCCESS,
    response: normalize(listValue, listValueSchema),
  });
};
export const removeListValue = (fldListValue) => (dispatch, getState) => {
  const state = getState();
  const listValue = getListValue(state, fldListValue);
  if (getIsAsync(state)) throw new Error();
  if (!validExistingListValue(state, listValue)) throw new Error();
  dispatch({
    type: REMOVE_LIST_VALUE_REQUEST,
    listValue,
  });
  return del(listValue.fldListValue)
    .then(
      () => {
        removeListValueLocal(listValue.fldListValue)(dispatch, getState);
      },
      error => {
        dispatch({
          type: REMOVE_LIST_VALUE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetRemoveListValueError = () => ({
  type: RESET_REMOVE_LIST_VALUE_ERROR,
});
