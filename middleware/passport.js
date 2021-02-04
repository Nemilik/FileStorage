const passport = require('passport');
const db = require('../db');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT
}

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await db.getUser(payload.id);
        const isToken = await db.getToken(payload.id);
        
        if (user && isToken) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch(e) {
        console.log(e); 
      }
    })
  );
}