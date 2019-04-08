/* global d3, tippy */
// Script for enhancing blurred post

// Return divs representing various alpha values
function getTextDivs () {
  // The first one is original text so we ignore that, rest follow
  // alpha values from 0.0 to 1.0 with step of 0.1
  let examples = [...document.getElementsByClassName('example')]
  return examples.filter(e => e.textContent.startsWith('Animals')).slice(1)
}

// Replace the text div with a richer version that allows
// certain operations
function replaceWithRich (textDiv) {
  let text = textDiv.textContent.trim().replace(/\w+/g, '<span class=\'word\'>$&</span>')
  textDiv.innerHTML = text
}

// Recolor words based on similarity score
function recolorRich (richDiv, alphaData) {
  let scale = d3.scaleLinear().domain([0.7, 1]).range(['#dddddd', 'black']).interpolate(d3.interpolateHcl)

  let words = [...richDiv.getElementsByTagName('span')]
  words.forEach(e => e.setAttribute('style', `color: black`))

  words.slice(1, -1).forEach((e, i) => {
    let topAltSim = alphaData[i][0][1]
    e.className += ' wtooltip'

    let tdStyle = 'border: none;'
    let rowsText = alphaData[i].map(pair => {
      return `<tr>
                <td style='${tdStyle}'>${pair[0]}</td>
                <td style='${tdStyle}'>${pair[1].toFixed(4)}</td>
              </tr>`
    }).join('')

    let tableStyle = 'margin: 0px; border: none; font-size: 12px;'

    e.setAttribute('data-tippy-content', `<table style='${tableStyle}'>${rowsText}</table>`)
    e.setAttribute('style', `color: ${scale(topAltSim)}`)
  })
}

function highlightWord (word) {
  [...document.getElementsByClassName('word')].forEach(e => {
    if (e.textContent === word) {
      d3.select(e).style('text-decoration', 'underline')
    }
  })
}

function highlightPosition (pos) {
  let divs = getTextDivs()
  divs.forEach(d => {
    let word = [...d.getElementsByClassName('word')][pos]
    d3.select(word).style('background', 'yellow')
  })
}

function unhighlightAll () {
  d3.selectAll('.word').style('background', 'white')
  d3.selectAll('.word').style('text-decoration', 'none')
}

function getChildNumber (node) {
  let siblings = node.parentNode.getElementsByClassName('word')
  return Array.prototype.indexOf.call(siblings, node)
}

document.addEventListener('DOMContentLoaded', function () {
  d3.json('./blurred.json', function (err, data) {
    if (err) {
      console.log('Error in loading data, not adding extra information')
    } else {
      getTextDivs().forEach((d, i) => {
        replaceWithRich(d)
        recolorRich(d, data[i])
        d.addEventListener('mouseover', function (ev) {
          highlightWord(ev.target.textContent)
          highlightPosition(getChildNumber(ev.target))
        })
        d.addEventListener('mouseout', function () {
          unhighlightAll()
        })
      })

      tippy('.wtooltip', {
        theme: 'light',
        arrow: false,
        size: 'small',
        animateFill: false,
        animation: 'perspective',
        duration: 50,
        followCursor: true
      })
    }
  })
}, false)
