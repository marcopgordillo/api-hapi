const { escapeJson } = require('@hapi/hoek')

const escJson = (obj) => {
  const string = JSON.stringify(obj)
  const stringEsc = escapeJson(string)
  return JSON.parse(stringEsc)
}

module.exports = {
  escJson
}
