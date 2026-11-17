import { useState } from "react"
import { photoAlt, photos, photoUrl } from "../data/images"
import type { ImageKey } from "../data"
import { cx } from "./ui"
import { tr } from "../lib/i18n"

const WIDTHS = [480, 800, 1200, 1600]

interface PhotoProps {
  image: ImageKey
  className?: string
  sizes?: string
  priority?: boolean
  /** Pass an empty string when the photo is purely decorative. */
  alt?: string
}

export function Photo({
  image,
  className,
  sizes = "100vw",
  priority = false,
  alt,
}: PhotoProps) {
  const [failed, setFailed] = useState(false)
  const photo = photos[image]
  const label = alt ?? photoAlt(image)

  if (failed) {
    // Offline before the photo was cached: show a branded placeholder instead of a broken image.
    return (
      <div
        role={label ? "img" : undefined}
        aria-label={label || undefined}
        className={cx("banig h-full w-full bg-brown-surface", className)}
      />
    )
  }

  return (
    <img
      src={photoUrl(image, 800)}
      srcSet={WIDTHS.map((w) => `${photoUrl(image, w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={label}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
      style={{ objectPosition: photo.position }}
      className={cx("h-full w-full bg-brown-surface object-cover", className)}
    />
  )
}

export function PhotoCredit({
  image,
  className,
}: {
  image: ImageKey
  className?: string
}) {
  const photo = photos[image]
  return (
    <a
      href={photo.creditUrl}
      target="_blank"
      rel="noreferrer"
      className={cx(
        "text-[0.7rem] underline-offset-2 hover:underline",
        className,
      )}
    >
      {tr("Larawan", "Photo")}: {photo.credit} / Unsplash
    </a>
  )
}
