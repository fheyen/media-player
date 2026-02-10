<script>
  import { onDestroy, onMount } from "svelte";
  import {
    getFileExtension,
    getTags,
    getUrlParam,
    imageFileExtensions,
    shuffle,
    videoFileExtensions,
  } from "./lib/lib.js";
  import AddTagButton from "./lib/add-tag-button.svelte";
  import { version } from "../package.json";

  /**
   * TODO:
   * - get gif duration for autoplay
   * - filter with not, e.g. !tag to exclude a tag
   */

  // Config
  const AUTOPLAY_WAIT_TIME = 3000;
  const SHOW_TAGS = getUrlParam(window, "tags") !== null;

  // Globals
  let FILES = [];
  let FILES_ALL = [];
  let TAGS = new Map();
  let TAGS_CURRENT = new Set();
  let CURRENT_FILE = 0;
  let DIR_HANDLE = null;
  let AUTO_PLAY = false;
  let IMAGE_AUTOPLAY_TIMEOUT = null;
  let SPEED = 1;

  // Warning if File System API is unsupported
  if (!window.showDirectoryPicker) {
    alert("Local file access does not work in this browser!");
  }

  /**
   * Reads files from a user selected directory, shuffles them, and displays the
   * first
   * @see https://web.dev/file-system-access/
   */
  async function chooseDirectory() {
    FILES = [];
    TAGS = new Map();
    DIR_HANDLE = await window.showDirectoryPicker();
    for await (const entry of DIR_HANDLE.values()) {
      if (entry.kind === "file") {
        // Check if valid extension
        const extension = getFileExtension(entry.name);
        if (
          imageFileExtensions.has(extension) ||
          videoFileExtensions.has(extension)
        ) {
          FILES.push(entry);
        }
        // Tags
        let tags = getTags(entry.name);
        for (const tag of tags) {
          TAGS.has(tag) ? TAGS.set(tag, TAGS.get(tag) + 1) : TAGS.set(tag, 1);
        }
      }
    }
    // Shuffle for random view order
    updateStatusText();
    // Save all files for resetting filter
    FILES_ALL = [...FILES];
    // Show first file
    CURRENT_FILE = 0;
    showFile(FILES[CURRENT_FILE]);
    // sort tags
    TAGS = new Map([...TAGS.entries()].sort((a, b) => b[1] - a[1]));
  }

  /**
   * Allow control via keyboard keys
   *
   * @param {KeyboardEvent} event key press event
   */
  async function handleKeyPress(event) {
    // Still allow to use filter input
    const filterInput = document.getElementById("filterInput");
    if (event.target === filterInput) {
      return;
    }
    // Still allow to reload page and use dev tools
    const passThrough = new Set(["F2", "F5", "F11", "F12"]);
    if (!passThrough.has(event.key)) {
      event.preventDefault();
    }
    const video = document.getElementsByTagName("video")[0];
    const fileHandle = FILES[CURRENT_FILE];
    switch (event.key) {
      case "c":
        // Choose directory
        chooseDirectory();
        break;
      case "ArrowLeft":
        // Previous file
        showPrevFile();
        break;
      case "ArrowRight":
        // Next file
        showNextFile();
        break;
      case "ArrowUp":
        // Backward video
        video.currentTime -= 5;
        break;
      case "ArrowDown":
        // Forward video
        video.currentTime += 5;
        break;
      case "m":
        // Mute / unmute video
        video.muted = !video.muted;
        break;
      case "-":
        // Volume down
        video.volume = Math.max(video.volume - 0.05, 0);
        break;
      case "+":
        // Volume up
        video.volume = Math.min(video.volume + 0.01, 1);
        break;
      case "s":
        // Play slower
        video.playbackRate = Math.max(video.playbackRate / 2, 0.125);
        SPEED = video.playbackRate;
        break;
      case "f":
        // Play faster
        video.playbackRate = Math.min(video.playbackRate * 2, 16);
        SPEED = video.playbackRate;
        break;
      case "a":
        // Toggle auto-play
        toggleAutoPlay(video);
        break;
      case "Delete":
        deleteFilePromt();
        break;
      case "1":
        // Shuffle
        sortFiles("shuffle");
        break;
      case "2":
        // Sort by name
        sortFiles("name");
        break;
      case "3":
        // Sort by date
        sortFiles("date");
        break;
      case "4":
        // Sort by size
        sortFiles("size");
        break;
      case "F2":
        // Rename
        // Read current file
        let nameWithoutTags = fileHandle.name;
        if (fileHandle.name.indexOf("[") > 0) {
          nameWithoutTags = fileHandle.name.substring(
            0,
            fileHandle.name.indexOf("["),
          );
        }
        const extension = getFileExtension(fileHandle.name);
        const newName = `${nameWithoutTags} [${[...TAGS_CURRENT].join("][")}].${extension}`;
        await renameCurrent(fileHandle, newName);
        break;
    }
    updateStatusText();
  }

  /**
   * Scroll outside video for time
   * @param e
   */
  function mainWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    const video = document.getElementsByTagName("video")[0];
    video.currentTime += e.deltaY < 0 ? -1 : 1;
    if (video.currentTime > video.duration - 2) {
      showNextFile();
    } else if (video.currentTime < 2) {
      showPrevFile();
    }
  }

  /**
   * Scroll on video for loudness
   * @param e
   */
  function videoWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    const video = document.getElementsByTagName("video")[0];
    if (e.deltaY < 0) {
      // Volume down
      video.volume = Math.max(video.volume - 0.05, 0);
    } else {
      // Volume up
      video.volume = Math.min(video.volume + 0.01, 1);
    }
  }

  onMount(() => {
    document.body.addEventListener("keydown", handleKeyPress);
  });

  onDestroy(() => {
    document.body.removeEventListener("keydown", handleKeyPress);
  });

  /**
   * Opens a saveFilePicker to allow renaming the file
   * @param {*} fileHandle
   * @param {string|null} suggestedName suggested file name
   */
  async function renameCurrent(fileHandle, suggestedName = null) {
    const file = await fileHandle.getFile();
    // Create a new handle
    const newHandle = await window.showSaveFilePicker({
      // See https://web.dev/file-system-access/
      suggestedName: suggestedName ?? fileHandle.name,
      startIn: DIR_HANDLE,
    });
    const writableStream = await newHandle.createWritable();
    await writableStream.write(file);
    await writableStream.close();
    // TODO: replace old by new handle in FILES_ALL
    // Delete old file
    deleteFile(fileHandle);
    // Show next file
    CURRENT_FILE = Math.min(CURRENT_FILE, FILES.length - 1);
    if (CURRENT_FILE > 0) {
      showFile(FILES[CURRENT_FILE]);
    }
  }

  function deleteFilePromt() {
    const fileHandle = FILES[CURRENT_FILE];
    // Delete file from disk
    if (DIR_HANDLE && confirm(`Delete ${fileHandle.name}? Cannot be undone!`)) {
      deleteFile(fileHandle);
      showFile(FILES[CURRENT_FILE]);
    }
  }

  function toggleAutoPlay(video) {
    AUTO_PLAY = !AUTO_PLAY;
    // Video cannot loop with autoplay
    video.loop = !AUTO_PLAY;
  }

  /**
   * Deletes a file from disk and removes it from FILES_ALL and FILES
   *
   * @param {FileHandle} fileHandle file handle
   */
  async function deleteFile(fileHandle) {
    FILES_ALL = FILES_ALL.filter((d) => d.name !== fileHandle.name);
    FILES = FILES.filter((d) => d.name !== fileHandle.name);
    DIR_HANDLE.removeEntry(fileHandle.name);
  }

  /**
   * Displays status info such as number of files and current file's name
   */
  async function updateStatusText() {
    if (FILES.length === 0) {
      return;
    }
    const currentName = FILES[CURRENT_FILE].name;
    const video = document.getElementsByTagName("video")[0];
    const text =
      `${CURRENT_FILE + 1} / ` +
      `${FILES.length} files - ` +
      `${currentName} - ` +
      `Vol: ${video.muted ? "muted" : Math.round(video.volume * 100)} - ` +
      `Rate: ${SPEED} - ` +
      `${Math.round(video.currentTime)} / ${Math.round(video.duration)} sec`;
    document.getElementById("status").innerText = text;
    // Progress bar
    document.getElementById("progressBar").style.width = video?.duration
      ? (video.currentTime / video.duration) * 100 + "%"
      : "0";
  }

  /**
   * Allows to filter files by tags that are inside the file's name such as
   * 'example file [tag1][tag2].extension'
   *
   * @param {FormEvent} [event] for submit event
   */
  async function updateFilter(event) {
    if (event) {
      event.preventDefault();
    }
    // TODO: allow user to choose mode
    const mustHaveAll = true;
    // Get tags from filter input
    const inputText = document.getElementById("filterInput").value;
    const rawTags = inputText
      .split(" ")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);
    const tags = new Set(rawTags);
    // Filter files
    FILES = FILES_ALL.filter((file) => {
      const fileTags = getTags(file.name);
      if (mustHaveAll) {
        // AND search, all tags fromt he input must be present
        const fileTagSet = new Set(fileTags);
        for (const tag of tags.values()) {
          if (!fileTagSet.has(tag)) {
            return false;
          }
        }
        return true;
      } else {
        // OR search, at least one tag from the input must be present
        for (const tag of fileTags) {
          if (tags.has(tag)) {
            return true;
          }
        }
        return false;
      }
    });
    updateStatusText();
  }

  /**
   * Sorts files by either name, size, or change date
   *
   * @param {'name'|'date'|'size'|'shuffle'} mode sorting mode
   */
  async function sortFiles(mode) {
    if (mode === "name") {
      FILES.sort((a, b) => (a.name < b.name ? -1 : 1));
    } else if (mode === "date" || mode === "size") {
      const comparableArray =
        mode === "date"
          ? await Promise.all(
              FILES.map(async (d) => [await d.getFile().lastModified, d]),
            )
          : await Promise.all(
              FILES.map(async (d) => [await d.getFile().size, d]),
            );
      comparableArray.sort((a, b) => (a[0] < b[0] ? -1 : 1));
      FILES = comparableArray.map((x) => x[1]);
    } else if (mode === "shuffle") {
      shuffle(FILES);
    } else {
      console.error("Invalid sorting mode");
    }
  }

  /**
   * Shows next file in FILES
   */
  async function showNextFile() {
    CURRENT_FILE = CURRENT_FILE >= FILES.length - 1 ? 0 : CURRENT_FILE + 1;
    showFile(FILES[CURRENT_FILE]);
  }

  /**
   * Shows previous file in FILES
   */
  async function showPrevFile() {
    CURRENT_FILE = CURRENT_FILE <= 0 ? FILES.length - 1 : CURRENT_FILE - 1;
    showFile(FILES[CURRENT_FILE]);
  }

  /**
   * Shows current file in FILES
   *
   * @param {FileHandle} fileHandle file handle
   */
  async function showFile(fileHandle) {
    // Cancel autoplay timeout (a new will start in the called funtions)
    window.clearTimeout(IMAGE_AUTOPLAY_TIMEOUT);
    const extension = getFileExtension(fileHandle.name);
    if (!extension) {
      throw new Error("No file extension");
    }
    if (videoFileExtensions.has(extension)) {
      showVideo(fileHandle);
      TAGS_CURRENT = new Set(getTags(fileHandle.name));
    } else if (imageFileExtensions.has(extension)) {
      showImage(fileHandle);
      TAGS_CURRENT = new Set(getTags(fileHandle.name));
    } else {
      alert("Not a image or video file");
    }
  }

  /**
   * Displays a file as video
   *
   * @param {FileHandle} fileHandle file handle
   */
  async function showVideo(fileHandle) {
    // Hide image, show video
    const img = document.getElementsByTagName("img")[0];
    img.style.display = "none";
    const video = document.getElementsByTagName("video")[0];
    video.style.display = "block";
    // Load and play video
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    video.onloadeddata = () => {
      // setSize(video, video.videoWidth, video.videoHeight)
      video.play();
    };
    video.onended = onVideoEnded;
    video.ontimeupdate = updateStatusText;
    video.playbackRate = SPEED;
    video.src = url;
    video.load();
  }

  /**
   * Show next video if AUTO_PLAy is true
   */
  function onVideoEnded() {
    if (AUTO_PLAY) {
      showNextFile();
    }
  }

  /**
   * Displays a file as image
   *
   * @param {FileHandle} fileHandle file handle
   */
  async function showImage(fileHandle) {
    // Hide video, show image
    const video = document.getElementsByTagName("video")[0];
    video.style.display = "none";
    const img = document.getElementsByTagName("img")[0];
    img.style.display = "block";
    // Display image
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      // setSize(img, img.naturalWidth, img.naturalHeight)
      if (AUTO_PLAY) {
        IMAGE_AUTOPLAY_TIMEOUT = window.setTimeout(
          showNextFile,
          AUTOPLAY_WAIT_TIME,
        );
      }
    };
    img.src = url;
  }
