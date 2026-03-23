import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'

const IMAGE_DIR = join(process.cwd(), 'public/images')
const QUALITY = 80

async function convertToWebP(inputPath: string) {
  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  try {
    const inputStat = await stat(inputPath)
    // Skip if WebP already exists and is newer than source
    try {
      const outputStat = await stat(outputPath)
      if (outputStat.mtimeMs >= inputStat.mtimeMs) {
        console.log(`⏭ ${basename(inputPath)} (already converted)`)
        return { skipped: true }
      }
    } catch {
      // WebP doesn't exist yet, proceed
    }

    const inputSize = inputStat.size
    await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath)
    const outputSize = (await stat(outputPath)).size
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1)
    console.log(
      `✓ ${basename(inputPath)} → .webp (${(inputSize / 1024).toFixed(0)}KB → ${(outputSize / 1024).toFixed(0)}KB, -${savings}%)`
    )
    return { skipped: false, saved: inputSize - outputSize }
  } catch (error) {
    console.error(`✗ ${basename(inputPath)}:`, error)
    return { skipped: false, saved: 0 }
  }
}

async function processDirectory(dir: string): Promise<{ totalSaved: number; converted: number }> {
  const files = await readdir(dir, { withFileTypes: true })
  let totalSaved = 0
  let converted = 0

  for (const file of files) {
    const fullPath = join(dir, file.name)
    if (file.isDirectory()) {
      const sub = await processDirectory(fullPath)
      totalSaved += sub.totalSaved
      converted += sub.converted
    } else {
      const ext = extname(file.name).toLowerCase()
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const result = await convertToWebP(fullPath)
        if (!result.skipped && result.saved) {
          totalSaved += result.saved
          converted++
        }
      }
    }
  }

  return { totalSaved, converted }
}

console.log(`\n🖼  Converting images to WebP (quality: ${QUALITY})...\n`)
console.log(`Source: ${IMAGE_DIR}\n`)

processDirectory(IMAGE_DIR)
  .then(({ totalSaved, converted }) => {
    console.log(`\n✓ Done! ${converted} images converted`)
    console.log(`  Total saved: ${(totalSaved / 1024 / 1024).toFixed(1)}MB`)
  })
  .catch(console.error)
