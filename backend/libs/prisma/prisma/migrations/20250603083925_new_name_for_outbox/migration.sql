/*
  Warnings:

  - You are about to drop the `file_action_outbox` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "file_action_outbox" DROP CONSTRAINT "file_action_outbox_file_id_fkey";

-- DropTable
DROP TABLE "file_action_outbox";

-- CreateTable
CREATE TABLE "file_outbox" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "file_outbox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file_outbox" ADD CONSTRAINT "file_outbox_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
