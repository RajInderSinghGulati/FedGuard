import axios from 'axios';

const BASE = 'http://localhost:8080/api';

let token = null;

export const login = async (clientId, apiKey) => {
  const res = await axios.post(`${BASE}/auth/token`, {
    clientId,
    secret: apiKey
  });
  token = res.data.token;
  localStorage.setItem('token', token);
  localStorage.setItem('clientId', clientId);
  return res.data;
};

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const uploadAndPredict = async (features) => {
  const res = await axios.post(
    `${BASE}/predict`,
    {
      clientId: localStorage.getItem('clientId') || 'client-1',
      features
    },
    authHeaders()
  );
  return res.data;
};

export const submitWeights = async (weights, accuracy, loss) => {
  const res = await axios.post(
    `${BASE}/fl/submit`,
    {
      clientId: localStorage.getItem('clientId'),
      weights,
      accuracy,
      loss
    },
    authHeaders()
  );
  return res.data;
};

export const getGlobalModel = async () => {
  const res = await axios.get(`${BASE}/fl/global-model`, authHeaders());
  return res.data;
};