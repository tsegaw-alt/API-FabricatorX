import { BlacklistedTokenModel } from "../components/auth/v1/data/interfaces/blacklistedTokenModel";

export async function checkIfTokenIsBlacklisted(token: string): Promise<boolean> {
  const foundToken = await BlacklistedTokenModel.findOne({ token });
  return !!foundToken;
}
