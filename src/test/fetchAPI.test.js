import { postData } from './fetAPImock';

describe('It should create API requests', () => {
  test('It should return a successful response', () => {
    postData('Leo', 10).then(data => {
      expect(data).toBe('Leaderboard score created correctly.');
    });
  });
  test('It should return a faile response if sent data is incorrect', () => {
    postData('Leo', 0).then(data => {
      expect(data).toBe('Leaderboard score created correctly.');
    });
  });
});