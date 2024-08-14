import { ResourceType } from "./constants.js";
import { encodeCString } from "./util.js";

/**
 * Entry in an RSC file
 * @public
 */
export abstract class BaseRscEntry {
  /**
   * Gets the size that must be allocated for this entry and its metadata
   *
   * @virtual
   * @internal
   */
  abstract get rawSize(): number;

  /**
   * Whether this entry is used in the DMB file
   *
   * @remarks
   * When compiling a DMB file, unless the RSC file is deleted or a clean compile is requested, entries that were
   * previously included in the RSC file are not deleted. This field indicates whether this entry is in use or not.
   * @virtual
   */
  public abstract readonly used: boolean;

  /**
   * Contents of the entry.
   *
   * @remarks
   * This buffer may be a view on the buffer originally passed to {@link unpackRsc}. Modifying this buffer could
   * modify the other buffer and vice versa.
   */
  public content: Uint8Array;

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor({ content }: { content: Uint8Array }) {
    this.content = content;
  }
}

/**
 * A hole in the rsc file
 *
 * @remarks
 * Data in {@link BaseRscEntry.content} is meaningless but is included in the rsc file for lossless (un)packing
 *
 * @public
 */
export class EmptyRscEntry extends BaseRscEntry {
  /**
   * {@inheritDoc BaseRscEntry.used}
   * @override
   * @public
   */
  public readonly used = false as const;

  /**
   * {@inheritDoc BaseRscEntry.rawSize}
   * @override
   * @internal
   */
  override get rawSize() {
    return (
      this.content.byteLength +
      4 + //this.content.byteLength
      1 //this.used
    );
  }

  constructor(options: ConstructorParameters<typeof BaseRscEntry>[0]) {
    super(options);
  }
}

/**
 * Entry representing a single file in an RSC file
 * @public
 */
export class RscEntry extends BaseRscEntry {
  /**
   * {@inheritDoc BaseRscEntry.used}
   * @override
   * @public
   */
  public readonly used = true as const;

  /**
   * Project relative path
   */
  public path: string;
  /**
   * The type of this entry. See {@link ResourceType}
   *
   * @defaultValue ResourceType.Unknown
   */
  public type = ResourceType.Unknown;
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
   * Extra content at the end of the entry
   *
   * @remarks
   * When a file is updated with a smaller version, the extra data will be left in at the end
   * @defaultValue new Uint8Array();
   */
  public padding = new Uint8Array();

  /**
   * {@inheritDoc BaseRscEntry.rawSize}
   * @override
   * @internal
   */
  override get rawSize() {
    return (
      encodeCString(this.path).length +
      this.content.byteLength +
      4 + //this.content.byteLength
      1 + //this.type and this.encrypted
      1 + //this.used
      4 + //this.added
      4 + //this.modified
      4 + //this.checksum
      4 + //this.rawSize
      this.padding.byteLength
    );
  }

  constructor({
    path,
    type,
    encrypted,
    added,
    modified,
    padding,
    ...options
  }: {
    content: RscEntry["content"];
    path: RscEntry["path"];
    type: RscEntry["type"];
    encrypted?: RscEntry["encrypted"];
    added?: RscEntry["added"];
    modified?: RscEntry["modified"];
    padding?: RscEntry["padding"];
  }) {
    super(options);
    this.path = path;
    this.type = type;
    this.encrypted = encrypted ?? this.encrypted;
    this.added = added ?? this.added;
    this.modified = modified ?? this.modified;
    this.padding = padding ?? this.padding;
  }
}

/**
 * Used to discriminate between {@link RscEntry} and {@link EmptyRscEntry} based on {@link BaseRscEntry.used}
 *
 * @public
 */
export type MaybeEmptyRscEntry = RscEntry | EmptyRscEntry;
