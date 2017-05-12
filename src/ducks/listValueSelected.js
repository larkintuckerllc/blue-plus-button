import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'listValueSelected';
// ACTIONS
export const SET_LIST_VALUE_SELECTED = `${ACTION_PREFIX}SET_LIST_VALUE_SELECTED`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_LIST_VALUE_SELECTED:
      return action.value;
    default:
      return state;
  }
};
// SELECTORS
export const getListValueSelected = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validListValueSelected = value =>
  !(value === undefined || typeof value !== 'string');
// ACTION CREATORS
export const setListValueSelected = (value) => {
  if (!validListValueSelected(value)) throw new Error();
  return ({
    type: SET_LIST_VALUE_SELECTED,
    value,
  });
};
export const resetListValueSelected = () => ({
  type: SET_LIST_VALUE_SELECTED,
  value: null,
});
