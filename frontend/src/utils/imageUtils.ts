// WebP support detection (cached)
let webpSupported: boolean | null = null

function checkWebPSupport(): Promise<boolean> {
  if (webpSupported !== null) return Promise.resolve(webpSupported)

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      webpSupported = img.width > 0 && img.height > 0
      resolve(webpSupported)
    }
    img.onerror = () => {
      webpSupported = false
      resolve(false)
    }
    img.src =
      'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
  })
}

// Synchronous check (returns cached value or assumes true for modern browsers)
export function supportsWebP(): boolean {
  return webpSupported ?? true
}

// Initialize detection early
checkWebPSupport()

/**
 * Convert a .png path to .webp if supported
 * e.g. '/images/claw/婴儿待机1.png' -> '/images/claw/婴儿待机1.webp'
 */
export function getImagePath(pngPath: string): string {
  if (!supportsWebP()) return pngPath
  return pngPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
}

/**
 * Preload a single image and return a promise
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload multiple images concurrently
 */
export function preloadImages(srcs: readonly string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage))
}
