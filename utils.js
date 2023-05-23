const validateIpv4Address = (addr) => {
  const tokens = addr.split('.')
  if (tokens.length !== 4) {
    return false
  }
  return tokens.every((token) => {
    const num = parseInt(token, 10)
    return num >= 0 && num <= 255
  })
  // const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  // return ipv4Regex.test(addr)
}

const patchRecord = (record, data) => {
  const keys = Object.keys(data)
  keys.forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    record[key] = data[key]
  })
  return record
}

module.exports = {
  validateIpv4Address,
  patchRecord,
}