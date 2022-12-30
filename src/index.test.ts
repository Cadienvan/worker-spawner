import { Worker } from 'worker_threads';
import { workerThreadExecute } from './lib';

it('should call the worker when path is given', async () => {
  const result = await workerThreadExecute(
    `${process.cwd()}/src/tests/worker-without-postmessage.mjs`,
    1,
    { unref: true }
  );
  expect(result).toBe(2);
});

it('should call the worker when preloaded', async () => {
  const worker = new Worker(
    `${process.cwd()}/src/tests/worker-with-postmessage.mjs`
  );
  worker.unref();
  const result = await workerThreadExecute(worker, 1);
  expect(result).toBe(2);
  worker.terminate();
});

it('should throw if the worker exceeds given timeout', async () => {
  try {
    const result = await workerThreadExecute(
      `${process.cwd()}/src/tests/worker-with-delay.mjs`,
      1,
      { timeout: 10, unref: true }
    );
  } catch (e: any) {
    expect(e.message).toBe('Worker timed out');
  }
});
