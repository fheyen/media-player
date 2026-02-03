// https://web.dev/file-system-access/

/**
 * TODO:
 * - allow to sort by name, size, date
 * - list of files with link to jump to some file?
 * - get gif duration for autoplay
 * - filter for size, duration, and date?
 * - filter with not, e.g. !tag to exclude a tag
 */

// Config
const AUTOPLAY_WAIT_TIME = 3000

// Globals
let FILES = []
let FILES_ALL = []
let TAGS = new Map()
let TAGS_CURRENT = new Set()
let CURRENT_FILE = 0
let FULL_WINDOW = false
let DIR_HANDLE = null
let AUTO_PLAY = false
let IMAGE_AUTOPLAY_TIMEOUT = null
let SPEED = 1

// Definitions of valid file extensions (lower case)
const imageFileExtensions = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
])
const videoFileExtensions = new Set([
  'mp4',
  'flv',
  'mpg',
  'mpeg',
  'webm',
  '3gp',
])

// Warning if FIle System API is unsupported
if (!window.showDirectoryPicker) { alert('This does not work in this browser!') }

/**
 * Reads files from a user selected directory, shuffles them, and displays the
 * first
 */
async function chooseDirectory () {
  FILES = []
  TAGS = new Map()
  DIR_HANDLE = await window.showDirectoryPicker()
  for await (const entry of DIR_HANDLE.values()) {
    if (entry.kind === 'file') {
      // Check if valid extension
      const extension = getFileExtension(entry.name)
      if (imageFileExtensions.has(extension) || videoFileExtensions.has(extension)) {
        FILES.push(entry)
      }
      // Tags
      let tags = getTags(entry.name)
      for (const tag of tags) {
        TAGS.has(tag)
          ? TAGS.set(tag, TAGS.get(tag) + 1)
          : TAGS.set(tag, 1)
      }
    }
  }
  // Shuffle for random view order
  // shuffle(FILES)
  updateStatusText()
  // Save all files for resetting filter
  FILES_ALL = [...FILES]
  // Show first file
  showFile(FILES[CURRENT_FILE])
  console.log(TAGS)
  // tag word cloud
  const container = document.querySelector('.alltags')
  for (const [tag, occurence] of [...TAGS.entries()].filter(d => d[1] > 1).sort((a, b) => b[1] - a[1])) {
    const button = document.createElement('button')
    button.innerText = tag
    button.title = `${tag} ${occurence} ${((occurence / FILES_ALL.length) * 100).toFixed(1)}%`
    button.style.fontSize = Math.sqrt(occurence) * 0.8 + 8
    // TODO: add to current set of tags
    // TODO: then when save button is clicked, suggest name plus new tags
    button.addEventListener('click', () => console.log(tag))
    container.appendChild(button)
  }
}

/**
 * Allow control via keyboard keys
 *
 * @param {KeyboardEvent} event key press event
 */
async function handleKeyPress (event) {
  // Still allow to use filter input
  const filterInput = document.getElementById('filterInput')
  if (event.target === filterInput) {
    return
  }
  // Still allow to reload page and use dev tools
  const passThrough = new Set(['F2', 'F5', 'F11', 'F12'])
  if (!passThrough.has(event.key)) {
    event.preventDefault()
  }
  console.log(event)
  const video = document.getElementsByTagName('video')[0]
  const fileHandle = FILES[CURRENT_FILE]
  switch (event.key) {
    case 'c':
      // Choose directory
      chooseDirectory()
      break
    case 'ArrowLeft':
      // Previous file
      showPrevFile()
      break
    case 'ArrowRight':
      // Next file
      showNextFile()
      break
    case 'ArrowUp':
      // Backward video
      video.currentTime -= 5
      break
    case 'ArrowDown':
      // Forward video
      video.currentTime += 5
      break
    case 'm':
      // Mute / unmute video
      video.muted = !video.muted
      break
    case '-':
      // Volume down
      video.volume = Math.max(video.volume - 0.05, 0)
      break
    case '+':
      // Volume up
      video.volume = Math.min(video.volume + 0.01, 1)
      break
    case 's':
      // Play slower
      video.playbackRate = Math.max(video.playbackRate / 2, 0.125)
      SPEED = video.playbackRate
      break
    case 'f':
      // Play faster
      video.playbackRate = Math.min(video.playbackRate * 2, 16)
      SPEED = video.playbackRate
      break
    case 'w':
      // Upscale video / image to full window size
      FULL_WINDOW = !FULL_WINDOW
      // Adapt size immediately, reloading file is fine
      showFile(fileHandle)
      break
    case 'a':
      // Toggle auto-play
      AUTO_PLAY = !AUTO_PLAY
      // Video cannot loop with autoplay
      video.loop = !AUTO_PLAY
      break
    case 'Delete':
      // Delete file from disk
      if (DIR_HANDLE && confirm(`Delete ${fileHandle.name}? Cannot be undone!`)) {
        deleteFile(fileHandle)
      }
      FILES = [...FILES.split(0, CURRENT_FILE), ...FILES.split(CURRENT_FILE + 1)]
      showFile(FILES[CURRENT_FILE])
      break
    case '1':
      // Shuffle
      sortFiles('shuffle')
      break
    case '2':
      // Sort by name
      sortFiles('name')
      break
    case '3':
      // Sort by date
      sortFiles('date')
      break
    case '4':
      // Sort by size
      sortFiles('size')
      break
    case 'F2':
      // Rename
      // Read current file
      await renameCurrent(fileHandle)
      break
  };
  updateStatusText()
}

