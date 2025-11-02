import { Trend } from 'k6/metrics';


export const loginDuration = new Trend('login_duration');
export const jwtDuration = new Trend('jwt_duration');
export const fmDuration = new Trend('file_manager_duration');
export const searchDuration = new Trend('search_duration');
export const mostViewedDuration = new Trend('mostViewed_duration');
