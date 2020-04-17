Vue.filter('date', function(val){
	return moment(val).format("DD/MM/YY, HH:mm")
})

new Vue({
	el: "#notebook",
	data() {
		return {
			notes: JSON.parse(localStorage.getItem("notes")) || [],
			selectedId: localStorage.getItem("selected-id") || null
			}
		},
	computed: {
		notePreview() {
			return this.selectedNote ? marked(this.selectedNote.content): ''
		},
		selectedNote() {
			return this.notes.find(note => note.id === this.selectedId)
		},
		sortedNotes() {
			//return this.notes.slice().sort((a, b) => a.created - b.created).sort((a, b) => (a.favourite === b.favourite) ? 0 : a.favourite ? -1 : 1)
			return this.notes.slice().sort((a, b) => a.created - b.created)
				.sort((a, b) => (a.favourite === b.favourite) ? 0 : a.favourite ? -1 : 1)
		}
	},
	watch: {
		notes: {
			handler: 'saveNotes',
			deep: true
		},
		selectedId(val) {
			localStorage.setItem("selected-id", val)
		}
	},
	methods: {
		addNote() {
			const time = Date.now();
			const note = {
				id: String(time),
				title: "New note" + (this.notes.length + 1),
				content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
				created: time,
				favourite: false
			}
			this.notes.push(note)
		},
		selectNote(note) {
			this.selectedId = note.id
		},
		saveNotes() {
			localStorage.setItem("notes", JSON.stringify(this.notes))
		},
		removeNote() {
			if (this.selectNote && confirm("Delete this note? ")) {
				const index = this.notes.indexOf(this.selectedNote)
				this.notes.splice(index)
			}
		},
		favouriteNote() {
			this.selectedNote.favourite ^= true
		}
	}
})