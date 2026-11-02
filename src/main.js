import "./style.css"

let tasks = [
  { id: 1, title: "Studiare per la verifica", status: "todo" },
  { id: 2, title: "Comprare il pane", status: "done" },
  { id: 3, title: "Finire il progetto TPSIT", status: "in_progress" }
]

let currentFilter = "all"

const lista = document.querySelector("#lista")
const info  = document.querySelector("#info")
const form  = document.querySelector("#form-task")
const campo = document.querySelector("#campo-task")
const main  = document.querySelector("main")

// --- CREAZIONE DINAMICA DEI FILTRI TRAMITE JAVASCRIPT ---
const filtriContainer = document.createElement("div")
filtriContainer.id = "filtri"
filtriContainer.innerHTML = `
  <button class="filtro-btn attivo" data-filtro="all">Tutti</button>
  <button class="filtro-btn" data-filtro="todo">Da iniziare</button>
  <button class="filtro-btn" data-filtro="in_progress">In corso</button>
  <button class="filtro-btn" data-filtro="done">Completati</button>
`
// Inseriamo i filtri subito prima della lista dei task nell'HTML via JS
main.insertBefore(filtriContainer, lista)


form.addEventListener("submit", (evento) => {
  evento.preventDefault()
  addTask(campo.value)
  campo.value = ""
  campo.focus()
})

// Gestione click sulla lista dei task
lista.addEventListener("click", (evento) => {
  const elemento = evento.target
  const id = Number(elemento.dataset.id || elemento.closest("li")?.dataset.id)

  if (!id) return

  if (elemento.classList.contains("elimina")) {
    deleteTask(id)
    return
  }

  if (elemento.classList.contains("btn-stato")) {
    toggleInProgress(id)
    return
  }

  if (elemento.classList.contains("titolo")) {
    toggleDone(id)
  }
})

// Gestione click sui filtri generati da JS
filtriContainer.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("filtro-btn")) {
    document.querySelectorAll(".filtro-btn").forEach(btn => btn.classList.remove("attivo"))
    evento.target.classList.add("attivo")
    
    currentFilter = evento.target.dataset.filtro
    render()
  }
})

function render() {
  const tasksFiltrati = tasks.filter(t => {
    if (currentFilter === "todo") return t.status === "todo"
    if (currentFilter === "in_progress") return t.status === "in_progress"
    if (currentFilter === "done") return t.status === "done"
    return true
  })

  lista.innerHTML = tasksFiltrati.map(t => `
    <li class="${t.status}" data-id="${t.id}">
      <button class="btn-stato" data-id="${t.id}" title="Cambia stato">
        ${t.status === "in_progress" ? "In corso" : "▶"}
      </button>
      <span class="titolo">${t.title}</span>
      <button class="elimina" data-id="${t.id}">×</button>
    </li>
  `).join("")

  const completati = tasks.filter(t => t.status === "done").length
  const inCorso = tasks.filter(t => t.status === "in_progress").length
  
  info.textContent = `Totali: ${tasks.length} · In corso: ${inCorso} · Completati: ${completati}`
}

function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return

  const nuovo = {
    id: Date.now(),
    title: pulito,
    status: "todo"
  }

  tasks = [...tasks, nuovo]
  render()
}

function toggleInProgress(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      const nuovoStato = t.status === "in_progress" ? "todo" : "in_progress"
      return { ...t, status: nuovoStato }
    }
    return t
  })
  render()
}

function toggleDone(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      const nuovoStato = t.status === "done" ? "todo" : "done"
      return { ...t, status: nuovoStato }
    }
    return t
  })
  render()
}

function deleteTask(id) {
  const conferma = confirm("Sei sicuro di voler eliminare questo task?");
  if (!conferma) return;

  tasks = tasks.filter(t => t.id !== id)
  render()
}

render()