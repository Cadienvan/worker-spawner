# What is this?

A Worker Thread spawner for Node.js with a simple API.

# How do I install it?

```bash
npm install worker-spawner
```

# How can I use it?

You can find a simple example in the `examples` folder.

## Basic usage

My script:
```js
const { workerThreadExecute } = require('worker-spawner');

const myExpensiveFunction = await workerThreadExecute(__dirname + '/blocking-expensive-function.js', myInput);
console.log(myExpensiveFunction);
```

My worker:
```js
const { parentPort, workerData } = require('worker_threads');
// Do some expensive stuff
myOutput = workerData.map((item) => item * 2);
parentPort.postMessage(myOutput);
```

## Advanced usage - Preloading

My script:
```js
const { Worker } = require('worker_threads');
const { workerThreadExecute } = require('worker-spawner');
const preloadedWorker = new Worker(__dirname + '/blocking-expensive-function.js');

const myExpensiveFunction = await workerThreadExecute(preloadedWorker, myInput);
console.log(myExpensiveFunction);
```

My worker:
```js
const { parentPort } = require('worker_threads');
parentPort.on('message', (input) => {
  // Do some expensive stuff
  myOutput = input.map((item) => item * 2);
  parentPort.postMessage(myOutput);
});
```

# API

The workerThreadExecute function takes two arguments:
- `workerPathOrInstance`: Either a path to a worker file or a preloaded worker instance.  
- `input`: The input to be passed to the worker. Please be aware the input will work differently depending on the type of the worker.  
  - If the worker is a preloaded worker, the input will be passed to the worker as a message.  
  - If the worker is a path to a worker file, the input will be passed to the worker as a parameter available using the `workerData` property of the `worker_threads` module.


# Tests

You can run the tests by using the following command:

```bash
npm test
```