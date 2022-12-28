import { workerData, parentPort } from 'worker_threads';
if (parentPort) {
  for (let i = 0; i < workerData.length; i++) {
    workerData[i] =
    {
      value: workerData[i],
      double: workerData[i] * 2,
      square: workerData[i] ** 2,
      cube: workerData[i] ** 3,
      hash: workerData[i].toString(16)
    }
  }
  parentPort.postMessage(workerData);
}
