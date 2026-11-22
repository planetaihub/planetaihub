export interface ParsedVideoSource {
  type: 'youtube' | 'vimeo' | 'direct' | 'unknown';
  embedUrl: string;
  originalUrl: string;
}

export function parsePlayableVideoSource(rawUrl: string): ParsedVideoSource {
  const url = (rawUrl || '').trim();
  if (!url) {
    return { type: 'unknown', embedUrl: '', originalUrl: '' };
  }

  // YouTube (standard watch, youtu.be, shorts, embed)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://youtube.com{ytMatch[1]}?rel=0&modestbranding=1`,
      originalUrl: url,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://vimeo.com{vimeoMatch[1]}`,
      originalUrl: url,
    };
  }

  // Direct MP4 / WebM / OGG streams
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    return {
      type: 'direct',
      embedUrl: url,
      originalUrl: url,
    };
  }

  return {
    type: 'unknown',
    embedUrl: url,
    originalUrl: url,
  };
}

