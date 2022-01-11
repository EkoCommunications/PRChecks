export const run = (title: string, regexp: string) => {
  return new RegExp(regexp, 'i').test(title)
}
