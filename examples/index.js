process.env.UV_THREADPOOL_SIZE = 1;
const { performance } = require('perf_hooks');
const { Worker } = require('worker_threads');
const { workerThreadExecute } = require('../dist/index.js');



const arraySize = 800_000;
const chunksToCreate = 2;
const parallelExecutions = 4;

const input = Array.from({ length: arraySize }, (_, i) => i);
const chunkSize = Math.ceil(input.length / chunksToCreate);

const preloadedWorkers = Array.from({ length: chunksToCreate }, () => {
  return new Worker(`${process.cwd()}/examples/worker-with-postmessage.mjs`);
});

const withoutWorkers = () => {
  const newInput = [];
  for (let i = 0; i < chunksToCreate; i++) {
    newInput.push(input.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  for (const i in newInput) {
    for (const j in newInput[i]) {
      newInput[i][j] = {
        value: newInput[i][j],
        double: newInput[i][j] * 2,
        square: newInput[i][j] ** 2,
        cube: newInput[i][j] ** 3,
        hash: newInput[i][j].toString(16)
      };
    }
  }
};
const withWorkers = () => {
  const newInput = [];
  for (let i = 0; i < chunksToCreate; i++) {
    newInput.push(input.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  const promises = newInput.map((chunk, i) => () => {
    return workerThreadExecute(`${process.cwd()}/examples/worker-without-postmessage.mjs`, chunk);
  });

  return Promise.all(promises.map((p) => p()));
};

const withPreloadedWorkers = () => {
  const newInput = [];
  for (let i = 0; i < chunksToCreate; i++) {
    newInput.push(input.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  const promises = newInput.map((chunk, i) => () => {
    return workerThreadExecute(preloadedWorkers[i], chunk);
  });

  return Promise.all(promises.map((p) => p()));
};
let start, end, time;

console.log('Starting without worker threads');
start = performance.now();
Array.from({ length: parallelExecutions }, () => withoutWorkers());
end = performance.now();
time = end - start;
console.log(`Time taken: ${time}ms`);

console.log('Starting with worker threads');
const promises = Array.from({ length: parallelExecutions }, () => withWorkers());
start = performance.now();
Promise.all(promises)
  .then(() => {
    end = performance.now();
    time = end - start;
    console.log(`Time taken with: ${time}ms`);

    console.log('Starting with preloaded worker threads');
    const promises2 = Array.from({ length: parallelExecutions }, () =>
      withPreloadedWorkers()
    );
    start = performance.now();
    Promise.all(promises2)
      .then(() => {
        end = performance.now();
        time = end - start;
        console.log(`Time taken with preload: ${time}ms`);
      })
      .catch((err) => console.error(err));
  })
  .catch((err) => console.error(err));
