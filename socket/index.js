let ioRef = null;

export const initSocket = (io) => {
  ioRef = io;
  io.on('connection', (socket) => {
    console.log('🧠 Socket connected:', socket.id);
  });
};

export const broadcastBid = (memeId, bid) => {
  if (ioRef) ioRef.emit('newBid', { memeId, bid });
};

export const broadcastVote = (memeId, upvotes) => {
  if (ioRef) ioRef.emit('newVote', { memeId, upvotes });
};
