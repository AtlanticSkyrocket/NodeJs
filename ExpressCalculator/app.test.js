const request = require('supertest');
const app = require('./app.js');

 
describe('GET /', () => {
  it('should return a 400 status and a message when nums query parameter is missing', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Please enter a list of numbers in the URL');
  });
});

describe('GET /all', () => {
  it('should return the mean, median, and mode of valid numbers', async () => {
    const response = await request(app).get('/all?nums=71,94,39,47,77');
    expect(response.status).toBe(200);
    const body = response.body;
    expect(body.operation).toBe('all');
    expect(body.mean).toBeCloseTo(65.6, 1);
    expect(body.median).toBe(71); 
    expect(body.mode).toBeUndefined();
  });


  it('should return a 400 status and a message when nums query parameter is missing', async () => {
    const response = await request(app).get('/all');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Please enter a list of numbers in the URL');
  });
});

describe('GET /mean', () => {
  it('should return the mean of valid numbers', async () => {
    const response = await request(app).get('/mean?nums=1,2,3,4,5');
    expect(response.status).toBe(200);
    expect(response.text).toBe('The mean is 3');
  });

  it('should return a 400 status and a message when nums query parameter is missing', async () => {
    const response = await request(app).get('/mean');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Please enter a list of numbers in the URL');
  });
});

describe('GET /median', () => {
  it('should return the median of valid numbers', async () => {
    const response = await request(app).get('/median?nums=1,2,3,4,5');
    expect(response.status).toBe(200);
    expect(response.text).toBe('The median is 3');
  });

  it('should return a 400 status and a message when nums query parameter is missing', async () => {
    const response = await request(app).get('/median');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Please enter a list of numbers in the URL');
  });
});

describe('GET /mode', () => {
  it('should return the mode of valid numbers', async () => {
    const response = await request(app).get('/mode?nums=1,2,2,3,4,4,4,5');
    expect(response.status).toBe(200);
    expect(response.text).toBe('The mode is 4');
  });

  it('should return a 400 status and a message when nums query parameter is missing', async () => {
    const response = await request(app).get('/mode');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Please enter a list of numbers in the URL');
  });
});
