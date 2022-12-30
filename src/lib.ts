import { Worker } from 'worker_threads';
import { defaultOptions } from './defaults';
import { Options } from './models';

export function workerThreadExecute<T>(
  workerPathOrInstance: string | Worker,
  workerData: unknown = undefined,
  _options: Partial<Options> = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    const options: Options = {
      ...defaultOptions,
      ..._options
    };
    let worker: string | Worker;
    if (typeof workerPathOrInstance === 'string') {
      worker = new Worker(workerPathOrInstance, {
        workerData
      });
    } else {
      worker = workerPathOrInstance;
      worker.postMessage(workerData);
    }
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
