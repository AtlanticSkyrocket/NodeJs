const express = require('express');
const ExpressError = require('./expressError');
const items = require('./fakeDb');

const app = express();
const morgan = require('morgan'); 

app.use(express.json());
app.use(morgan('dev'));


app.get('/items', (req, res) => {
  return res.json(items);
});

app.get('/items/:name', (req, res) => {
  let name = req.params.name;
  let foundItem = items.find(item => item.name === name);

  if (foundItem === undefined) {
    throw new ExpressError('Item not found', 404);
  }
  else {
    return res.json(foundItem);
  }
});
app.post('/items', (req, res) => {
  let newItem = req.body;

  items.push(newItem);

  return res.json({added: newItem});
});

app.patch('/items/:name', (req, res) => {
  let name = req.params.name;
  let newName = req.body.name;
  let newPrice = req.body.price;

  let foundItem = items.find(item => item.name === name);
  if(foundItem === undefined) {
    throw new ExpressError('Item not found', 404);
  }
  else {
    foundItem.name = newName;
    foundItem.price = newPrice;
    return res.json({updated: foundItem});
  }
});

app.delete('/items/:name', (req, res) => {
  let name = req.params.name;
  let foundItem = items.findIndex(item => item.name === name);

  if (foundItem === -1) {
    throw new ExpressError('Item not found', 404);
  }
  else {
    items.splice(foundItem, 1);
    return res.json({message: 'Deleted'});
  }
});

app.use((req, res, next) => {
  const err = new ExpressError('Not Found', 404);
  return next(err);
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.msg;

  return res.status(status).send(message);
});




module.exports = app;