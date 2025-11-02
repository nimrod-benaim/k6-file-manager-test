export const config = {
  baseUrl: 'https://salesforceqa.lighthouse-cloud.com',
  auth: {
    locale: 'en',
    timezoneOffset: '0'
  },
  endpoints: {
    login: '/kms/lh/login',
    loginPost: '/kms/lh/login/post',
    jwt: '/archive/jwt',
    fileManager: '/app/file-manager',
    search: '/file-service/archive/item/search',

    mostViewed: '/kms/lh/item/get/most-viewed'
  }

};

export const k6Options = {
  vus: 1,
  iterations: 1,
};