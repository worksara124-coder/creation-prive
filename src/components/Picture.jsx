/** Image responsive : WebP + repli JPEG, dimensions réservées, chargement différé par défaut. */
export default function Picture({
  webp,
  jpg,
  width,
  height,
  alt = '',
  sizes = '100vw',
  eager = false,
  className,
  imgClassName,
  ...rest
}) {
  return (
    <picture className={className}>
      {webp && <source type="image/webp" srcSet={webp} sizes={sizes} />}
      <img
        src={jpg}
        width={width}
        height={height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : undefined}
        className={imgClassName}
        {...rest}
      />
    </picture>
  );
}
