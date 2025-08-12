// Tag filtering functionality

/**
 * Gets all the archive post items on the page.
 * @returns {NodeList} A list of all elements with the class 'archive-item'.
 */
function getAllPosts() {
  return document.querySelectorAll('.archive-item');
}

/**
 * Gets all the tag filter buttons.
 * @returns {HTMLCollection} A collection of all children of the element with the class 'page-tags'.
 */
function getAllFilterItems() {
  // Use a null check for robustness in case the element doesn't exist
  const tagContainer = document.querySelector('.page-tags');
  return tagContainer ? tagContainer.children : [];
}

/**
 * Extracts the tags from a single post element.
 * @param {HTMLElement} post The post element to inspect.
 * @returns {string[]} An array of tag names as strings.
 */
function getPostTags(post) {
  const postTagContainer = post.querySelector('.page-tags');
  // Convert HTMLCollection to an array for easier mapping
  return postTagContainer ? Array.from(postTagContainer.children).map(t => t.textContent.trim()) : [];
}

/**
 * Sets the active state of filter tags based on an array of tag names.
 * @param {string[]} tags An array of tag names to enable.
 */
function setEnabledTags(tags) {
  Array.from(getAllFilterItems()).forEach(t => {
    // Use textContent instead of jQuery's .text()
    t.classList.toggle('active', tags.includes(t.textContent.trim()));
  });
}

/**
 * Gets an array of the currently active filter tags.
 * @returns {string[]} An array of active tag names.
 */
function getEnabledTags() {
  return Array.from(getAllFilterItems())
    .filter(t => t.classList.contains('active'))
    .map(t => t.textContent.trim());
}

/**
 * Reads tags from the URL hash.
 * @returns {string[]} An array of tag names from the URL hash.
 */
function getUrlTags() {
  const hash = document.location.hash.slice(1);
  if (hash === '') {
    return [];
  } else {
    // Trim whitespace from each tag
    return hash.split(',').map(tag => tag.trim());
  }
}

/**
 * Sets the URL hash based on an array of tags.
 * @param {string[]} tags An array of tag names to set in the URL.
 */
function setUrlTags(tags) {
  if (tags.length > 0) {
    document.location.hash = '#' + tags.join(',');
  } else {
    // Clear the hash if no tags are selected
    document.location.hash = '';
  }
}

/**
 * Shows or hides posts based on the provided array of active tags.
 * A post is shown if it has at least one of the active tags, or if there are no tags enabled.
 * @param {string[]} tags An array of tag names to filter by.
 */
function showEnabledPosts(tags) {
  const posts = getAllPosts();

  posts.forEach(p => {
    const postTags = getPostTags(p);

    // Check if the post has any of the enabled tags.
    // If no tags are enabled, all posts are shown.
    const hasMatchingTag = postTags.some(postTag => tags.includes(postTag));

    if (tags.length === 0 || hasMatchingTag) {
      // Use CSS display property for showing/hiding
      p.style.display = '';
    } else {
      p.style.display = 'none';
    }
  });
}

/**
 * Updates the filter state, URL, and displayed posts.
 * @param {string[]|null} [tags] Optional array of tags to explicitly set. If not provided,
 * the function will get the currently enabled tags from the UI.
 */
function updateFilter(tags) {
  let enabledTags;
  if (tags) {
    setEnabledTags(tags);
    enabledTags = tags;
  } else {
    enabledTags = getEnabledTags();
  }

  setUrlTags(enabledTags);
  showEnabledPosts(enabledTags);
}

// Wait for the DOM to be fully loaded before running any code.
document.addEventListener('DOMContentLoaded', function() {
  // First, check the URL for any initial tags to filter by.
  const initialTags = getUrlTags();
  setEnabledTags(initialTags);
  showEnabledPosts(initialTags);

  // Set up click handlers for the filter tags.
  Array.from(getAllFilterItems()).forEach(t => {
    t.addEventListener('click', function(e) {
      e.preventDefault();
      // Use e.currentTarget to get the element the event listener is attached to.
      e.currentTarget.classList.toggle('active');
      updateFilter();
    });
  });

  // Set up click handlers for the tags within each post.
  getAllPosts().forEach(p => {
    const postTags = p.querySelector('.page-tags');
    if (postTags) {
      Array.from(postTags.children).forEach(t => {
        t.addEventListener('click', function(e) {
          e.preventDefault();
          // Pass an array with the single clicked tag to the update function.
          updateFilter([e.currentTarget.textContent.trim()]);
        });
      });
    }
  });
});
