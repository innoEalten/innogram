-- DropIndex
DROP INDEX "idx_file_id";

-- DropIndex
DROP INDEX "idx_post_created_at";

-- CreateIndex
CREATE INDEX "idx_message_chat_id" ON "messages"("chat_id");

-- CreateIndex
CREATE INDEX "idx_message_sender_id" ON "messages"("sender_id");
