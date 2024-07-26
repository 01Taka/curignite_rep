import argon2 from 'argon2';

/**
 * 文字列をハッシュ化する関数
 * @param plaintext - ハッシュ化する文字列
 * @returns ハッシュ化された文字列
 */
export async function hashString(plaintext: string): Promise<string> {
  try {
    const hash = await argon2.hash(plaintext);
    return hash;
  } catch (err) {
    console.error('Error hashing the string:', err);
    throw new Error('Hashing failed');
  }
}

/**
 * ハッシュ化された文字列を検証する関数
 * @param plaintext - 検証する元の文字列
 * @param hash - ハッシュ化された文字列
 * @returns 検証結果（一致する場合はtrue、そうでない場合はfalse）
 */
export async function verifyHash(plaintext: string, hash: string): Promise<boolean> {
  try {
    const isMatch = await argon2.verify(hash, plaintext);
    return isMatch;
  } catch (err) {
    console.error('Error verifying the hash:', err);
    throw new Error('Verification failed');
  }
}
