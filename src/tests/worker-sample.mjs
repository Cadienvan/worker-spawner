import { parentPort } from 'worker_threads';
if (parentPort) {
  parentPort.on('message', (payload) => {
    parentPort.postMessage(payload * 2);
  });
}
