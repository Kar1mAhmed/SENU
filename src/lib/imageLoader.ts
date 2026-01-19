export default function cfImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    // If the image is coming from our R2 media domain, optimize it via Cloudflare
    if (src.startsWith('https://media.senu.studio/') && !src.includes('/cdn-cgi/image/')) {
        const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto'];
        return `https://media.senu.studio/cdn-cgi/image/${params.join(',')}/${src.replace('https://media.senu.studio/', '')}`;
    }

    // Return original src if not matching our domain pattern (or local images)
    // Note: local images in public/ might need standard handling, but usually loader is used for remote
    return src;
}
