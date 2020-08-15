import { postData } from './fetAPImock';

describe('It should create API requests', () => {
  test('It should return a successful response', () => {
    postData({ user: 'Leo', score: 10 }).then(data => {
      expect(data).toEqual({ result: 'Leaderboard score created correctly.' });
    });
  });
  test('It should return a faile response if sent data is incorrect', () => {
    postData({ user: 'Leo', score: 0 }).then(data => {
      expect(data).toEqual({ message: 'You need to provide a valid score for the leaderboard' });
    });
  });
  test('It should return a faile response if sent data is incorrect', () => {
    postData({ user: '', score: 10 }).then(data => {
      expect(data).toEqual({ message: 'You need to provide a valid user for the score' });
    });
  });
  test('It should return a faile response if sent data is incorrect', () => {
    postData({ user: '', score: 0 }).then(data => {
      expect(data).toEqual({ message: 'You need to provide a valid user for the score' });
    });
  });
});