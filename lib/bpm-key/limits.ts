/** Caps for the in-browser analyzer. A stereo WAV is about 10 MB a minute, so the byte cap has to clear an 8 minute export. */
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
export const MAX_DURATION_SECONDS = 8 * 60;
export const MIN_DURATION_SECONDS = 2;
