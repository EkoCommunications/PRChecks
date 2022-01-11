import core from '@actions/core'
import github from '@actions/github'

import { run } from './lib'

const body = github.context.payload?.pull_request?.['body']

if (body?.length) {
  const remainingTasks = run(body, core.getInput('skip-marker'))

  if (remainingTasks > 0)
    core.setFailed(`${remainingTasks} tasks remain not checked.`)
}
