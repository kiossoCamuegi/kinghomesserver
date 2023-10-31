const GoogleSrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const GOOGLE_CLIENT_ID ="892848322668-c6cgcvrt17nphd9qptci98l82dilfmvn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET ="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"; 


passport.use(new GoogleSrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL: "/authsignin/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) { 
      return done(null,profile); 
  }
));


passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.deserializeUser((user, done)=>{
    done(null, user)
})