</script>

<main on:mousewheel={mainWheel}>
  <div id="progress">
    <div id="progressBar"></div>
  </div>
  <div id="status"></div>

  <div class="mediaContainer">
    <video
      autoplay={true}
      controls={true}
      loop={true}
      muted={true}
      volume={0.5}
      on:mousewheel={videoWheel}
    ></video>
    <img />
  </div>

  {#if SHOW_TAGS}
    <div class="filterContainer">
      <form on:submit={updateFilter}>
        <input
          id="filterInput"
          type="text"
          placeholder="filter by tags"
          title="Press enter to apply"
        />
      </form>
    </div>

    <div class="tags">
      {#each [...TAGS_CURRENT] as tag}
        <button
          class={TAGS.get(tag) < 3 ? "rare" : ""}
          title="occurs {TAGS.get(tag)} times"
          on:click={() => {
            if (confirm("Remove tag?")) {
              TAGS_CURRENT.delete(tag);
              TAGS_CURRENT = new Set(TAGS_CURRENT);
            }
          }}
        >
          {tag}
        </button>
      {/each}
    </div>
    <AddTagButton bind:tags={TAGS_CURRENT} allTags={TAGS} />

    <div class="alltags">
      {#each TAGS.keys() as tag}
        <button
          class={TAGS.get(tag) < 3 ? "rare" : ""}
          title="{`${tag} ${TAGS.get(tag)} ${((TAGS.get(tag) / FILES_ALL.length) * 100).toFixed(1)}%`}. Click to add tag to current file."
          on:click={() => {
            TAGS_CURRENT.add(tag);
            TAGS_CURRENT = new Set(TAGS_CURRENT);
          }}
        >
          {tag}
        </button>
      {/each}
    </div>
  {/if}

  <div class="info">
    <div>
      <div on:click={chooseDirectory}>
        <span>c</span> choose directory
      </div>
      <div>
        <span>🢀</span> / <span>🢂</span> previous / next item
      </div>
      <div>
        <span>🢁</span> / <span>🢃</span> 5 seconds backward / forward
      </div>
      <div>
        <span>+</span> / <span>-</span> / <span>m</span> volume up / down / muted
      </div>
      <div>
        <span>s</span> / <span>f</span> play video slower / faster
      </div>
      <div on:click={toggleAutoPlay}>
        <span>a</span> toggle autoplay
      </div>
      <div on:click={deleteFilePromt}>
        <span>Delete</span> delete file
      </div>
      <div>
        <span>F2</span> rename file
      </div>
      <div>
        <span>F5</span> refresh
      </div>
      <div>
        <span>F11</span> fullscreen
      </div>
      <div>
        sort:
        <span on:click={() => sortFiles("shuffle")}>1</span> shuffle
        <span on:click={() => sortFiles("name")}>2</span> name
        <span on:click={() => sortFiles("date")}>3</span> date
        <span on:click={() => sortFiles("size")}>4</span> size
      </div>
    </div>
  </div>

  <footer>v{version}</footer>
</main>

<style>
  button.rare {
    background-color: #791717;
  }
</style>
