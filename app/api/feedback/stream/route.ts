
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Feedback } from '@/types/project';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId');

  if (!projectId) {
    return new Response('Missing projectId', { status: 400 });
  }


  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;
      let interval: NodeJS.Timeout;


      const sendUpdate = async () => {
        if (isClosed) return;

        try {
          const feedback = await prisma.feedback.findMany({
            where: {
              projectId,
            },
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                  role: true
                }
              },
              replies: {
                include: {
                  author: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                      avatarUrl: true,
                      role: true
                    }
                  }
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          });

          let Feedbackdata: Feedback[] = []
          feedback.forEach((f) => {
            let feedbackTransformedData = {
              id: f.id,
              projectId: f.projectId,
              authorId: f.authorId,
              createdAt: f.createdAt,
              updatedAt: f.updatedAt,
              message: f.message,
              replies: f.replies,
              author: f.author,
            }

            Feedbackdata.push(feedbackTransformedData)

          })

          // Double check before enqueuing
          if (!isClosed) {
            const data = `data: ${JSON.stringify(Feedbackdata)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
        } catch (error) {
          console.error('Stream error:', error);
          // If there's an error, close the stream
          if (!isClosed) {
            isClosed = true;
            clearInterval(interval);
            controller.close();
          }
        }
      };

      // Initial send
      await sendUpdate();

      // Send updates every 2 seconds
      interval = setInterval(sendUpdate, 2000);

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(interval);
        if (!isClosed) {
          controller.close();
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}