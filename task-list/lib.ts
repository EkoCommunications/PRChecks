export const run = (body: string, marker: string) => {
  const IGNORE_FROM = `<!-- ${marker}-start -->`
  const IGNORE_UNTIL = `<!-- ${marker}-end -->`

  const CHECKS_REGEXP = /^[-*]\s?\[[x\s]?\]\s/i
  const COMPLETED_REGEXP = /^[-*]\s?\[[x]?\]\s/i

  let lines = body.split('\n').map((str) => str.trim())

  const from = lines.findIndex((str) => str === IGNORE_FROM)
  const until = lines.findIndex((str) => str === IGNORE_UNTIL)

  if (from !== -1 && until !== -1) {
    lines = [...lines.slice(0, from), ...lines.slice(until + 1)]
  }

  if (!lines.length) return 0

  const checks = lines.filter((str) => CHECKS_REGEXP.test(str))
  const completed = checks.filter((str) => COMPLETED_REGEXP.test(str))

  return checks.length - completed.length
}
