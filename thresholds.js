// export const thresholds = {
//   http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],
//   http_req_duration: ['p(99)<5000'],

//   'login_duration': ['p(95)<800'],
//   'jwt_duration': ['p(95)<800'],
//   'file_manager_duration': ['p(95)<800'],
// //  'search_duration': ['p(95)<800'],
//   'mostViewed_duration':  ['p(95)<800'],
// };

// // export const thresholds = {
// //   checks: ['rate>0.95'], // 95% of checks must pass overall

// //   'http_req_duration{api:login}': ['p(95)<1500'], // Login must be fast
// //   'http_req_duration{api:jwt}': ['p(95)<1500'],   // JWT must be fast
// //   'http_req_duration{api:fileManager}': ['p(95)<2000'], // File Manager
// //   'http_req_duration{api:search}': ['p(95)<2000'],      // Search
// //   'http_req_duration{api:mostViewed}': ['p(95)<2000'], // most viewed
// // };

// Global thresholds that apply to all tests
const globalThresholds = {
  http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],
  http_req_duration: ['p(99)<5000'],
};
const authThresholds = {
  'login_duration': ['p(95)<800'],
  'jwt_duration': ['p(95)<800'],
};

//  File Manager test thresholds 
const fileManagerThresholds = {
  'file_manager_duration': ['p(95)<800'],
  'search_duration': ['p(95)<800'],
};

//  Most Viewed widget test thresholds 
const mostViewedThresholds = {
  'mostViewed_duration': ['p(95)<800'],
};

// Combine everything into one export
export const thresholds = {
  ...globalThresholds,
  ...authThresholds,
  ...fileManagerThresholds,
  ...mostViewedThresholds,
};