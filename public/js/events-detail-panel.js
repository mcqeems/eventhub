document.addEventListener('DOMContentLoaded', async () => {
  const pathParts = window.location.pathname.split('/');
  const eventId = pathParts[pathParts.length - 1];
  const container = document.getElementById('eventDetailContent');
  
  try {
    const res = await fetch(`/api/events/${eventId}`);
    const data = await res.json();
    const ev = data.data || data;
    
    if (res.ok && ev) {
      container.innerHTML = `
        <div style="margin-bottom: var(--spacing-lg);">
          <h2 class="typography-heading-md" style="margin-bottom: var(--spacing-sm);">${ev.name}</h2>
          <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: var(--spacing-md);">
            <tbody>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline); width: 30%;">ID</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${ev.id}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Name</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${ev.name}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Date</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${new Date(ev.date).toLocaleDateString()}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Location</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${ev.location}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Max Participants</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${ev.max || 'N/A'}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Min Participants</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${ev.min}</td></tr>
            </tbody>
          </table>
        </div>
        <div style="display: flex; gap: 8px; margin-top: var(--spacing-lg);">
          <a href="/panel/events/edit/${ev.id}" class="button-secondary">Update</a>
          <button class="button-danger" onclick="deleteEvent(${ev.id})">Delete</button>
        </div>
      `;
    } else {
      container.innerHTML = '<p class="typography-body-md" style="color: var(--colors-danger);">Event not found.</p>';
    }
  } catch(err) {
    console.error(err);
    container.innerHTML = '<p class="typography-body-md" style="color: var(--colors-danger);">Failed to load event details.</p>';
  }
});

async function deleteEvent(id) {
  if(!confirm('Are you sure you want to delete this event?')) return;
  try {
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if(res.ok) {
      window.location.href = '/panel/events';
    } else {
      alert('Failed to delete event');
    }
  } catch (err) {
    console.error(err);
    alert('Error deleting event');
  }
}
