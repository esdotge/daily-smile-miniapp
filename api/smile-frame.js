// /api/smile-frame.js
export default function handler(req, res) {
  const appUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const miniAppTargetUrl = `${appUrl}/index.html`;
  // Para la imagen del frame, puedes crear una simple con el logo de $MILE o una cara sonriente
  // y ponerla en public/images/daily-smile-frame-image.png
  const frameImageUrl = `${appUrl}/images/daily-smile-frame-image.png`; 

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameImageUrl}" />
        <meta property="fc:frame:button:1" content="Share your Daily Smile!" />
        <meta property="fc:frame:button:1:action" content="miniapp" />
        <meta property="fc:frame:button:1:target" content="${miniAppTargetUrl}" />
        
        <meta property="og:title" content="Daily Smile for $MILE" />
        <meta property="og:image" content="${frameImageUrl}" />
        <title>Daily Smile Frame</title>
      </head>
      <body>
        <h1>Daily Smile for $MILE Frame</h1>
        <p>Open this in a Farcaster client to share your smile!</p>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}