/**
 * Plopfile
 * https://plopjs.com
 */

import dayjs from 'dayjs'
import slugify from 'slugify'

export default plop => {
  const date = dayjs().format('YYYY-MM-DD')
  const datetime = dayjs().format('YYYY-MM-DD HH:mm:ss')

  plop.setGenerator('post', {
    description: 'Start a new creation',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'post title'
      },
      {
        type: 'input',
        name: 'slug',
        message: 'post slug',
        default: answers => slugify(answers.title, { lower: true }),
        filter: input => slugify(input, { lower: true })
        // when: answers => /[\u4e00-\u9fa5]/.test(answers.title)
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'contents/posts/{{date}}-{{slug}}/index.md',
        templateFile: 'templates/post.hbs',
        data: { date, datetime }
      }
    ]
  })

  plop.setGenerator('page', {
    description: 'Add a new page',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'page title'
      },
      {
        type: 'input',
        name: 'slug',
        message: 'page slug',
        default: answers => slugify(answers.title, { lower: true }),
        filter: input => slugify(input, { lower: true })
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'contents/pages/{{slug}}/index.md',
        templateFile: 'templates/page.hbs'
      }
    ]
  })

  plop.setGenerator('course', {
    description: 'Create a new course',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'course title'
      },
      {
        type: 'input',
        name: 'slug',
        message: 'course slug',
        default: answers => slugify(answers.title, { lower: true }),
        filter: input => slugify(input, { lower: true })
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'contents/courses/{{date}}-{{slug}}/index.md',
        templateFile: 'templates/course.hbs',
        data: { date, datetime }
      }
    ]
  })
}
