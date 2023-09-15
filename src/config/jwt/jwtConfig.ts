const jwtConfig = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET || "Pn@4Ie#1W%Rm9Gk&7Qy2Ov^3U",
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h", // 1 hour
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || "Yz4#M^9Xt*Fp7IeL$Sv&2Qc1A",
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d", // 7 days
  },
  resetToken: {
    secret: process.env.RESET_TOKEN_SECRET || "8gE$2Gn@H3Wr%f&iD7q^1Mz+",
    expiresIn: process.env.RESET_TOKEN_EXPIRES_IN || "1h", // 1 hour
  },
};

export default jwtConfig;
