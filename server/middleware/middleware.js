import jwt from 'jsonwebtoken'
import User from '../models/userSchema.js'

export const authenticate = async (req,res,next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if(!token){
    return res.status(401).json({message: 'unauthorized'});
  }
  try {
    const decoded = jwt.verify(token, 'yoursecret');
    const user = await User.findById(decoded.userId);
    if(!user){
      throw new Error();
    }
    req.user = user;
    console.log(req.user)
    next();
  } catch (error) {
    return res.status(401).json({message: 'unauthenticated'});
  }
};

// export const authorize = async (req, res, next) => {
//   // Check if the user is authenticated
//   if (!req.user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
  
//   // Check if the post exists
//   try {
//     const postId = req.params.id;
//     const post = await PostMessage.findById(postId);
//     // console.log(post.author.toString())
//     // console.log(req.user._id.toString())
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     // Check if the user is the author of the post
//     if (post.author.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Forbidden: You are not authorized to perform this action' });
//     }

//     // If the user is authorized, proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error('Error authorizing:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


