// lib/music.ts
// Direct JioSaavn API Integration
import CryptoJS from 'crypto-js';

const JIOSAAVN_BASE = 'https://www.jiosaavn.com/api.php';

export function decryptUrl(url: string): string {
    if (!url) return '';
    try {
        const key = CryptoJS.enc.Utf8.parse('38346591');
        const decrypted = CryptoJS.DES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(url) } as any,
            key,
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        let decoded = decrypted.toString(CryptoJS.enc.Utf8);
        return decoded.replace('_96.mp4', '_320.mp4').replace('_96_p.mp4', '_320.mp4');
    } catch (e) {
        console.error('Failed to decrypt URL', e);
        return '';
    }
}

export function getHighResImage(url: string): string {
    if (!url) return '';
    return url.replace('150x150', '500x500').replace('50x50', '500x500');
}

export async function saavnSearch(query: string, type: 'songs' | 'albums' | 'artists' | 'playlists' = 'songs', limit = 20) {
    let callEndpoint = 'search.getResults';
    if (type === 'albums') callEndpoint = 'search.getAlbumResults';
    else if (type === 'playlists') callEndpoint = 'search.getPlaylistResults';
    else if (type === 'artists') callEndpoint = 'search.getArtistResults';

    const res = await fetch(`${JIOSAAVN_BASE}?__call=${callEndpoint}&q=${encodeURIComponent(query)}&n=${limit}&p=1&_format=json&_marker=0&cc=in`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`JioSaavn API error: ${res.status}`);
    const data = await res.json();
    return data;
}

export async function saavnLookup(id: string, type: 'songs' | 'albums' | 'artists' | 'playlists' = 'songs') {
    let url = '';
    if (type === 'songs') {
        url = `${JIOSAAVN_BASE}?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${id}`;
    } else if (type === 'albums') {
        url = `${JIOSAAVN_BASE}?__call=content.getAlbumDetails&_format=json&cc=in&_marker=0%3F_marker%3D0&albumid=${id}`;
    } else if (type === 'playlists') {
        url = `${JIOSAAVN_BASE}?__call=playlist.getDetails&_format=json&cc=in&_marker=0%3F_marker%3D0&listid=${id}`;
    }

    if (!url) throw new Error(`Lookup type ${type} not supported yet`);

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`JioSaavn API error: ${res.status}`);
    const data = await res.json();
    return data;
}
