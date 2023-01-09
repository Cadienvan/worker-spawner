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
parentPort.on('message', (input) => {
  // Do some expensive stuff
  myOutput = input.map((item) => item * 2);
  parentPort.postMessage(myOutput);
});
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
- `workerPathOrInstance`(_required_): Either a path to a worker file or a preloaded worker instance.  
- `payload`(_optional_): The input to be passed to the worker. The input will be passed to the worker as a message.  
- `options`(_optional_): An object containing the following properties:
  - `unref`: If set to `true`, the worker thread will be unref'd. Defaults to `false`.  
  - `timeout`: The timeout in milliseconds after which the worker will be terminated. Defaults to `0` (no timeout).
- `workerOptions`(_optional_): Additional worker options respecting the [WorkerOptions Interface](https://nodejs.org/api/worker_threads.html#new-workerfilename-options)


# Tests

You can run the tests by using the following command:

```bash
npm test
```