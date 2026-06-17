import { Linking } from 'react-native';

export async function openXCompose(text) {
  const encodedText = encodeURIComponent(text);
  const appUrl = `twitter://post?message=${encodedText}`;
  const webUrl = `https://x.com/intent/tweet?text=${encodedText}`;

  try {
    await Linking.openURL(appUrl);
  } catch {
    await Linking.openURL(webUrl);
  }
}
