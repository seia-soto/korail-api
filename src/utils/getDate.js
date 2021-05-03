export default (stdDate = Date.now()) => {
  const date = new Date(stdDate)
  const result = date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0')

  return result
}
