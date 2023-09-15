const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Hashes the given password using bcrypt.
 * @param password - The plaintext password.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares the given plaintext password with the hashed password.
 * @param password - The plaintext password.
 * @param hashedPassword - The hashed password.
 * @returns True if the plaintext password matches the hashed password, false otherwise.
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
