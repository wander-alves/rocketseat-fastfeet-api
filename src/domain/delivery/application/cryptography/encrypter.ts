export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
  abstract generateHash(plain: string): Promise<string>;
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
