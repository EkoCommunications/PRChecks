# PR title checker

## 🍝 Snippets

```yaml
  - uses: EkoCommunications/PRChecks/pr-title@develop
```

```yaml
  - uses: EkoCommunications/PRChecks/pr-title@develop
    with:
      regexp: [a-z0-9]{1,100}
      message: full example with custom regexp
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
      - uses: EkoCommunications/PRChecks/pr-title@develop
```
