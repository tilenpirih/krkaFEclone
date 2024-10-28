export async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }
  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
      reader.onloadend = () => {
          resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
}