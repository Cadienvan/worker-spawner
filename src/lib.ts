import { Worker, WorkerOptions } from 'worker_threads';
import { defaultOptions } from './defaults';
import { Options } from './models';

export function workerThreadExecute<T>(
  workerPathOrInstance: string | Worker,
  payload: unknown = undefined,
  _options: Partial<Options> = {},
  workerOptions: WorkerOptions = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    const options: Options = {
      ...defaultOptions,
      ..._options
    };
    let worker: string | Worker;
    if (typeof workerPathOrInstance === 'string') {
      worker = new Worker(workerPathOrInstance, workerOptions);
    } else {
      worker = workerPathOrInstance;
    }
    worker.postMessage(payload);
    if (options.unref) {
      worker.unref();
    }
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
    if (options.timeout > 0) {
      setTimeout(() => {
        (worker as Worker).terminate();
        reject(new Error('Worker timed out'));
      }, options.timeout).unref();
    }
  });
}
