import { parentPort } from 'worker_threads';
if (parentPort) {
  // A fake expensive operation
  const start = Date.now();
  while (Date.now() - start < 1000) {
    return;
  }
  parentPort.on('message', (payload) => {
    parentPort.postMessage(payload * 2);
  });
}
