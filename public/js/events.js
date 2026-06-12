async function fetchEvents() {
  const res = await fetch('/api/events' + window.location.search);
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

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleFiltersBtn');
  const searchForm = document.getElementById('panelSearchForm');
  
  if (toggleBtn && searchForm) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = searchForm.style.display === 'none';
      searchForm.style.display = isHidden ? 'flex' : 'none';
      toggleBtn.textContent = isHidden ? '[-] Hide Filters' : '[+] Search Filters';
    });
    
    const searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get('name');
    const date = searchParams.get('date');
    const location = searchParams.get('location');
    
    if (name || date || location) {
      searchForm.style.display = 'flex';
      toggleBtn.textContent = '[-] Hide Filters';
      
      if (name) document.getElementById('filterName').value = name;
      if (date) document.getElementById('filterDate').value = date;
      if (location) document.getElementById('filterLocation').value = location;
    }
  }
});

fetchEvents();
