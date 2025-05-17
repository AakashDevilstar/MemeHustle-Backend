import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateGeminiCaptionForUI = async (tags = [], memeId) => {
  if (memeId && captionCache[memeId]) return captionCache[memeId];
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prompt for very short captions (max 10 words)
    const prompt = `Generate 1-3 very short, funny meme captions using these tags: ${tags.join(', ')}.
    
    Requirements:
    - Maximum 10 words per caption
    - Simple, relatable humor
    - No markdown, hashtags, or formatting
    - Just plain text captions
    
    Example for tags "mom, dad":
    Dad loves mom
    Mom and dad vibes
    Parents being parents
    
    Generate captions now:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Parse and filter captions by word count
    const captions = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        if (!line || line.includes('*') || line.includes('#')) return false;
        const wordCount = line.split(' ').length;
        return wordCount <= 10;
      })
      .slice(0, 3);
    
    const result_obj = {
      mainCaption: captions[0] || 'Epic meme moment'
    };
    
    if (memeId) captionCache[memeId] = result_obj;
    return result_obj;
    
  } catch (err) {
    console.error('Gemini API error:', err);
    return {
      mainCaption: 'Meme loading failed',
      alternatives: ['AI having moment', 'Error vibes'],
      hasAlternatives: true
    };
  }
};

export default generateGeminiCaptionForUI;  