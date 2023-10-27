const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

function validateQueryNums(query) {
  if(query.nums === undefined) return {isValid: false, message:'Please enter a list of numbers in the URL', code: 400};

  const nums = query.nums.split(',').map(n => parseInt(n));
  if(checkForNaNs(nums).allNums === false) return {isValid: false, message:`${checkForNaNs(nums).notNumbers.join(', ')} are not numbers`, code: 400};

  return {isValid: true, nums: nums};
}

function checkForNaNs(nums) {
  const notNumbers = [];
  for (let num of nums) {
    if (isNaN(num)) {
      notNumbers.push(num);
    }
  }
  if (notNumbers.length > 0) {
    return { allNums: false, notNumbers: notNumbers };
  } else {
    return { allNums: true, notNumbers: [] };
  }
}

function getMean(nums) {
  let total = 0;
  for (let num of nums) {
    total += parseInt(num);
  }
  const mean = total / nums.length;
  return mean;
}

function getMedian(nums) {
  nums.sort((a, b) => a - b);
  const mid = Math.floor(nums.length / 2);
  let median;
  if (nums.length % 2 === 0) {
    median = (nums[mid] + nums[mid - 1]) / 2;
  } else {
    median = nums[mid];
  }
  return median;
}

function getMode(nums) {
  const modeObj = {};
  for (let num of nums) {
    if (modeObj[num] === undefined) {
      modeObj[num] = 1;
    } else {
      modeObj[num] += 1;
    }
  }
  let mode = Object.keys(modeObj)[0];
  for (let key in modeObj) {
    if (modeObj[key] > modeObj[mode]) {
      mode = key;
    }
  }
  return mode;
}
app.get('/', (req, res) => {
  console.log('running');
  return res.status(400).send('Please enter a list of numbers in the URL')
});

app.get('/all', (req, res) => {
  const result = validateQueryNums(req.query);
  const nums = result.nums;
  if(!result.isValid) return res.status(result.code).send(result.message);

  let mean = getMean(nums);
  let mode = getMode(nums);
  let median = getMedian(nums);
  let response = {
    operation: "all",
    mean: mean,
    median: median,
    mode: mode
  }
  
  return res.json(response);
});

app.get('/mean/:nums', (req, res) => {
  const result = validateQueryNums(req.params);
  const nums = result.nums;
  if(!result.isValid) return res.status(result.code).send(result.message);

  let mean = getMean(nums);

  return res.send(`The mean is ${mean}`);
});

app.get('/median', (req, res) => {
  const result = validateQueryNums(req.query);
  const nums = result.nums;
  if(!result.isValid) return res.status(result.code).send(result.message);

  let median = getMedian(nums);

  return res.send(`The median is ${median}`);
});

app.get('/mode', (req, res) => {
  const result = validateQueryNums(req.query);
  const nums = result.nums;
  if(!result.isValid) return res.status(result.code).send(result.message);

  let mode = getMode(nums);

  return res.send(`The mode is ${mode}`);
});

app.listen(3000, () => {
  console.log('App on port 3000');
});