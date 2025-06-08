export const PostgresWorkerConstants = {
  LISTEN_CHANNEL: 'file_outbox_created',
  NO_PAYLOAD_WARNING: 'Received notification with no fileOutboxId',
  WORKER_CONNECTED: 'Worker connected',
  WORKER_DISCONNECTED: 'Worker disconnected',
  WORKER_ERROR: 'Worker error:',
  STARTED_PROCESSING_PREFIX: 'STARTED processing file outbox with ID:',
  ERROR_PROCESSING_FILE_OUTBOX: 'Error processing file outbox with ID:',
  FILE_OUTBOX_NOT_FOUND: 'File outbox not found',
};
