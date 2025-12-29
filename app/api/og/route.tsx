import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=Your+Proposal+Title
    const title = searchParams.get('title') || 'StudioFlow';
    const subtitle = searchParams.get('subtitle') || 'The All-in-One Freelance OS';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030712', // Zinc-950
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background Glow Effect */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '800px',
              height: '800px',
              backgroundImage: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
             {/* Simple SVG representation for OG (inline because components aren't fully supported in edge) */}
             <svg width="64" height="64" viewBox="0 0 40 40" fill="none">
                <path d="M11 18V26C11 31.5228 15.4772 36 21 36H22" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
                <path d="M29 22V14C29 8.47715 24.5228 4 19 4H18" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
             </svg>
             <span style={{ fontSize: 48, fontWeight: 800, color: 'white', marginLeft: 16 }}>StudioFlow</span>
          </div>

          {/* Text Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                background: 'linear-gradient(to bottom right, #ffffff, #94a3b8)',
                backgroundClip: 'text',
                color: 'transparent',
                margin: '0 0 20px 0',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 32,
                color: '#94a3b8',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}