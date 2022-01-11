# Task list

## Concept

In your PR body, you can write checkboxes with the `[] foo` notation. This action enforces that all checkboxes are ticked before merging. **By default, all checkboxes are mandatory.** If you need to make some checkboxes optional, you can wrap the part of the PR's body with HTML comments such as:

```md
- [] this is required

<!-- optional-tasks-start -->
- [] this is optional
<!-- optional-tasks-end -->
```

## 🍝 Snippets

```yaml
  - uses: EkoCommunications/PRChecks/task-list@develop
```

```yaml
  - uses: EkoCommunications/PRChecks/task-list@develop
    with:
      skip-marker: skip-me
```
