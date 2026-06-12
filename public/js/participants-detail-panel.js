document.addEventListener('DOMContentLoaded', async () => {
  const pathParts = window.location.pathname.split('/');
  const participantId = pathParts[pathParts.length - 1];
  const container = document.getElementById('participantDetailContent');

  try {
    const res = await fetch(`/api/participants/${participantId}`);
    const data = await res.json();
    const p = data.data || data;

    if (res.ok && p) {
      container.innerHTML = `
        <div style="margin-bottom: var(--spacing-lg);">
          <h2 class="typography-heading-md" style="margin-bottom: var(--spacing-sm);">${p.name}</h2>
          <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: var(--spacing-md);">
            <tbody>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline); width: 30%;">ID</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${p.id}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Name</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${p.name}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Email</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${p.email}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Institution</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${p.institusi}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Major</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${p.jurusan}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Semester</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${p.semester}</td></tr>
              <tr><th style="padding: 16px 0; border-bottom: 1px solid var(--colors-hairline);">Event</th><td style="padding: 16px 0; text-align: right; border-bottom: 1px solid var(--colors-hairline);">${p.events.name}</td></tr>
            </tbody>
          </table>
        </div>
        <div style="display: flex; gap: 8px; margin-top: var(--spacing-lg);">
          <a href="/panel/participants/edit/${p.id}" class="button-secondary">Update</a>
          <button class="button-danger" onclick="deleteParticipant(${p.id})">Delete</button>
        </div>
      `;
    } else {
      container.innerHTML =
        '<p class="typography-body-md" style="color: var(--colors-danger);">Participant not found.</p>';
    }
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="typography-body-md" style="color: var(--colors-danger);">Failed to load participant details.</p>';
  }
});

async function deleteParticipant(id) {
  if (!confirm('Are you sure you want to delete this participant?')) return;
  try {
    const res = await fetch(`/api/participants/${id}`, { method: 'DELETE' });
    if (res.ok) {
      window.location.href = '/panel/participants';
    } else {
      const errData = await res.json();
      const errorBox = document.getElementById('errorBox');
      if (errorBox) {
        errorBox.textContent = errData.message || 'Failed to delete participant';
        errorBox.style.display = 'block';
      }
    }
  } catch (err) {
    console.error(err);
    const errorBox = document.getElementById('errorBox');
    if (errorBox) {
      errorBox.textContent = 'Error deleting participant';
      errorBox.style.display = 'block';
    }
  }
}
