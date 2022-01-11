import { readFileSync } from 'fs'
import { join } from 'path'

import { Report } from './types'

import {
  CoverageMap,
  CoverageSummary,
  createCoverageMap,
} from 'istanbul-lib-coverage'

import { markdownTable } from 'markdown-table'

const REPORT_FILE = join(process.cwd(), 'report.json')
const JEST_OPTIONS = ['--json', '--coverage', `--outputFile=${REPORT_FILE}`]

export const runJest = async (
  jestExecutor: (jestOptions: string[]) => Promise<void>,
) => {
  await jestExecutor(JEST_OPTIONS)
  return JSON.parse(readFileSync(REPORT_FILE, 'utf-8')) as Report
}

export const getCoverage = (jsonReport: Report) => {
  if (!jsonReport.success) {
    const messages = jsonReport.testResults
      .filter((testResult) => testResult.status === 'failed')
      .map((testResult) => testResult.message)

    throw new Error(['Some tests have failed', ...messages].join('\n\n'))
  }

  return createCoverageMap(jsonReport.coverageMap)
}

export const getVerdict = (map: CoverageMap, threshold: number) =>
  map.getCoverageSummary().lines.pct >= threshold

const getSticker = (val: number, threshold: number) =>
  val >= threshold ? '🟢' : '🔴'

const getGlobalTable = (summary: CoverageSummary, threshold: number) => {
  const CATEGORIES = {
    Statements: summary.statements,
    Branches: summary.branches,
    Functions: summary.functions,
    Lines: summary.lines,
  }

  const globalSummary = [
    ['Status', 'Category', 'Percentage', 'Covered/Total (Loss)'],
    ...Object.entries(CATEGORIES).map(([name, total]) => [
      getSticker(total.pct, threshold),
      name,
      `${total.pct}%`,
      `${total.covered}/${total.total} (${total.skipped})`,
    ]),
  ]

  return markdownTable(globalSummary, {
    align: ['c', 'l', 'c', 'c'],
  })
}

const getDetailedTable = (map: CoverageMap, threshold: number) => {
  const tableRows = [
    ['Status', 'Filename', 'Statements', 'Branches', 'Functions', 'Lines'],
    ...map.files().map((file) => {
      const summary = map.fileCoverageFor(file).toSummary()

      return [
        getSticker(summary.lines.pct, threshold),
        file.replace(process.cwd(), ''),
        `${summary.statements.pct}%`,
        `${summary.branches.pct}%`,
        `${summary.functions.pct}%`,
        `${summary.lines.pct}%`,
      ]
    }),
  ]

  return markdownTable(tableRows, {
    align: ['c', 'l', 'r', 'r', 'r', 'r'],
  })
}

export const createMarkdownReport = (
  coverageMap: CoverageMap,
  threshold: number,
  scopeHeader: string,
) => {
  const summary = coverageMap.getCoverageSummary()
  const success = getVerdict(coverageMap, threshold)

  return `
## :robot: **Coverage report**

- :package: Scope: ${scopeHeader}
- :test_tube: Total coverage is ${
    success
      ? `over the specified threshold! 🤩`
      : `less than the specified threshold of ${threshold}%. 😩`
  }

### Details
${getGlobalTable(summary, threshold)}
> Status of coverage: 🟢 - over the threshold, 🔴 - below the threshold

<details>
<summary>File oriented report</summary>

${getDetailedTable(coverageMap, threshold)}

</details>
`
}
