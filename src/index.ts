/**
 * Library for unpacking and repacking BYOND .rsc files
 *
 * @remarks
 * The {@link (unpackRsc:1)} and {@link packRsc} functions are used to convert between buffers and arrays
 * of {@link RscEntry | RscEntries}, the latter are used to see and manipulate the contents of the files inside the .rsc
 *
 * @packageDocumentation
 */

export { ResourceType } from "./constants.js";
export { unpackRsc } from "./unpack.js";
export { packRsc } from "./pack.js";
export { RscEntry, EmptyRscEntry, BaseRscEntry } from "./rsc_entry.js";
export type { UnpackOptions } from "./unpack.js";
export type { MaybeEmptyRscEntry } from "./rsc_entry.js";
