const validatePost = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ 
      error: 'Title is required and must be at least 3 characters long' 
    });
  }

  if (!content || content.trim().length < 10) {
    return res.status(400).json({ 
      error: 'Content is required and must be at least 10 characters long' 
    });
  }

  next();
};

const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ 
      error: 'Username is required and must be at least 3 characters long' 
    });
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ 
      error: 'Valid email is required' 
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ 
      error: 'Password is required and must be at least 6 characters long' 
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }

  next();
};

export {
  validatePost,
  validateRegistration,
  validateLogin
};