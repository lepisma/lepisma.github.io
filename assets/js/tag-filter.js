// Tag filtering functionality
// Assume $

function getAllPosts () {
  return $('.archive-item')
}

function getAllFilterItems () {
  return $('.page-tags')[0].children
}

function getPostTags (post) {
  return Array.prototype.map.call($(post).find('.page-tags').children(), t => t.text)
}

function setEnabledTags (tags) {
  Array.prototype.forEach.call(getAllFilterItems(), t => {
    $(t).toggleClass('active', tags.indexOf(t.text) > -1)
  })
}

function getEnabledTags () {
  return Array.prototype.filter.call(getAllFilterItems(), t => t.classList.contains('active'))
    .map(t => t.text)
}

function getUrlTags () {
  let hash = document.location.hash.substr(1)
  if (hash === '') {
    return []
  } else{
    return hash.split(',')
  }
}

function setUrlTags (tags) {
  if (tags.length > 0) {
    document.location.hash = '#' + Array.prototype.join.call(tags, ',')
  }
}

function showEnabledPosts (tags) {
  let posts = getAllPosts()

  Array.prototype.forEach.call(posts, p => {
    let postTags = getPostTags(p)

    if ((postTags.some(pt => tags.indexOf(pt) > -1)) ||
        (postTags.length === 0) ||
        (tags.length === 0)) {
      $(p).show()
    } else {
      $(p).hide()
    }
  })
}

function updateFilter (tags) {
  let enabledTags
  if (tags) {
    setEnabledTags(tags)
    enabledTags = tags
  } else {
    enabledTags = getEnabledTags()
  }

  setUrlTags(enabledTags)
  showEnabledPosts(enabledTags)
}

$(document).ready(function () {
  // First try parsing the url
  let enabledTags = getUrlTags()
  setEnabledTags(enabledTags)
  showEnabledPosts(enabledTags)

  // On click for filter items
  Array.prototype.forEach.call(getAllFilterItems(), t => {
    $(t).click(function (e) {
      e.preventDefault()
      $(this).toggleClass('active')
      updateFilter()
    })
  })

  // On click for post items
  Array.prototype.forEach.call(getAllPosts(), p => {
    Array.prototype.forEach.call($(p).find('.page-tags').children(), t => {
      $(t).click(function (e) {
        e.preventDefault()
        updateFilter([$(this).text()])
      })
    })
  })
})
