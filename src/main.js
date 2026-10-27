import "./style.css"
 
let tasks = [
  { id: 1, title: "Studiare per la verifica", completed: false },
  { id: 2, title: "Comprare il pane", completed: true },
  { id: 3, title: "Finire il progetto TPSIT", completed: false }
]
 
const lista = document.querySelector("#lista")
const info  = document.querySelector("#info")
const form  = document.querySelector("#form-task")
const campo = document.querySelector("#campo-task")
 
form.addEventListener("submit", (evento) => {
  evento.preventDefault()
  addTask(campo.value)
  campo.value = ""
  campo.focus()
})
 
lista.addEventListener("click", (evento) => {
  const elemento = evento.target
 
  if (elemento.classList.contains("elimina")) {
    deleteTask(Number(elemento.dataset.id))
    return
  }
 
  const riga = elemento.closest("li")
  if (riga) toggleTask(Number(riga.dataset.id))
})
 
function render() {
  lista.innerHTML = tasks.map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">×</button>
      </li>
    `).join("")
 
  const completati = tasks.filter(t => t.completed).length
  info.textContent = `Totali: ${tasks.length} · Completati: ${completati}`
}
 
render()
 
function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return
 
  const nuovo = {
    id: Date.now(),
    title: pulito,
    completed: false
  }
 
  tasks = [...tasks, nuovo]
  render()
}
 
function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  )
 
  render()
}
 
function deleteTask(id) {
  const conferma = confirm("Sei sicuro di voler eliminare questo task?");
  
  if (!conferma) return;

  tasks = tasks.filter(t => t.id !== id)
  render()
}