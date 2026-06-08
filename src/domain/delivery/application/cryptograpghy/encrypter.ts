abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;

  abstract hash(plainText: string): Promise<string>;
  abstract compare(plainText: string, hash: string): Promise<boolean>;
}

export { Encrypter };
