/*
  Warnings:

  - Added the required column `username` to the `Branding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branding" ADD COLUMN     "username" TEXT NOT NULL;
