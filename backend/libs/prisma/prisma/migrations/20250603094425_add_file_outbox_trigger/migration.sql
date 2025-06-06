-- This is an empty migration.
CREATE OR REPLACE FUNCTION notify_file_outbox()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('file_outbox_created', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to notify when a new file action is added to the outbox
CREATE TRIGGER trg_notify_file_outbox
AFTER INSERT ON file_outbox
FOR EACH ROW
EXECUTE FUNCTION notify_file_outbox();