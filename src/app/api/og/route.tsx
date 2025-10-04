// Dynamic OG Image Generation for Projects
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get project details from query params
    const projectName = searchParams.get('name') || 'SENU Project';
    const clientName = searchParams.get('client') || '';
    const category = searchParams.get('category') || 'Creative Project';
    const description = searchParams.get('description') || '';
    const clientLogo = searchParams.get('logo') || '';

    // Truncate description to fit
    const truncatedDescription = description.length > 120 
      ? description.substring(0, 120) + '...' 
      : description;

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
            backgroundColor: '#000000',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            position: 'relative',
          }}
        >
          {/* Top gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '300px',
              background: 'linear-gradient(180deg, rgba(79, 175, 120, 0.15) 0%, transparent 100%)',
              display: 'flex',
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              zIndex: 10,
            }}
          >
            {/* Client Logo */}
            {clientLogo && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '120px',
                  height: '120px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  marginBottom: '32px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <img
                  src={clientLogo}
                  alt={clientName}
                  width="100"
                  height="100"
                  style={{
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </div>
            )}

            {/* Client Name (if no logo) */}
            {!clientLogo && clientName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '120px',
                  height: '120px',
                  backgroundColor: 'rgba(79, 175, 120, 0.2)',
                  borderRadius: '16px',
                  marginBottom: '32px',
                  border: '2px solid rgba(79, 175, 120, 0.4)',
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: '#4FAF78',
                }}
              >
                {clientName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Project Name */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: '24px',
                lineHeight: 1.2,
                maxWidth: '1000px',
                display: 'flex',
              }}
            >
              {projectName}
            </div>

            {/* Category Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(79, 175, 120, 0.2)',
                border: '2px solid rgba(79, 175, 120, 0.4)',
                borderRadius: '12px',
                padding: '12px 32px',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  fontSize: '28px',
                  color: '#4FAF78',
                  fontWeight: '600',
                }}
              >
                {category}
              </span>
            </div>

            {/* Description */}
            {truncatedDescription && (
              <div
                style={{
                  fontSize: '24px',
                  color: '#A0A0A0',
                  textAlign: 'center',
                  maxWidth: '900px',
                  lineHeight: 1.5,
                  marginBottom: '32px',
                  display: 'flex',
                }}
              >
                {truncatedDescription}
              </div>
            )}

            {/* Client Name (if logo exists) */}
            {clientLogo && clientName && (
              <div
                style={{
                  fontSize: '28px',
                  color: '#808080',
                  marginBottom: '16px',
                  display: 'flex',
                }}
              >
                {clientName}
              </div>
            )}

            {/* SENU Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '32px',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  display: 'flex',
                }}
              >
                SENU
              </div>
              <div
                style={{
                  fontSize: '24px',
                  color: '#808080',
                  display: 'flex',
                }}
              >
                Creative Studio
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #4FAF78 0%, #3B8A5E 100%)',
              display: 'flex',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate image: ${e instanceof Error ? e.message : 'Unknown error'}`, {
      status: 500,
    });
  }
}
