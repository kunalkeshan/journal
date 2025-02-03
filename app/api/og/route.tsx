import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  if (!title) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 80,
            color: 'white',
            background: 'black',
            width: '100%',
            height: '100%',
            padding: '50px 200px',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          👋 Journal | Kunal Keshan
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } else {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 80,
            color: 'white',
            background: 'black',
            width: '100%',
            height: '100%',
            padding: '50px 200px',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {title}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
