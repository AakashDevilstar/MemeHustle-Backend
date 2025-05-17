import { supabase } from '../supabase.js';
import { broadcastBid, broadcastVote } from '../socket/index.js';
import  generateGeminiCaption  from '../services/gemini.js';

export const createMeme = async (req, res) => {
  const { title, image_url, tags, owner_id } = req.body;
  if (!owner_id) {
    return res.status(400).json({ error: 'owner_id is required' });
  }
  const { data, error } = await supabase.from('memes').insert([{ title, image_url, tags, upvotes: 0, owner_id }]).select();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(400).json({ error: 'Meme not created' });
  }
  res.status(201).json(data[0]);
};

export const getMemes = async (req, res) => {
  const { data, error } = await supabase.from('memes').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
};

export const bidMeme = async (req, res) => {
  const { credits, user_id } = req.body;
  const memeId = req.params.id;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  // Insert the bid
  const { data, error } = await supabase.from('bids').insert([{ meme_id: memeId, user_id, credits }]).select();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(400).json({ error: 'Bid not created' });
  }
  // Update meme's highest_bid and highest_bidder if this is the highest bid
  const { data: meme } = await supabase.from('memes').select('highest_bid').eq('id', memeId).single();
  if (!meme || credits > (meme.highest_bid || 0)) {
    await supabase.from('memes').update({ highest_bid: credits, highest_bidder: user_id }).eq('id', memeId);
  }
  broadcastBid(memeId, { user_id, credits });
  res.status(201).json(data[0]);
};

export const voteMeme = async (req, res) => {
  const { type } = req.body;
  const memeId = req.params.id;
  const { data: meme } = await supabase.from('memes').select('*').eq('id', memeId).single();
  const upvotes = type === 'up' ? meme.upvotes + 1 : meme.upvotes - 1;
  await supabase.from('memes').update({ upvotes }).eq('id', memeId);
  broadcastVote(memeId, upvotes);
  res.json({ upvotes });
};

export const leaderboard = async (req, res) => {
  const { data } = await supabase.from('memes').select('*').order('upvotes', { ascending: false }).limit(10);
  res.json(data);
};

export const generateCaption = async (req, res) => {
  const memeId = req.params.id;
  const { data: meme } = await supabase.from('memes').select('*').eq('id', memeId).single();
  if (!meme) {
    return res.status(404).json({ error: 'Meme not found' });
  }
  const caption = await generateGeminiCaption(meme.tags);
  await supabase.from('memes').update({ caption }).eq('id', memeId);
  res.json({ caption });
};
