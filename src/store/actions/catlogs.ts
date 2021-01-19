import { AnyAction } from "redux";
import { SET_CATLOGS } from "../actionTypes";
import { Catlogs } from "../reducers/catlogs";

export const setCatlogs = (catlogs: Catlogs): AnyAction => {
  return {
    type: SET_CATLOGS,
    value: catlogs
  };
};
