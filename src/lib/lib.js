// Definitions of valid file extensions (lower case)
export const imageFileExtensions = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
])
export const videoFileExtensions = new Set([
  'mp4',
  'flv',
  'mpg',
  'mpeg',
  'webm',
  '3gp',
  'avi',
])





/**
 * Returns the tags from the filename
 * @param {string} fileName
 * @returns {string[]}
 */
export function getTags (fileName) {
  let tags = fileName.split(/(\[|\])/)
  tags = tags.slice(1, tags.length - 1).filter(d => d !== '' && d !== '[' && d !== ']')
  return tags
}

// /**
//  * Sets the HTML element's size to either the medium's size or the maximal size
//  * possible whithin the page while keeping the aspect ratio
//  *
//  * @param {HTMLVideoElement|HTMLImageElement} element element
//  * @param {number} originalWidth size of the medium
//  * @param {number} originalHeight size of the medium
//  */
// export function setSize (element, originalWidth, originalHeight) {
//   const w = window.innerWidth - 30
//   const h = window.innerHeight - 100
//   const factor = Math.min(
//     w / originalWidth,
//     h / originalHeight,
//   )
//   if (!FULL_WINDOW) {
//     // Still avoid overflow
//     element.style.width = Math.min(originalWidth, originalWidth * factor)
//     element.style.height = Math.min(originalHeight, originalHeight * factor)
//   } else {
//     element.style.width = originalWidth * factor
//     element.style.height = originalHeight * factor
//   }
// }

/**
 * Returns a file's extension or undefined
 * @param {string} fileName file's name
 * @returns {string|undefined} extension
 */
export function getFileExtension (fileName) {
  const split = fileName.split('.')
  if (split.length < 2) {
    return
  }
  return split[split.length - 1].toLowerCase()
}

/**
 * Fisher-Yates Shuffle
 *
 * @see https://bost.ocks.org/mike/shuffle/
 * @param {Array} array to shuffle
 * @returns {Array} shuffled
 */
export function shuffle (array) {
  let m = array.length, t, i
  // While there remain elements to shuffle
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--)
    // And swap it with the current element
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}

export function doNothing (evt) {
  evt.stopPropagation()
}


/**
 * Get the value of the specfied parameter from the current URL
 * @param {Window} window window
 * @param {string} key parameter key
 * @returns {string|undefined} parameter value
 */
export function getUrlParam (window, key) {
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}
