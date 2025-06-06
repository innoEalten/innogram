-- DropForeignKey
ALTER TABLE "file_outbox" DROP CONSTRAINT "file_outbox_file_id_fkey";

-- AddForeignKey
ALTER TABLE "file_outbox" ADD CONSTRAINT "file_outbox_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
