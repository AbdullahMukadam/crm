
import { NotificationType, PrismaClient } from "@prisma/client";

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}

const prisma = new PrismaClient()

export async function createNotification({
  userId,
  title,
  message,
  type,
  link
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}