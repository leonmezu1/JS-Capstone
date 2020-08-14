import 'regenerator-runtime';

const gameId = 'iDV2UjgwszfEVCL2K35I';
const urlgame = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores/`;

export const postData = async (data = {}) => {
  const response = await fetch(urlgame, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getData = async () => {
  const response = await fetch(urlgame, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });
  return response.json();
};
