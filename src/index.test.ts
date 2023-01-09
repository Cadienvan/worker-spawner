import { Worker } from 'worker_threads';
import { workerThreadExecute } from './lib';

it('should call the worker when path is given', async () => {
  const result = await workerThreadExecute(
    `${process.cwd()}/src/tests/worker-sample.mjs`,
    1,
    { unref: true, timeout: 500 }
  );
  expect(result).toBe(2);
});

it('should work without a payload', async () => {
  const result = await workerThreadExecute(
    `${process.cwd()}/src/tests/worker-sample.mjs`,
    undefined,
    { unref: true, timeout: 500  }
  );
  
  expect(result).toBeNaN();

  const worker = new Worker(
    `${process.cwd()}/src/tests/worker-sample.mjs`
  );
  worker.unref();
  const resultWithPreload = await workerThreadExecute(worker, 1, { timeout: 500 });
  expect(resultWithPreload).toBe(2);
  worker.terminate();
});

it('should call the worker when preloaded', async () => {
  const worker = new Worker(
    `${process.cwd()}/src/tests/worker-sample.mjs`
  );
  worker.unref();
  const result = await workerThreadExecute(worker, 1, { timeout: 500 });
  expect(result).toBe(2);
  worker.terminate();
});

it('should work without passing options', async () => {
  const worker = new Worker(
    `${process.cwd()}/src/tests/worker-sample.mjs`
  );
  worker.unref();
  const result = await workerThreadExecute(worker);
  expect(result).toBeNaN();
  worker.terminate();
});

it('should throw if the worker exceeds given timeout', async () => {
  try {
    await workerThreadExecute(
      `${process.cwd()}/src/tests/worker-with-delay.mjs`,
      1,
      { timeout: 10, unref: true }
    );
  } catch (e: any) {
    expect(e.message).toBe('Worker timed out');
  }
});