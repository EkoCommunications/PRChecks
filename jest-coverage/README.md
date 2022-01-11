# Jest coverage

## 🍝 Snippets

```yaml
  - uses: EkoCommunications/PRChecks/jest-coverage@develop
```

```yaml
  - uses: EkoCommunications/PRChecks/jest-coverage@develop
    with:
      threshold: .8
```

```yaml
name: PR title checker

on:
  pull_request:
    types: [opened, edited, synchronize, reopened, labeled]

jobs:
  pr-checker:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: EkoCommunications/PRChecks/jest-coverage@develop
```
