async function fetchEvents() {
  const res = await fetch('/api/events');
  const data = await res.json();
  const tbody = document.querySelector('#eventsTable tbody');
  tbody.innerHTML = '';
  
  if(data.data) {
    data.data.forEach(ev => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${ev.id}</td>
        <td>${ev.name}</td>
        <td>${new Date(ev.date).toLocaleDateString()}</td>
        <td>${ev.location}</td>
        <td>
          <a href="/panel/events/${ev.id}" class="button-primary" style="margin-right: 8px;">View</a>
          <a href="/panel/events/edit/${ev.id}" class="button-secondary" style="margin-right: 8px;">Update</a>
          <button class="button-danger" onclick="deleteEvent(${ev.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

async function deleteEvent(id) {
  if(!confirm('Are you sure you want to delete this event?')) return;
  await fetch(`/api/events/${id}`, { method: 'DELETE' });
  fetchEvents();
}

fetchEvents();
