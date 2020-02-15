const fs = require('fs')

try {
  const data = fs.readFileSync('status.real', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}