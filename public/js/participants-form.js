document.addEventListener('DOMContentLoaded', async () => {
  const isEdit = document.getElementById('isEdit').value === 'true';
  let participantId = null;
  let allEvents = [];

  const hiddenIdEl = document.getElementById('partEventId');
  const searchEl = document.getElementById('eventSearch');
  const dropdownEl = document.getElementById('eventDropdown');

  function renderDropdown(filterText = '') {
    const filtered = allEvents.filter((ev) =>
      ev.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    if (filtered.length === 0) {
      dropdownEl.innerHTML =
        '<div style="padding: 8px 12px; color: var(--colors-mute);">No events found</div>';
    } else {
      dropdownEl.innerHTML = filtered
        .map(
          (ev) => `
        <div class="dropdown-item" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid var(--colors-hairline);" data-id="${ev.id}" data-name="${ev.name}">
          ${ev.name}
        </div>
      `,
        )
        .join('');

      dropdownEl.querySelectorAll('.dropdown-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          hiddenIdEl.value = e.currentTarget.getAttribute('data-id');
          searchEl.value = e.currentTarget.getAttribute('data-name');
          dropdownEl.style.display = 'none';
        });

        item.addEventListener(
          'mouseenter',
          (e) =>
            (e.currentTarget.style.backgroundColor =
              'var(--colors-surface-soft)'),
        );
        item.addEventListener(
          'mouseleave',
          (e) => (e.currentTarget.style.backgroundColor = 'transparent'),
        );
      });
    }
  }

  searchEl.addEventListener('focus', () => {
    dropdownEl.style.display = 'block';
    renderDropdown(searchEl.value);
  });

  searchEl.addEventListener('input', (e) => {
    dropdownEl.style.display = 'block';
    hiddenIdEl.value = '';
    renderDropdown(e.target.value);
  });

  document.addEventListener('click', (e) => {
    if (!searchEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.style.display = 'none';
    }
  });

  try {
    const evRes = await fetch('/api/events');
    const evData = await evRes.json();
    allEvents = evData.data || [];
    renderDropdown();
  } catch (err) {
    console.error('Error fetching events:', err);
  }

  if (isEdit) {
    const pathParts = window.location.pathname.split('/');
    participantId = pathParts[pathParts.length - 1];

    try {
      const res = await fetch(`/api/participants/${participantId}`);
      const data = await res.json();
      const p = data.data || data;

      if (p) {
        document.getElementById('partName').value = p.name;
        document.getElementById('partEmail').value = p.email;
        document.getElementById('partInstitusi').value = p.institusi;
        document.getElementById('partJurusan').value = p.jurusan;
        document.getElementById('partSemester').value = p.semester;
        hiddenIdEl.value = p.event_id;

        const event = allEvents.find((e) => e.id === p.event_id);
        if (event) {
          searchEl.value = event.name;
        } else {
          searchEl.value = `Event ID: ${p.event_id}`;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  document
    .getElementById('participantForm')
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('partName').value,
        email: document.getElementById('partEmail').value,
        institusi: document.getElementById('partInstitusi').value,
        jurusan: document.getElementById('partJurusan').value,
        semester: parseInt(document.getElementById('partSemester').value),
        event_id: parseInt(document.getElementById('partEventId').value),
      };

      const url = isEdit
        ? `/api/participants/${participantId}`
        : '/api/participants';
      const method = isEdit ? 'PATCH' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          window.location.href = '/panel/participants';
        } else {
          const errData = await res.json();
          const errorBox = document.getElementById('errorBox');
          let errorMsg = errData.message || `Error ${isEdit ? 'updating' : 'registering'} participant`;
          if (errData.errors && Array.isArray(errData.errors)) {
            errorMsg += ':<br/>' + errData.errors.map(e => `&bull; ${e.message}`).join('<br/>');
          }
          errorBox.innerHTML = errorMsg;
          errorBox.style.display = 'block';
        }
      } catch (err) {
        console.error(err);
      }
    });
});
