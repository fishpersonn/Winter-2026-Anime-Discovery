/**
 * Generates a Google Translate URL for the given text.
 * This avoids using the Gemini API quota entirely.
 */
export const getGoogleTranslateUrl = (text: string): string => {
  if (!text) return "#";
  const encodedText = encodeURIComponent(text);
  // Source: Auto (or English), Target: Traditional Chinese (zh-TW)
  return `https://translate.google.com/?sl=auto&tl=zh-TW&text=${encodedText}&op=translate`;
};