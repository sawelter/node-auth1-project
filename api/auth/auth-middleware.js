const User = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
async function restricted(req, res, next) {
  console.log(req.session.user);
  if(req.session.user) {
    next();
  } else {
    next({status: 401, message: "You shall not pass!"})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body;
    const [user] = await User.findBy({username});
    if(user) {
      res.status(422).json({message: "Username taken"});
    } else {
      next();
    }
  } catch(err) {
    next(err);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const { username } = req.body;
    const [user] = await User.findBy({username});
    if(!user) {
      res.status(422).json({message: "Invalid credentials"});
    } else {
      next();
    }
  } catch(err) {
    next(err);
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if(!password || password.length <= 3) {
    res.status(422).json({message: "Password must be longer than 3 chars"})
  } else {
    next();
  }
}


module.exports = {
  restricted,
  checkUsernameFree, 
  checkUsernameExists,
  checkPasswordLength
}