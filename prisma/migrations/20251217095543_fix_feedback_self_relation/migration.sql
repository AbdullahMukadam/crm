/*
  Warnings:

  - You are about to drop the `_FeedbackReplies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_FeedbackReplies" DROP CONSTRAINT "_FeedbackReplies_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FeedbackReplies" DROP CONSTRAINT "_FeedbackReplies_B_fkey";

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "parentId" TEXT;

-- DropTable
DROP TABLE "public"."_FeedbackReplies";

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;
