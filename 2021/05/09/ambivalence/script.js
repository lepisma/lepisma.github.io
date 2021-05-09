//

function parseParagraph(p) {
  let punct = '.'
  let sentences = p.textContent.split(punct)

  let items = []

  sentences.forEach(s => {
    if (s.trim() === '') {
      return
    }

    s = s.replace(/\n/g, ' ').trim() + punct

    let v1, v2;
    if (s.indexOf('|') > -1) {
      [v1, v2] = s.split('|')
      v1 = v1 + punct
    } else {
      v1 = s
      v2 = s
    }
    items.push([v1, v2])
  })

  return items
}

function formatSentencePairs(sentencePairs) {
  // List of sentence pairs

  let items = []
  sentencePairs.forEach(sp => {
    let [v1, v2] = sp
    if (v1 === v2) {
      items.push(`<span class='text-vx'>${v1}</span>`)
    } else {
      items.push(`<span class='text-v1'>${v1}</span> <span class='text-v2'>${v2}</span>`)
    }
  })

  return items.join(' ')
}


document.addEventListener('DOMContentLoaded', function (event) {
  let paragraphs = document.getElementsByTagName('p')
  let paragraphSentencePairs = Array.prototype.map.call(paragraphs, parseParagraph)

  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].innerHTML = formatSentencePairs(paragraphSentencePairs[i])
  }
  let slider = document.getElementById('update-slider')
  let updateRate = 0.05
  let updateInterval = 500;
  slider.oninput = function () {
    updateRate = (this.value / 200)
  }

  let v1s = document.getElementsByClassName('text-v1')
  let v2s = document.getElementsByClassName('text-v2')

  let opLo = 0.05
  let opHi = 1

  for (let i = 0; i < v1s.length; i++) {
    if (Math.random() < 0.5) {
      v1s[i].style.opacity = opHi
      v2s[i].style.opacity = opLo
    } else {
      v1s[i].style.opacity = opLo
      v2s[i].style.opacity = opHi
    }
  }

  setInterval(function () {
    for (let i = 0; i < v1s.length; i++) {
      if (Math.random() < updateRate) {
        if (v1s[i].style.opacity > 0.5) {
          v1s[i].style.opacity = opLo
          v2s[i].style.opacity = opHi
        } else {
          v1s[i].style.opacity = opHi
          v2s[i].style.opacity = opLo
        }
      }
    }
  }, updateInterval);
})
