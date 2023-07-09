type Base64String = string;

type ScanReturnType = {
  ciphertext: Base64String;
  salt: Base64String;
  iv: Base64String;
  publicEncryptionKey: Base64String;
  apiCiphertextSignature: Base64String;
  clientCipertextSignature: Base64String;
};

type EventType = "access" | "visits" | "signup" | "login";

declare class XRAY {
  public scan(
    eventType: EventType,
    userId: string,
    publicEncryptionKey: Base64String,
    timeout?: number,
    mode?: "safe"
  ): Promise<ScanReturnType>;
}

export { XRAY };
