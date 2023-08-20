import authReducer from "./authReducer";
import alertReducer from "./alertReducer";
import mainReducer from "./mainReducer";

import { combineReducers } from "redux";
import contractReducer from "./contractReducer";

const allReducers = combineReducers({
    user: authReducer,
    alert: alertReducer,
    main: mainReducer,
    contract: contractReducer
});

export default allReducers;