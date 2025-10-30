export const config = {
  baseUrl: 'https://salesforceqa.lighthouse-cloud.com',
  auth: {
    username: 'admin',
    password: 'admin',
    locale: 'en',
    timezoneOffset: '0'
  },
  endpoints: {
    login: '/kms/lh/login',
    loginPost: '/kms/lh/login/post',
    jwt: '/archive/jwt',
    fileManager: '/app/file-manager',
    search: '/file-service/archive/item/search'
  }
};