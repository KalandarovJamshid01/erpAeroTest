const catchErrorAsync = require('../util/catchError');
const db = require('./../model/index');
const users = db.users;
const responseFunction = require('./../util/response');
const userMe = catchErrorAsync(async (req, res, next) => {
  const user = await users.findOne({
    where: {
      id: req.user.id,
    },
    attributes: { exclude: ['password'] },
  });
  responseFunction(req, res, 200, user, 1);
});
module.exports = { userMe };
