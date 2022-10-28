// @ts-check
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import yaml from 'yaml'
import glob from 'fast-glob'
import matter from 'gray-matter'
import slugify from 'slugify'
import linkExtractor from 'markdown-link-extractor'

const input = path.join(process.cwd(), 'contents')
const output = path.join(process.cwd(), 'dist')
// clear the output directory
await fs.rm(output, { recursive: true, force: true })

const outputAsset = async (ref, source) => {
  if (/^(https?:\/\/|[#/])/.test(ref)) return ref
  try {
    const target = path.join(source, '..', ref)
    const content = await fs.readFile(target)
    const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 8)
    const filename = hash + path.extname(target)
    const dirname = path.join(output, 'assets')
    await fs.mkdir(dirname, { recursive: true })
    await fs.copyFile(target, path.join(dirname, filename))
    return `/assets/${filename}`
  } catch (err) {
    return ref
  }
}

const processMarkdown = async (content, filename) => {
  const { links } = linkExtractor(content)
  await Promise.all(links.map(async item => {
    const replace = await outputAsset(item, filename)
    if (replace !== item) {
      content = content.replace(new RegExp(item, 'g'), replace)
    }
  }))
  return content
}

const loadYaml = async (filename) => {
  const content = await fs.readFile(filename, 'utf8')
  if (!content) return []

  const results = await Promise.all(yaml.parse(content).map(async item => {
    if (item.name == null) return
    const slug = slugify(item.slug ?? item.name, { lower: true })
    const result = {
      name: item.name,
      slug,
      meta: item.meta ?? {}
    }
    if (item.email != null) result.email = item.email
    if (item.bio != null) result.bio = item.bio
    if (item.description != null) result.description = item.description
    if (item.avatar != null) result.avatar = await outputAsset(item.avatar, filename)
    if (item.cover != null) result.cover = await outputAsset(item.cover, filename)
    if (item.website != null) result.website = item.website
    if (item.location != null) result.location = item.location
    return result
  }))

  return results.filter(Boolean)
}

const loadMarkdowns = async (pattern) => {
  const files = await glob(pattern, { onlyFiles: true, cwd: input })
  return await Promise.all(files.map(async item => {
    const filename = path.join(input, item)
    const stats = await fs.stat(filename)
    const { data, content: originalContent } = matter(await fs.readFile(filename, 'utf8'))
    const title = data.title ?? 'Untitled'
    const slug = slugify(data.slug ?? title, { lower: true })
    const date = data.date != null ? new Date(data.date).getTime() : parseInt(stats.ctimeMs.toString())
    const updated = data.updated != null ? new Date(data.updated).getTime() : parseInt(stats.mtimeMs.toString())
    const sections = data.sections ?? []
    const draft = data.draft ?? false
    const featured = data.featured ?? false
    const comment = data.comment ?? false
    const authors = data.authors ?? []
    const categories = data.categories ?? []
    const tags = data.tags ?? []
    const meta = data.meta ?? {}
    const content = await processMarkdown(originalContent, filename)

    await Promise.all(sections.map(async s => await outputAsset(s.source, filename)))

    const result = { title, slug, date, updated, sections, draft, featured, comment, authors, categories, tags, meta, content }

    if (data.description != null) result.description = data.description
    if (data.cover != null) result.cover = await outputAsset(data.cover, filename)
    if (data.video != null) result.video = await outputAsset(data.video, filename)
    if (data.audio != null) result.audio = await outputAsset(data.audio, filename)

    return result
  }))
}

const authors = await loadYaml(path.join(input, 'authors.yml'))
await fs.writeFile(path.join(output, 'authors.json'), JSON.stringify(authors))
await fs.writeFile(path.join(output, 'author-slugs.json'), JSON.stringify(authors.map(i => i.slug)))
console.log(`Loaded ${authors.length} authors`)

const categories = await loadYaml(path.join(input, 'categories.yml'))
await fs.writeFile(path.join(output, 'categories.json'), JSON.stringify(categories))
await fs.writeFile(path.join(output, 'category-slugs.json'), JSON.stringify(categories.map(i => i.slug)))
console.log(`Loaded ${categories.length} categories`)

const tags = await loadYaml(path.join(input, 'tags.yml'))
await fs.writeFile(path.join(output, 'tags.json'), JSON.stringify(tags))
await fs.writeFile(path.join(output, 'tag-slugs.json'), JSON.stringify(tags.map(i => i.slug)))
console.log(`Loaded ${tags.length} tags`)

const posts = await loadMarkdowns('posts/**/*.md')
await fs.writeFile(path.join(output, 'posts.json'), JSON.stringify(posts))
await fs.writeFile(path.join(output, 'post-slugs.json'), JSON.stringify(posts.map(i => i.slug)))
console.log(`Loaded ${posts.length} posts`)

const pages = await loadMarkdowns('pages/**/*.md')
await fs.writeFile(path.join(output, 'pages.json'), JSON.stringify(pages))
await fs.writeFile(path.join(output, 'page-slugs.json'), JSON.stringify(pages.map(i => i.slug)))
console.log(`Loaded ${pages.length} pages`)

const courses = await loadMarkdowns('courses/**/*.md')
await fs.writeFile(path.join(output, 'courses.json'), JSON.stringify(courses))
await fs.writeFile(path.join(output, 'course-slugs.json'), JSON.stringify(courses.map(i => i.slug)))
console.log(`Loaded ${courses.length} courses`)
