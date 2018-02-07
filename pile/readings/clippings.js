document.addEventListener('DOMContentLoaded', () => {
  var epigraph = document.getElementsByClassName('epigraph')[0];

  for (var i = epigraph.children.length; i >= 0; i--) {
    epigraph.appendChild(epigraph.children[Math.random() * i | 0]);
  }
})
