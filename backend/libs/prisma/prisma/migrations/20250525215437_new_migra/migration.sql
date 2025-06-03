/*
  Warnings:

  - You are about to drop the `post_comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_comments" DROP CONSTRAINT "post_comments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "post_comments" DROP CONSTRAINT "post_comments_post_id_fkey";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "bio" DROP NOT NULL;

-- DropTable
DROP TABLE "post_comments";