/**
 * Opens a saveFilePicker to allow renaming the file
 * @param {*} fileHandle
 */
async function renameCurrent (fileHandle) {
  const file = await fileHandle.getFile()
  // Create a new handle
  const newHandle = await window.showSaveFilePicker({
    // See https://web.dev/file-system-access/
    suggestedName: fileHandle.name,
    startIn: DIR_HANDLE,
  })
  const writableStream = await newHandle.createWritable()
  await writableStream.write(file)
  await writableStream.close()
  // Delete old file
  deleteFile(fileHandle)
  // Show next file
  CURRENT_FILE = Math.min(CURRENT_FILE, FILES.length - 1)
  if (CURRENT_FILE > 0) {
    showFile(FILES[CURRENT_FILE])
  }
}

// /**
//  * Renames a file to add tags
//  * @param {*} fileHandle
//  * @param {string[]} tags
//  */
// async function addTags (fileHandle, tags) {
//   const file = await fileHandle.getFile()
//   const suggestedName = `${fileHandle.name} [${tags.join('][')}]`
//   // Create a new handle
//   const newHandle = await window.showSaveFilePicker({
//     // See https://web.dev/file-system-access/
//     suggestedName,
//     startIn: DIR_HANDLE,
//   })
//   const writableStream = await newHandle.createWritable()
//   await writableStream.write(file)
//   await writableStream.close()
//   // Delete old file
//   deleteFile(fileHandle)
//   // Show next file
//   CURRENT_FILE = Math.min(CURRENT_FILE, FILES.length - 1)
//   if (CURRENT_FILE > 0) {
//     showFile(FILES[CURRENT_FILE])
//   }
// }


/**
 * Deletes a file from disk and removes it from FILES_ALL and FILES
 *
 * @param {FileHandle} fileHandle file handle
 */
async function deleteFile (fileHandle) {
  FILES_ALL = FILES_ALL.filter(d => d.name !== fileHandle.name)
  FILES.splice(CURRENT_FILE, 1)
  DIR_HANDLE.removeEntry(fileHandle.name)
}

/**
 * Displays status info such as number of files and current file's name
 */
async function updateStatusText () {
  if (FILES.length === 0) { return }
  const currentName = FILES[CURRENT_FILE].name
  const video = document.getElementsByTagName('video')[0]
  const text =
    `${CURRENT_FILE + 1} / ` +
    `${FILES.length} files - ` +
    `${currentName} - ` +
    `Vol: ${video.muted ? 'muted' : Math.round(video.volume * 100)} - ` +
    `Rate: ${SPEED} - ` +
    `${Math.round(video.currentTime)} / ${Math.round(video.duration)} sec`
  document.getElementById('status').innerText = text
  // Progress bar
  document.getElementById('progressBar').style.width = video?.duration ? (video.currentTime / video.duration * 100) + "%" : "0"
}

/**
 * Allows to filter files by tags that are inside the file's name such as
 * 'example file [tag1][tag2].extension'
 *
 * @param {FormEvent} [event] for submit event
 */
async function updateFilter (event) {
  if (event) {
    event.preventDefault()
  }
  // TODO: allow user to choose mode
  const mustHaveAll = true
  // Get tags from filter input
  const inputText = document.getElementById('filterInput').value
  const rawTags = inputText.split(' ')
    .map(d => d.trim())
    .filter(d => d.length > 0)
  const tags = new Set(rawTags)
  // Filter files
  FILES = FILES_ALL.filter(file => {
    const fileTags = getTags(file.name)
    if (mustHaveAll) {
      // AND search, all tags fromt he input must be present
      const fileTagSet = new Set(fileTags)
      for (const tag of tags.values()) {
        if (!fileTagSet.has(tag)) {
          return false
        }
      }
      return true
    } else {
      // OR search, at least one tag from the input must be present
      for (const tag of fileTags) {
        if (tags.has(tag)) {
          return true
        }
      }
      return false
    }
  })
  updateStatusText()
}

