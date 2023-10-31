// app.test.js

const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');

describe('Express App Endpoints', () => {
  // Define initial test data
  const initialData = [{ name: 'hamburgerbuns', price: 6.50 }, { name: 'tulips', price: 20 }];
  
  beforeAll(() => {
    items.push(...initialData);
  });

  afterAll(() => {
    items.length = 0;
  });

  describe('GET /items', () => {
    it('should return a list of items', async () => {
      const response = await request(app).get('/items');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(initialData);
    });
  });

  describe('POST /items', () => {
    it('should add a new item to the list', async () => {
      const newItem = { name: 'ribs', price: 30 };
      const response = await request(app)
        .post('/items')
        .send(newItem);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ added: newItem });
    });
  });

  describe('PATCH /items/:name', () => {
    it('should update an existing item in the list', async () => {
      const updatedItem = { name: 'hamburgerbuns', price: 5.50 };
      const response = await request(app)
        .patch('/items/hamburgerbuns')
        .send(updatedItem);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ updated: updatedItem });
    });

    it('should return a 404 error for non-existing item', async () => {
      const updatedItem = { name: 'nonexistent', price: 50 };
      const response = await request(app)
        .patch('/items/nonexistent')
        .send(updatedItem);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /items/:name', () => {
    it('should delete an existing item from the list', async () => {
      const response = await request(app).delete('/items/tulips');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Deleted' });
    });

    it('should return a 404 error for non-existing item', async () => {
      const response = await request(app).delete('/items/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});
