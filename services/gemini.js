
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateGeminiCaptionForUI = async (tags = [], memeId) => {
  if (memeId && captionCache[memeId]) return captionCache[memeId];
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Better prompt for UI-friendly output
    const prompt = `Generate 1-3 funny, short meme captions based on these tags: ${tags.join(', ')}.
    
    Format your response as simple text captions, one per line.
    Make them under 100 characters each.
    Don't include markdown formatting, hashtags, or descriptions.
    Just the caption text that would appear on a meme.
    
    Example format:
    Me pretending I have my life together
    When you realize it's already Wednesday
    That moment when you understand the assignment`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Parse the clean response
    const captions = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.includes('*') && !line.includes('#'))
      .slice(0, 3); // Limit to 3 captions max
    
    const result_obj = {
      mainCaption: captions[0] || 'Epic meme caption incoming!',
      alternatives: captions.slice(1),
      hasAlternatives: captions.length > 1
    };
    
    if (memeId) captionCache[memeId] = result_obj;
    return result_obj;
    
  } catch (err) {
    console.error('Gemini API error:', err);
    return {
      mainCaption: 'When the AI is having a moment',
      alternatives: ['Error 404: Humor not found', 'Meme loading... please wait'],
      hasAlternatives: true
    };
  }
};

export default generateGeminiCaptionForUI;