const router = require('express').Router();
const Stripe = require('stripe')
const { createToken, validateToken } = require('../auth');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const User = require('../models/User');
const Note = require('../models/Note');

async function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) throw new Error('You are not authorized to perform that action');

    const data = await validateToken(token);

    const user = await User.findById(data.user_id);

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({
      error: true,
      message: err.message
    });
  }
}


/***  User routes ***/
// Register user
router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);

    const token = await createToken(user._id);

    res.cookie('token', token, {
      httpOnly: true
    });

    res.send({
      user
    });

  } catch (err) {
    console.log(err);
    res.status(401).send({
      error: true,
      message: err.message
    });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    }).populate('notes');

    if (!user) throw new Error('A user with that email address does not exist');

    const valid_pass = await user.validatePass(req.body.password);

    if (!valid_pass) throw new Error('Password is incorrect');

    // User is verified
    const token = await createToken(user._id);

    res.cookie('token', token, { httpOnly: true });

    res.send({ user });
  } catch (err) {
    console.log(err);
    res.status(401).send({
      error: true,
      message: err.message
    });
  }
});

// Check if user is logged in
router.get('/authenticated', async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.send({ user: null });

    const data = await validateToken(token);

    const user = await User.findById(data.user_id).populate('notes');

    res.send({ user });
  } catch (err) {
    res.send({
      user: null
    });
  }
});

// Log out user
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logged out successfully');
});

/*** Note routes ***/
// Create a note
router.post('/note', isAuthenticated, async (req, res) => {
  const note = await Note.create({
    text: req.body.text,
    author: req.user._id
  });

  const user = await User.findByIdAndUpdate(req.user._id, {
    $push: {
      notes: note._id
    }
  }, { new: true }).populate('notes');

  res.send({
    user
  });
});

// Get All Notes
router.get('/notes', async (req, res) => {
  const notes = await Note.find().populate('author');

  res.send({ notes });
});
//payment received
router.post('/payment',  async (req,  res) =>{
  try{
    const { id, amount} = req.body
    await stripe.paymentIntents.create({
    amount,
    currency: 'USD',
    payment_method: id,
    confirm: true
    })
    console.log('Payment successfull');
    res.send({message: 'Succesfull payment'})
  }catch(error) {
    console.error('Error with your payment:', error);
    res.status(500).json({ message: error.raw.message});
  }
});

//delete notes
router.delete('/note/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
   
    await Note.findByIdAndDelete(noteId);
    res.sendStatus(204); 
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'An error occurred while deleting the note.' });
  }
});

// Route to save a user's score
router.post('/score', async (req, res) => {
  const { userId, score } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { $set: { score } }, { new: true });
    return res.json({ user });
  } catch (error) {
    console.error('Error saving score:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch a user's score
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ score: user.score });
  } catch (error) {
    console.error('Error fetching user score:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;

