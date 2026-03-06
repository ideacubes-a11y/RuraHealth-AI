let posts = [
  {
    id: 1,
    type: 'crop',
    disease: 'Wheat Rust',
    advice: 'Apply fungicide immediately and ensure good drainage.',
    language: 'English',
    imageUrl: 'https://picsum.photos/seed/wheat/400/300',
    votes: { seenBefore: 12, sameDisease: 5, differentIssue: 1 },
    timestamp: new Date().toISOString()
  }
];
let nextId = 2;

export const getPosts = (req, res) => {
  res.json(posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
};

export const createPost = (req, res) => {
  const { type, disease, advice, language } = req.body;
  const imageUrl = req.file ? `https://picsum.photos/seed/${nextId}/400/300` : 'https://picsum.photos/seed/placeholder/400/300';
  
  const newPost = {
    id: nextId++,
    type,
    disease,
    advice,
    language,
    imageUrl,
    votes: { seenBefore: 0, sameDisease: 0, differentIssue: 0 },
    timestamp: new Date().toISOString()
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
};

export const votePost = (req, res) => {
  const { id } = req.params;
  const { voteType } = req.body;
  
  const post = posts.find(p => p.id === parseInt(id));
  if (!post) return res.status(404).json({ message: 'Post not found' });
  
  if (post.votes[voteType] !== undefined) {
    post.votes[voteType]++;
    res.json(post);
  } else {
    res.status(400).json({ message: 'Invalid vote type' });
  }
};
