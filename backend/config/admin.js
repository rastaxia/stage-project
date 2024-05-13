module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '6b74541faf79a86fef963d5d504bb640'),
  },
});
