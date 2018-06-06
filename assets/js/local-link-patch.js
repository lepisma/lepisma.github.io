document.addEventListener('DOMContentLoaded', function () {
  [].forEach.call(document.getElementsByTagName('a'), l => {
    if (l.classList.contains('pile-link')) {
      l.href = l.href.slice(window.location.origin.length + 5)
    }
  })
})
