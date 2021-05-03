export default (stdDate = Date.now()) => {
  const date = new Date(stdDate)
  const result = String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0')

  return result
}
