import core from '@actions/core'
import github from '@actions/github'
import { exec } from '@actions/exec'

import { getCoverage, getVerdict, createMarkdownReport, runJest } from './lib'

// top level await wrapper
const run = async () => {
  const jestCommand = core.getInput('jest') ?? ''
  const threshold = parseInt(core.getInput('threshold') ?? '100', 10)

  const jestExecutor = async (jestOptions: string[]) => {
    if (['npm', 'npx'].some((e) => jestCommand.startsWith(e)))
      jestOptions.unshift('--')

    await exec(jestCommand, jestOptions, { cwd: process.cwd(), silent: true })
  }

  // execute jest and retrieve coverage data
  const jsonReport = await runJest(jestExecutor)
  const coverageMap = getCoverage(jsonReport)

  // did we fail or not?
  const success = getVerdict(coverageMap, threshold)

  // create markdown report
  const markdownReport = createMarkdownReport(
    coverageMap,
    threshold,
    core.getInput('scope'),
  )

  // instanciate sdk
  const octokit = github.getOctokit(process.env?.['GITHUB_TOKEN']!)

  // post comment
  await octokit.rest.issues.createComment({
    owner: github.context.payload.repository!.owner.login,
    repo: github.context.payload.repository!.name,
    issue_number: github.context.payload.pull_request!.number,
    body: markdownReport,
  })

  if (!success) throw new Error('Test coverage below threshold.')
}

// main
if (github.context.eventName === 'pull_request') {
  try {
    run()
  } catch (err) {
    core.setFailed(err instanceof Error ? err.message : (err as string))
  }
}
