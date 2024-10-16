<script>
  export let tags = new Set();
  export let allTags = new Map();

  let input = '';

  const add = () => {
    console.log('add');

    const newTag = input.trim();
    if (newTag.length > 0) {
      tags.add(newTag);
      tags = new Set(tags);
    }
    input = '';
  };

  const checkForEnter = (evt) => {
    console.log(evt);

    evt.stopPropagation();
    if (evt.key === 'Enter') {
      add();
    }
  };
</script>

<input
  type="text"
  placeholder="add tag"
  list="tag-suggestions"
  bind:value="{input}"
  on:keydown="{checkForEnter}"
  on:keyup="{checkForEnter}"
  on:keypress="{checkForEnter}"
/>
<button on:click="{add}"> + </button>
<datalist id="tag-suggestions">
  {#each allTags.keys() as tag}
    <option value="{tag}">tag</option>
  {/each}
</datalist>
