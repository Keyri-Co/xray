// index.d.ts

/**
 * Options for the `scan` method of XRAY class.
 */
export interface ScanOptions {
  /**
   * The API URL to be used in the scan process.
   */
  apiUrl: string;
}

/**
* Result from the `scan` method of XRAY class.
*/
export interface ScanResult {
  /**
   * The encrypted payload, encoded in base64.
   */
  encryptedB64Payload: string;
}

/**
* Class representing the XRAY functionality.
* This class handles the loading and instantiation of the XRAY object.
*/
export class XRAY {
  /**
   * The source URL for the iframe, if provided.
   * @private
   */
  private iframeSrc?: string;

  /**
   * Constructor for the XRAY class.
   * @param iframeSrc - Optional source URL for the iframe.
   */
  constructor(iframeSrc?: string);

  /**
   * Loads the necessary components for the XRAY functionality.
   * This method dynamically loads and decodes a base64-encoded string
   * representing the library, and initializes an instance of XRAY.
   * @returns A promise that resolves when the loading is complete.
   */
  load(): Promise<void>;

  /**
   * Instance of XRAY, created after `load` method is called.
   */
  xray?: XRAY;

  /**
   * Scans and processes data based on provided options.
   * @param options - The options for the scan, including API URL.
   * @returns A promise that resolves to the scan result.
   */
  scan(options: ScanOptions): Promise<ScanResult>;
}
