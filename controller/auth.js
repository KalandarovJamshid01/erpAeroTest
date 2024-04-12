const AppError = require('../util/AppError');
const db = require('./../model/index');
const users = db.users;
const catchErrorAsync = require('./../util/catchError');
const responseFunction = require('./../util/response');

const verifyUser = catchErrorAsync(async (id, password) => {
  if (!(id && password)) {
    return next(new AppError('Please, enter password and id', 400));
  }
  const user = await users.findOne({
    where: { id: id },
  });
  if (!user) {
    return next(
      new AppError(
        'This user does not exist in the system, please register',
        404
      )
    );
  }
  const checkPass = async (usrPass, hashPass) => {
    const check = await bcrypt.compare(usrPass, hashPass);
    return check;
  };
  if (!(await checkPass(password, user.password))) {
    return next(
      new AppError(
        'Your password or login is incorrect! Please try again!',
        401
      )
    );
  }

  const payload = { id: user.id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
    expiresIn: process.env.JWT_EXPIRES_IN_ACCESS,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
    expiresIn: process.env.JWT_EXPIRES_IN_REFRESH,
  });

  return { accessToken, refreshToken };
});
const signUp = catchErrorAsync(async (req, res, next) => {
  const { id, password } = req.body;

  if (!(id && password)) {
    return next(new AppError('Please, enter password and id', 400));
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = await users.create({
    id: req.body.id,
    password: hash,
  });
  const { refreshToken, accessToken } = await verifyUser(
    user.id,
    user.password
  );
  responseFunction(req, res, 201, {
    refreshToken,
    accessToken,
  });
});

const signIn = catchErrorAsync(async (req, res) => {
  const { id, password } = req.body;
  const { refreshToken, accessToken } = await verifyUser(id, password);
  responseFunction(req, res, 201, {
    refreshToken,
    accessToken,
  });
});

const signInRefresh = catchErrorAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const payload = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
  const id = payload.id;

  // Generate a new access token using the user ID
  const newAccessToken = jwt.sign({ id: id }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: process.env.JWT_EXPIRES_IN_ACCESS,
  });
  responseFunction(req, res, 200, { accessToken: newAccessToken }, 1);
});
const logout = catchErrorAsync(async (req, res, next) => {
  req.session.destroy();
  responseFunction(req, res, 200, 'Logout successful', 1);
});

module.exports = { signUp, signIn, logout, signInRefresh };
