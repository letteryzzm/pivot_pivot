import sharp from 'sharp'
import { readdir, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { existsSync } from 'fs'

const INPUT_DIR = join(process.cwd(), '../public/images')
const OUTPUT_DIR = join(process.cwd(), '../public/images-optimized')

async function convertToWebP(inputPath: string, outputPath: string) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
    console.log(`✓ ${basename(inputPath)} -> ${basename(outputPath)}`)
  } catch (error) {
    console.error(`✗ ${basename(inputPath)}:`, error)
  }
}

async function processDirectory(dir: string, outputDir: string) {
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true })
  }

  const files = await readdir(dir, { withFileTypes: true })

  for (const file of files) {
    const inputPath = join(dir, file.name)

    if (file.isDirectory()) {
      await processDirectory(inputPath, join(outputDir, file.name))
    } else {
      const ext = extname(file.name).toLowerCase()
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const outputPath = join(outputDir, file.name.replace(ext, '.webp'))
        await convertToWebP(inputPath, outputPath)
      }
    }
  }
}

processDirectory(INPUT_DIR, OUTPUT_DIR)
  .then(() => console.log('\n✓ 转换完成'))
  .catch(console.error)
