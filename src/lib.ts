import { Worker } from 'worker_threads';

export function workerThreadExecute<T>(
  workerPathOrInstance: string | Worker,
  workerData: unknown
): Promise<T> {
  return new Promise((resolve, reject) => {
    let worker: string | Worker;
    if (typeof workerPathOrInstance === 'string') {
      worker = new Worker(workerPathOrInstance, {
        workerData
      });
    } else {
      worker = workerPathOrInstance;
      worker.postMessage(workerData);
    }
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}
