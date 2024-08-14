/**
 * Type of {@link RscEntry | entry}
 * @public
 */
export enum ResourceType {
  /**
   * Unknown file
   */
  Unknown = 0x0,
  /**
   * Sequencer file (.mid, .midi, .mod, .s3m, .xm, .it, .oxm)
   */
  Sequencer = 0x1,
  /**
   * Audio file (.wav, .ogg, .raw, .wma, .aiff)
   */
  Audio = 0x2,
  /**
   * Sprite sheet file (.dmi)
   */
  SpriteSheet = 0x3,
  /**
   * Bitmap file (.bmp)
   */
  Bitmap = 0x5,
  /**
   * Lossless image file (.png)
   */
  LosslessImage = 0x6,
  /**
   * Archive file (.zip)
   */
  Archive = 0x9,
  /**
   * Resource archive file (.rsc)
   */
  Resource = 0xa,
  /**
   * Lossy image file (.jpg, .jpeg)
   */
  LossyImage = 0xb,
  /**
   * Dynamic sprite sheet file (.ddmi)
   */
  DynamicSpriteSheet = 0xc,
  /**
   * Animated image file (.gif)
   */
  AnimatedImage = 0xd,
  /**
   * Font file (.ttf)
   */
  Font = 0xe,
}
