'use server';

export async function translateText(text: string): Promise<string> {
    if (!text) return '';

    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fa&tl=en&dt=t&q=${encodeURIComponent(text)}`
        );

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();
        // The structure returned by gtx is an array of arrays.
        // data[0] contains the translated segments.
        // data[0][x][0] is the translated text.

        const translatedText = data[0].map((segment: any) => segment[0]).join('');
        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text on failure
    }
}
