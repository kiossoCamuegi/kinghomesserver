const GoogleSrategy = require("passport-google-oauth20").Strategy; 

const passport = require("passport");
const GOOGLE_CLIENT_ID ="959711940394-1pift6k8fivnde1hf2otnbajcbmvh181.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET ="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";  


passport.use(new GoogleSrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
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


