export const thresholds = {
  http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],
  http_req_duration: ['p(99)<5000'],

  'login_duration': ['p(95)<800'],
  'jwt_duration': ['p(95)<800'],
  'file_manager_duration': ['p(95)<800'],
  'search_duration': ['p(95)<800'],
};