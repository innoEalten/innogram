/*
  Warnings:

  - You are about to drop the column `payload` on the `file_outbox` table. All the data in the column will be lost.
  - Added the required column `action` to the `file_outbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_path` to the `file_outbox` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileAction" AS ENUM ('MOVE_TO_PERMANENT_STORAGE', 'DELETE_FROM_PERMANENT_STORAGE');

-- AlterTable
ALTER TABLE "file_outbox" DROP COLUMN "payload",
ADD COLUMN     "action" "FileAction" NOT NULL,
ADD COLUMN     "target_path" TEXT NOT NULL;
