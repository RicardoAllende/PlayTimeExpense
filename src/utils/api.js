import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { categoriesData } from '../../api/mockData/categories';
import { expensesData } from '../../api/mockData/expenses';
import { profileData } from '../../api/mockData/profile';

API_URL = 'http://localhost:3004';
API_REQUEST_TIMEOUT = 3000;

// This sets the mock adapter on the default instance. comment this block if you are using a backend api (yarn server)
var mock = new MockAdapter(axios, { delayResponse: 10 });

mock.onGet('/auth').reply(200, profileData);
mock.onPost('/auth').reply(200);
mock.onGet('/password').reply(200);
mock.onGet('/expenses').reply(200, expensesData);
mock.onGet('/expenses?q=data&&_page=1&_limit=15').reply(200, expensesData);
mock.onGet('/expenses/export').reply(200, expensesData);
mock.onGet('/categories').reply(200, categoriesData);
mock.onPost('/categories').reply(200);
mock.onPost('/expenses').reply(200);

const instance = axios.create({
  baseURL: API_URL,
  timeout: API_REQUEST_TIMEOUT,
  headers: { Authorization: 'Bearer xxxxxxxxx' },
});

export default instance;
