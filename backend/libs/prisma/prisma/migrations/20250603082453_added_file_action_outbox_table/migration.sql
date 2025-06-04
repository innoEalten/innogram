-- CreateTable
CREATE TABLE "file_action_outbox" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "file_action_outbox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file_action_outbox" ADD CONSTRAINT "file_action_outbox_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
