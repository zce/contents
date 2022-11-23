// @ts-check
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import yaml from 'yaml'
import glob from 'fast-glob'
import matter from 'gray-matter'
import slugify from 'slugify'
import linkExtractor from 'markdown-link-extractor'

console.log('[build] start')

const domain = 'cdn.zce.me'
const input = path.join(process.cwd(), 'contents')
const output = path.join(process.cwd(), 'public')

// clear the output directory
await fs.rm(output, { recursive: true, force: true })

const outputAsset = async (ref, source) => {
  if (/^(https?:\/\/|[#/])/.test(ref)) return ref
  try {
    const target = path.join(source, '..', ref)
    const content = await fs.readFile(target)
    const hash = crypto.createHash('md5').update(content).digest('hex').slice(8, 24)
    const name = hash + path.extname(target)
    const dirname = path.join(output, 'assets')
    await fs.mkdir(dirname, { recursive: true })
    await fs.copyFile(target, path.join(dirname, name))
    console.log(`[output] [asset] /assets/${name}`)
    return `https://${domain}/assets/${name}`
  } catch (err) {
    return ref
  }
}

const outputData = async (name, data) => {
  const filename = path.join(output, name)
  const dirname = path.dirname(filename)
  await fs.mkdir(dirname, { recursive: true })
  await fs.writeFile(filename, typeof data === 'string' ? data : JSON.stringify(data))
  console.log(`[output] [data] /${name}`)
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

const loadYaml = async name => {
  const filename = path.join(input, name)
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

  const filtered = results.filter(Boolean)
  console.log(`[load] [yaml] ${filename} (${filtered.length} records)`)
  return filtered
}

const loadMarkdowns = async pattern => {
  const files = await glob(pattern, { onlyFiles: true, cwd: input })

  const result = await Promise.all(files.map(async item => {
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

  result.sort((a, b) => b.date - a.date)

  console.log(`[load] [markdown] ${pattern} (${result.length} records)`)
  return result
}

const authors = await loadYaml('authors.yml')
const categories = await loadYaml('categories.yml')
const tags = await loadYaml('tags.yml')
const posts = await loadMarkdowns('posts/**/*.md')
const pages = await loadMarkdowns('pages/**/*.md')
const courses = await loadMarkdowns('courses/**/*.md')
const slugs = {
  authors: authors.map(i => i.slug),
  categories: categories.map(i => i.slug),
  tags: tags.map(i => i.slug),
  posts: posts.map(i => i.slug),
  pages: pages.map(i => i.slug),
  courses: courses.map(i => i.slug)
}

await outputData('authors', authors)
await outputData('categories', categories)
await outputData('tags', tags)
await outputData('posts', posts)
await outputData('pages', pages)
await outputData('courses', courses)
await outputData('slugs', slugs)

await outputData('CNAME', domain)
await outputData('robots.txt', 'User-agent: *\nDisallow: /')
await outputData('.nojekyll', '')

console.log('[build] done')
