import http from 'k6/http';
import { check } from 'k6';
import { parseHTML } from 'k6/html';
import { thresholds } from './thresholds.js';
import { k6Options, config } from './config.js';
import { generateModifiedQuery } from './helpers.js';
import { loginDuration, jwtDuration, fmDuration, searchDuration } from './metrics.js';


const users = JSON.parse(open('./users.json'));

// export const loginDuration = new Trend('login_duration');
// export const jwtDuration = new Trend('jwt_duration');
// export const fmDuration = new Trend('file_manager_duration');
// export const searchDuration = new Trend('search_duration');

export const options = {
  ...k6Options,
  thresholds: thresholds,
};

export default function () {
  // Choose user from users list
  console.log('Loaded users:', JSON.stringify(users));
  const randomNumber = Math.floor(Math.random() * 7);
  console.log('Loading user number:', randomNumber);
  const user = users[randomNumber];


  // Step 1: Get CSRF token from login page
  const loginPage = http.get(`${config.baseUrl}${config.endpoints.login}`, { tags: { api: 'loginPage' } });
  const doc = parseHTML(loginPage.body);
  const csrfToken = doc.find('input[name="_csrf"]').attr('value');
  console.log('CSRF Token:', csrfToken);

  // Step 2: Prepare login payload
  const payload = {
    _csrf: csrfToken,
    username: user.username,
    password: user.password,
    locale: config.auth.locale,// ask Marina
    loginform: 'true',// ask Marina
    monitoring: '',// ask Marina
    timezoneOffset: config.auth.timezoneOffset// ask Marina
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
  //console.log('JWT Token:', jwtToken); toekn to long in cmd results

  // step 5: access the File Manager
  const fmRes = http.get(`${config.baseUrl}${config.endpoints.fileManager}`, { tags: { api: 'fileManager' } });
  fmDuration.add(fmRes.timings.duration);
  check(fmRes, { 'File Manager OK': (r) => r.status === 200 });
  console.log('File Manager response:', fmRes.status);

  // step 6: search in file manager
  let query = 'new';

  // Use generateModifiedQuery
  query = generateModifiedQuery(query); // optinal 
  console.log('the search terms:', query);
  const searchUrl = `${config.baseUrl}${config.endpoints.search}?showPermissionError=true&query=${encodeURIComponent(query)}&folderId=`;
  const searchRes = http.get(searchUrl, {headers: {Authorization: jwtToken, 'Content-Type': 'application/json'},tags: { api: 'search' },});
  searchDuration.add(searchRes.timings.duration);
  check(searchRes, { 'Search OK': (r) => r.status === 200 });
  console.log('Search response code:', searchRes.status);
}
