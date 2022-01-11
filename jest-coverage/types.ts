import { CoverageMapData } from 'istanbul-lib-coverage'

export type Report = {
  success: boolean
  coverageMap: CoverageMapData
  testResults: TestResult[]
}

type TestResult = {
  status: string
  message: string
}
