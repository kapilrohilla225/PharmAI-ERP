const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const BACKEND_FULL = (process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/+$/, "");
const GOOGLE_CALLBACK = `${BACKEND_FULL}/api/v1/auth/google/callback`;

console.log("[PASSPORT] === Google OAuth Debug ===");
console.log("[PASSPORT] BACKEND_URL from env:", process.env.BACKEND_URL);
console.log("[PASSPORT] PORT from env:", process.env.PORT);
console.log("[PASSPORT] Resolved callback URL:", GOOGLE_CALLBACK);
console.log("[PASSPORT] Client ID configured:", !!process.env.GOOGLE_CLIENT_ID);
console.log("[PASSPORT] Client ID:", process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            fullName: profile.displayName,
            email,
            password: `google_${profile.id}`,
            role: "employee",
            avatar: profile.photos?.[0]?.value || "",
            isDefaultAdmin: false,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
