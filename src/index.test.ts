import { Worker } from 'worker_threads';
import { workerThreadExecute } from '../dist';

it('should call the worker when path is given', async () => {
  const result = await workerThreadExecute(
    `${process.cwd()}/src/tests/worker-without-postmessage.mjs`,
    1
  );
  expect(result).toBe(2);
});

it('should call the worker when preloaded', async () => {
  const worker = new Worker(`${process.cwd()}/src/tests/worker-with-postmessage.mjs`);
  const result = await workerThreadExecute(worker, 1);
  expect(result).toBe(2);
});
