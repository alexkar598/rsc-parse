import { ResourceType } from "./constants.js";
import { encodeCString } from "./util.js";

/**
 * Entry representing a single file in an RSC file
 * @public
 */
export class RscEntry {
  /**
   * Project relative path
   */
  public path: string;
  /**
   * Contents of the entry.
   *
   * @remarks
   * This buffer may be a view on the buffer originally passed to {@link unpackRsc}. Modifying this buffer could
   * modify the other buffer and vice versa.
   */
  public content: Uint8Array;
  /**
   * The type of this entry. See {@link ResourceType}
   *
   * @defaultValue ResourceType.Unknown
   */
  public type = ResourceType.Unknown;
  /**
   * Whether this entry is used in the DMB file
   *
   * @remarks
   * When compiling a DMB file, unless the RSC file is deleted or a clean compile is request, entries that were
   * previously included in the RSC file are not deleted. This field indicates whether this entry is in use or not.
   *
   * @defaultValue true
   */
  public used = true;
  /**
   * Whether this entry's contents are encrypted
   *
   * @remarks
   * Decryption of encrypted entries is not supported in this library.
   *
   * @defaultValue false
   */
  public encrypted = false;
  /**
   * Date this entry was added
   *
   * @defaultValue new Date();
   */
  public added = new Date();
  /**
   * Date this entry was updated
   *
   * @defaultValue new Date();
   */
  public modified = new Date();

  /**
   * Gets the size that must be allocated for this entry and its metadata
   *
   * @internal
   */
  rawSize() {
    return (
      encodeCString(this.path).length +
      this.content.byteLength +
      4 + //this.content.byteLength-
      1 + //this.type and this.encrypted-
      1 + //this.used-
      4 + //this.added-
      4 + //this.modified-
      4 + //this.checksum-
      4 //this.rawSize-
    );
  }

  constructor({
    path,
    content,
    type,
    used,
    encrypted,
    added,
    modified,
  }: {
    path: RscEntry["path"];
    content: RscEntry["content"];
    type: RscEntry["type"];
    used?: RscEntry["used"];
    encrypted?: RscEntry["encrypted"];
    added?: RscEntry["added"];
    modified?: RscEntry["modified"];
  }) {
    this.path = path;
    this.content = content;
    this.type = type;
    this.used = used ?? this.used;
    this.encrypted = encrypted ?? this.encrypted;
    this.added = added ?? this.added;
    this.modified = modified ?? this.modified;
  }
}
