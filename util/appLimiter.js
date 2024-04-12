const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: async (request, response) => {
    response.status(404).json({
      message:
        'You have sent too many requests. We cannot allow a DDOS attack.',
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const apiLimiterUpload = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: async (request, response) => {
    response.status(404).json({
      message: "Siz juda Ko'p so'rov yubordingiz! DDOS hujum amalga oshirmang",
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { apiLimiter, apiLimiterUpload };
