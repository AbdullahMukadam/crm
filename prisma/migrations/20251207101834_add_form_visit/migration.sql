-- CreateTable
CREATE TABLE "FormVisit" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormVisit_username_visitDate_idx" ON "FormVisit"("username", "visitDate");

-- CreateIndex
CREATE INDEX "FormVisit_username_deviceType_idx" ON "FormVisit"("username", "deviceType");
