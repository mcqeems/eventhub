async function fetchParticipants() {
  const res = await fetch('/api/participants' + window.location.search);
  const data = await res.json();
  const tbody = document.querySelector('#participantsTable tbody');
  tbody.innerHTML = '';

  if (data.data) {
    data.data.forEach((p) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.email}</td>
        <td>${p.institusi}</td>
        <td>${p.jurusan}</td>
        <td>${p.semester}</td>
        <td>${p.events ? p.events.name : p.event_id}</td>
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
  if (!confirm('Are you sure you want to delete this participant?')) return;
  await fetch(`/api/participants/${id}`, { method: 'DELETE' });
  fetchParticipants();
}

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggleFiltersBtn');
  const searchForm = document.getElementById('panelSearchForm');
  
  const filterEventName = document.getElementById('filterEventName');
  const filterEventId = document.getElementById('filterEventId');
  const eventDropdown = document.getElementById('eventDropdown');
  let debounceTimeout;

  if (filterEventName && eventDropdown) {
    filterEventName.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (!val) {
        filterEventId.value = '';
        eventDropdown.style.display = 'none';
        return;
      }
      
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(async () => {
        try {
          const res = await fetch('/api/events?name=' + encodeURIComponent(val));
          const data = await res.json();
          eventDropdown.innerHTML = '';
          
          if (data.data && data.data.length > 0) {
            const top4 = data.data.slice(0, 4);
            top4.forEach(ev => {
              const item = document.createElement('div');
              item.textContent = ev.name;
              item.style.padding = '8px 12px';
              item.style.cursor = 'pointer';
              item.style.borderBottom = '1px solid var(--colors-hairline)';
              
              item.addEventListener('mouseenter', () => {
                item.style.background = 'var(--colors-surface-soft)';
              });
              item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
              });
              
              item.addEventListener('click', () => {
                filterEventName.value = ev.name;
                filterEventId.value = ev.id;
                eventDropdown.style.display = 'none';
              });
              
              eventDropdown.appendChild(item);
            });
            eventDropdown.style.display = 'block';
          } else {
            eventDropdown.style.display = 'none';
          }
        } catch (err) {
          console.error(err);
        }
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (e.target !== filterEventName && e.target !== eventDropdown && !eventDropdown.contains(e.target)) {
        eventDropdown.style.display = 'none';
      }
    });
  }

  if (toggleBtn && searchForm) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = searchForm.style.display === 'none';
      searchForm.style.display = isHidden ? 'flex' : 'none';
      toggleBtn.textContent = isHidden ? '[-] Hide Filters' : '[+] Search Filters';
    });
    
    const searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const institusi = searchParams.get('institusi');
    const jurusan = searchParams.get('jurusan');
    const semester = searchParams.get('semester');
    const event_id = searchParams.get('event_id');
    
    if (name || email || institusi || jurusan || semester || event_id) {
      searchForm.style.display = 'flex';
      toggleBtn.textContent = '[-] Hide Filters';
      
      if (name) document.getElementById('filterName').value = name;
      if (email) document.getElementById('filterEmail').value = email;
      if (institusi) document.getElementById('filterInstitusi').value = institusi;
      if (jurusan) document.getElementById('filterJurusan').value = jurusan;
      if (semester) document.getElementById('filterSemester').value = semester;
      
      if (event_id && filterEventId && filterEventName) {
        filterEventId.value = event_id;
        try {
          const res = await fetch('/api/events/' + event_id);
          const data = await res.json();
          if (data.data && data.data.name) {
            filterEventName.value = data.data.name;
          }
        } catch (err) {
          console.error('Failed to fetch event name for ID:', event_id);
        }
      }
    }
  }
});

fetchParticipants();
