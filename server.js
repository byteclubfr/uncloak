'use strict'

const fs = require('fs')
const sass = require('node-sass')
const express = require('express')
const bodyParser = require('body-parser')

const THEME = 'node_modules/reveal.js/css/theme/'
const SOURCE = THEME + 'source/'
const TEMPLATE = THEME + 'template/'

const mixins = fs.readFileSync(TEMPLATE + 'mixins.scss')
const settings = fs.readFileSync(TEMPLATE + 'settings.scss')
const theme = fs.readFileSync(TEMPLATE + 'theme.scss')

const app = express()
app.set('port', process.env.PORT || 8080)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname))

// generated css
var custom = ''

// called by the angular app
app.post('/convert', (req, res) => {
  const scss = mixins + settings + req.body.scss + theme
  sass.render(
    {
      data: scss,
    },
    (err, result) => {
      if (err) {
        console.error('sass error', err)
        res.send('sass error')
      } else {
        custom = result.css
        res.send(result.css)
      }
    }
  )
})

// called by the reveal iframe
app.get('/custom.css', (req, res) => {
  res.type('css')
  res.send(custom)
})

app.get('/themes/:id', (req, res) => {
  fs.readFile(SOURCE + req.params.id + '.scss', 'utf-8', (err, file) => {
    if (err) console.error(err)

    res.send(mapScss(file))
  })
})

app.get('/themes', (req, res) => {
  fs.readdir(SOURCE, (err, files) => {
    if (err) console.error(err)
    // extension irrelevant
    files = files.map(file => file.split('.')[0])
    res.send(files)
  })
})

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`)
})

// convert a scss into a map of vars/value
const mapScss = file => {
  return (
    file
      .split('\n')
      // only vars
      .filter(line => line[0] === '$')
      // trim $ and ;
      .map(line => line.slice(1, -1))
      .reduce((o, v) => {
        v = v.split(':')
        o[v[0].trim()] = v[1].trim()
        return o
      }, {})
  )
}
