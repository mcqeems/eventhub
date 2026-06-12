async function fetchParticipants() {
  const res = await fetch('/api/participants');
  const data = await res.json();
  const tbody = document.querySelector('#participantsTable tbody');
  tbody.innerHTML = '';
  
  if(data.data) {
    data.data.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.email}</td>
        <td>${p.institusi}</td>
        <td>${p.jurusan}</td>
        <td>${p.semester}</td>
        <td>${p.event_id}</td>
        <td>
          <a href="/panel/participants/${p.id}" class="button-primary" style="margin-right: 8px;">View</a>
          <a href="/panel/participants/edit/${p.id}" class="button-secondary" style="margin-right: 8px;">Update</a>
          <button class="button-danger" onclick="deleteParticipant(${p.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

async function deleteParticipant(id) {
  if(!confirm('Are you sure you want to delete this participant?')) return;
  await fetch(`/api/participants/${id}`, { method: 'DELETE' });
  fetchParticipants();
}

fetchParticipants();
