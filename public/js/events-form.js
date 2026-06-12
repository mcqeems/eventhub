document.addEventListener('DOMContentLoaded', async () => {
  const isEdit = document.getElementById('isEdit').value === 'true';
  let eventId = null;

  if (isEdit) {
    const pathParts = window.location.pathname.split('/');
    eventId = pathParts[pathParts.length - 1];
    
    // Fetch and populate
    try {
      const res = await fetch(`/api/events/${eventId}`);
      const data = await res.json();
      const ev = data.data || data;
      
      if (ev) {
        document.getElementById('eventName').value = ev.name;
        // Format date to YYYY-MM-DD
        const d = new Date(ev.date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        document.getElementById('eventDate').value = `${yyyy}-${mm}-${dd}`;
        document.getElementById('eventLocation').value = ev.location;
        document.getElementById('eventMax').value = ev.max || '';
        document.getElementById('eventMin').value = ev.min || 1;
      }
    } catch(err) {
      console.error(err);
    }
  }

  document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('eventName').value,
      date: document.getElementById('eventDate').value,
      location: document.getElementById('eventLocation').value,
      min: parseInt(document.getElementById('eventMin').value)
    };
    
    const maxVal = document.getElementById('eventMax').value;
    if (maxVal) {
      payload.max = parseInt(maxVal);
    }
    
    const url = isEdit ? `/api/events/${eventId}` : '/api/events';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if(res.ok) {
        window.location.href = '/panel/events';
      } else {
        const errData = await res.json();
        const errorBox = document.getElementById('errorBox');
        errorBox.textContent = errData.message || `Error ${isEdit ? 'updating' : 'creating'} event`;
        errorBox.style.display = 'block';
      }
    } catch(err) {
      console.error(err);
    }
  });
});
