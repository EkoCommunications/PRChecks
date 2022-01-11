# Amity PR Checks

## What is it?

It's a collection of composite Github actions used to enforce quality practices in Amity repositories.

## How to use?

The document of each action is located in their own README.md, where there should be a small description of what the action does, and a reasonable snippet to copy paste.

## How is it organized?

The actions are organized around lerna and yarn workspaces to mutualize dependencies, testing, building, changelog generation, etc etc...

## How to contribute?

1. Make a git branch (to make a PR)
2. Create a folder for your action. It's highly suggested to copy-paste and use `./pr-title` as template (since it's the easier action of all)
3. Enter the package.json's name to be the folder's name (1-1 mapping is always easier)
4. Code all you want and submit.

## About github actions

Actions are supposed to be "dependency-less single file javascript auto-executable modules". It basically means that all code should be contained in a `index.js`. This **built file must be versioned** so that the runner can download it later.