/**
 * Sorts files by either name, size, or change date
 *
 * @param {'name'|'date'|'size'|'shuffle'} mode sorting mode
 */
async function sortFiles (mode) {
  if (mode === 'name') {
    FILES.sort((a, b) => a.name < b.name ? -1 : 1)
  } else if (mode === 'date' || mode === 'size') {
    const comparableArray = mode === 'date'
      ? await Promise.all(FILES.map(async d => [await d.getFile().lastModified, d]))
      : await Promise.all(FILES.map(async d => [await d.getFile().size, d]))
    comparableArray.sort((a, b) => a[0] < b[0] ? -1 : 1)
    FILES = comparableArray.map(x => x[1])
  } else if (mode === 'shuffle') {
    shuffle(FILES)
  } else {
    console.error('Invalid sorting mode')
  }
  console.log(FILES)
}

/**
 * Shows next file in FILES
 */
async function showNextFile () {
  CURRENT_FILE = CURRENT_FILE >= FILES.length - 1 ? 0 : CURRENT_FILE + 1
  showFile(FILES[CURRENT_FILE])
}

/**
 * Shows previous file in FILES
 */
async function showPrevFile () {
  CURRENT_FILE = CURRENT_FILE <= 0 ? FILES.length - 1 : CURRENT_FILE - 1
  showFile(FILES[CURRENT_FILE])
}

/**
 * Shows current file in FILES
 *
 * @param {FileHandle} fileHandle file handle
 */
async function showFile (fileHandle) {
  // Cancel autoplay timeout (a new will start in the called funtions)
  window.clearTimeout(IMAGE_AUTOPLAY_TIMEOUT)
  const extension = getFileExtension(fileHandle.name)
  if (!extension) {
    throw new Error('No file extension')
  }
  if (videoFileExtensions.has(extension)) {
    showVideo(fileHandle)
    showTags(fileHandle)
  } else if (imageFileExtensions.has(extension)) {
    showImage(fileHandle)
    showTags(fileHandle)
  } else {
    alert('Not a image or video file')
  }
}

/**
 * Displays a file as video
 *
 * @param {FileHandle} fileHandle file handle
 */
async function showVideo (fileHandle) {
  // Hide image, show video
  const img = document.getElementsByTagName('img')[0]
  img.style.display = 'none'
  const video = document.getElementsByTagName('video')[0]
  video.style.display = 'block'
  // Load and play video
  const file = await fileHandle.getFile()
  const url = URL.createObjectURL(file)
  video.onloadeddata = () => {
    // setSize(video, video.videoWidth, video.videoHeight)
    video.play()
  }
  video.onended = onVideoEnded
  video.ontimeupdate = updateStatusText
  video.playbackRate = SPEED
  video.src = url
  video.load()
}

/**
 * Show next video if AUTO_PLAy is true
 */
function onVideoEnded () {
  if (AUTO_PLAY) {
    showNextFile()
  }
}

/**
 * Displays a file as image
 *
 * @param {FileHandle} fileHandle file handle
 */
async function showImage (fileHandle) {
  // Hide video, show image
  const video = document.getElementsByTagName('video')[0]
  video.style.display = 'none'
  const img = document.getElementsByTagName('img')[0]
  img.style.display = 'block'
  // Display image
  const file = await fileHandle.getFile()
  const url = URL.createObjectURL(file)
  img.onload = () => {
    // setSize(img, img.naturalWidth, img.naturalHeight)
    if (AUTO_PLAY) {
      IMAGE_AUTOPLAY_TIMEOUT = window.setTimeout(
        showNextFile,
        AUTOPLAY_WAIT_TIME,
      )
    }
  }
  img.src = url
}

/**
 * Displays the tags of the current file
 * @param {FileHandle} fileHandle file handle
 */
function showTags (fileHandle) {
  let tags = getTags(fileHandle.name)
  TAGS_CURRENT = new Set(tags)
  console.log(TAGS_CURRENT)

  const container = document.querySelector('.tags')
  container.innerText = 'Tags:'
  for (const tag of TAGS_CURRENT) {
    const button = document.createElement('button')
    button.innerText = tag
    if (TAGS.get(tag) < 3) {
      // mark as rare and maybe typo
      button.style.backgroundColor = 'rgb(117, 0, 0)'
      button.title = 'Occurs less then 3 times'
      button.addEventListener('click', () => {
        if (confirm('Remove tag?')) {

          TAGS_CURRENT.delete(tag)

        }
      })
    }
    container.appendChild(button)
  }
}



/**
 * Returns the tags from the filename
 * @param {string} fileName
 * @returns {string[]}
 */
function getTags (fileName) {
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
// function setSize (element, originalWidth, originalHeight) {
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
function getFileExtension (fileName) {
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
function shuffle (array) {
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
