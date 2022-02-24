import core from '@actions/core'
import github from '@actions/github'

import { run } from './lib'

const title = github.context.payload?.pull_request?.['title']

if (!title) core.setFailed('The PR has no title. (debug at: https://jsfiddle.net/L279jsnz/)')

core.info(`Checking PR: ${title}`)

const isValid = run(title, core.getInput('regexp'))

if (!isValid) core.setFailed(core.getInput('message'))
