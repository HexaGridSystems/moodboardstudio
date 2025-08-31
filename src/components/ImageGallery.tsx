import React from 'react'
import './ImageGallery.css'

interface ImageGalleryProps {
  images: { id: string; url: string; alt: string }[]
  onSelect?: (id: string) => void
  loading?: boolean
  error?: string | null
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onSelect, loading, error }) => {
  if (!images.length && !loading && !error) return null
  return (
    <div className="image-gallery">
      {loading && <div style={{ fontSize:12, opacity:.7 }}>Generating images...</div>}
      {error && <div style={{ fontSize:12, color:'#f55' }}>{error}</div>}
      {images.map(img => (
        <figure key={img.id} className="image-gallery__item" onClick={() => onSelect?.(img.id)}>
          <img
            src={img.url}
            alt={img.alt}
            onError={(e) => {
              const el = e.currentTarget
              // Avoid infinite loop if placeholder also errors
              if (!/placehold\.co/.test(el.src)) {
                el.src = 'https://placehold.co/400x300?text=broken'
              }
            }}
          />
          <figcaption title={img.alt}>{img.alt}</figcaption>
        </figure>
      ))}
    </div>
  )
}

export default ImageGallery
