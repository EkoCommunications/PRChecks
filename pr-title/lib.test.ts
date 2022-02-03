import { readFileSync } from 'fs'
import { load } from 'js-yaml'

import { run } from './lib'

const config = load(readFileSync('./action.yaml', 'utf-8'))

const cases = [
  ['epic: UP-0000 - foobar', 'pass'], // no scope
  ['epic(sdk): UP-0000 - foobar', 'pass'], // with scope
  ['epic: UP-0000 - foo-bar_baz lol', 'pass'], // containing - _
  ['fail: UP-0000 - foobar', 'fail (invalid verb)'],
  ['epic(sdk) UP-0000 foobar', 'fail (no colon)'],
  ['epic(sdk): foobar', 'fail (no ticket number)'],
  ['epic(sdk): 12-XXXX - foobar', 'fail (invalid ticket number)'],
  ['epic(sdk): UP-0000 foobar', 'fail (no separator)'],
  ['epic(sdk): UP-0000 - ', 'fail (no description)'],
  ['epic(sdk): UP-0000 - :(', 'fail (description invalid chars)'],
  ['epic(sdk): UP-0000 - fix', 'fail (description too short)'],
  [
    'epic(sdk): UP-0000 - this description is exactly 61 chars long which is 1 too much',
    'fail (description too long)',
  ],
]

describe('pr-title', () => {
  it.each(cases)(`with (%p) should %p`, (value, result) => {
    const checked = run(value, (config as any).inputs.regexp.default)
    expect(checked).toBe(result === 'pass')
  })
})
