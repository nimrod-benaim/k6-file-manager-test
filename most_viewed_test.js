import http from 'k6/http';
import { check } from 'k6';
import { parseHTML } from 'k6/html';
import { k6Options, config } from './config.js';
import { thresholds } from './thresholds.js';
////import { Trend } from 'k6/metrics'; moved to metrics
import { loginDuration, jwtDuration, mostViewedDuration } from './metrics.js'; // ✅ shared

const users = JSON.parse(open('./users.json'));



// export const loginDuration = new Trend('login_duration'); moved to metrics
// export const jwtDuration = new Trend('jwt_duration');     moved to metrics   
// export const fmDuration = new Trend('file_manager_duration'); moved to metrics
// export const mostViewedDuration = new Trend('mostViewed_duration'); moved to metrics

export const options = {
  ...k6Options,
  thresholds: thresholds,
};;

export default function () {

  // Choose user from users list

  console.log('Loaded users:', JSON.stringify(users));
  const randomNumber = Math.floor(Math.random() * users.length);
  console.log('Loading user number:', randomNumber);
  const user = users[randomNumber];

  // Step 1: Get CSRF token from login page
  const loginPage = http.get(`${config.baseUrl}${config.endpoints.login}`, { tags: { api: 'loginPage' }});
  const doc = parseHTML(loginPage.body);
  const csrfToken = doc.find('input[name="_csrf"]').attr('value');
  console.log('CSRF Token:', csrfToken);

  // Step 2: Prepare login payload
  const payload = {
    _csrf: csrfToken,
    username: user.username,
    password: user.password,
    locale: config.auth.locale,
    loginform: 'true',
    monitoring: '',
    timezoneOffset: config.auth.timezoneOffset
  };

  // Step 3: Login with credentials
  const loginRes = http.post(`${config.baseUrl}${config.endpoints.loginPost}`,payload,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' },tags: { api: 'login' },});
  loginDuration.add(loginRes.timings.duration);
  check(loginRes, { 'Login successful': (r) => r.status === 200 || r.status === 302 });
  console.log('Login response code:', loginRes.status);

  // Step 4: Get JWT Token
  const jwtRes = http.get(`${config.baseUrl}${config.endpoints.jwt}`, { tags: { api: 'jwt' } });
  jwtDuration.add(jwtRes.timings.duration);
  check(jwtRes, { 'Got JWT token': (r) => r.status === 200 });
  console.log('Login JWT response code:', jwtRes.status);
  const tokenData = JSON.parse(jwtRes.body);
  const jwtToken = tokenData.jwtBearer || `Bearer ${tokenData.jwt}`;// added a fallback value
 // console.log('JWT Token:', jwtToken); // the token is super long

  // step 5: acsses the most viewed item widget
  const MVWRes = http.get(`${config.baseUrl}${config.endpoints.mostViewed}`, {headers: {Authorization: jwtToken,'Content-Type': 'application/json',},tags: { api: 'mostViewed' },});
  mostViewedDuration.add(MVWRes.timings.duration);
  check(MVWRes, { 'most viewed item ok': (r) => r.status === 200 });
  console.log('Most Viewed response code:', MVWRes.status);



}
