import { readFileSync } from 'fs'
import { load } from 'js-yaml'

import { run } from './lib'

const config = load(readFileSync('./action.yaml', 'utf-8'))
const skipMarker = (config as any).inputs['skip-marker'].default

const cases = [
  [
    `
This is a PR body.
- [x] I did it!
  `,
    'pass',
  ],
  [
    `
This is a PR body.
- [ ] I didnt do it!
  `,
    'fail (not ticked)',
  ],
  [
    `
This is a PR body.
- [x] I did it!
<!-- ${skipMarker}-start -->
- [ ] I didnt do it but it's fine!
<!-- ${skipMarker}-end -->
  `,
    'pass',
  ],
]

describe('task-list', () => {
  it.each(cases)(`with (%p) should %p`, (value, result) => {
    const remainingTasks = run(value, skipMarker)
    expect(remainingTasks === 0).toBe(result === 'pass')
  })
})
