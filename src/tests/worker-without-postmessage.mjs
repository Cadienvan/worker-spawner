import { workerData, parentPort } from 'worker_threads';
if (parentPort) {
  parentPort.postMessage(workerData * 2);
}