export async function shareProperty(props: {
  title: string;
  location: string;
  pricePerFraction?: string;
  yieldPercent?: string;
  url?: string;
  imageUrl?: string;
}) {
  const { title, location, pricePerFraction, yieldPercent, url, imageUrl } = props;

  const text = [
    `🏠 ${title}`,
    `📍 ${location}`,
    pricePerFraction ? `💰 ${pricePerFraction}` : null,
    yieldPercent ? `📈 ${yieldPercent}` : null,
    '',
    'Fractional Living — All Global Holding LLC',
  ].filter(Boolean).join('\n');

  const shareUrl = url || window.location.href;

  if (navigator.share) {
    try {
      const shareData: ShareData = {
        title,
        text,
        url: shareUrl,
      };

      if (imageUrl && navigator.canShare) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'property.jpg', { type: blob.type });
          const withFile = { ...shareData, files: [file] };
          if (navigator.canShare(withFile)) {
            shareData.files = [file];
          }
        } catch {
        }
      }

      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        fallbackShare(text, shareUrl);
      }
    }
  } else {
    fallbackShare(text, shareUrl);
  }
}

function fallbackShare(text: string, url: string) {
  const whatsappText = encodeURIComponent(`${text}\n\n${url}`);
  window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
}
