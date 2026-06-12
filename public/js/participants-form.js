document.addEventListener('DOMContentLoaded', async () => {
  const isEdit = document.getElementById('isEdit').value === 'true';
  let participantId = null;

  if (isEdit) {
    const pathParts = window.location.pathname.split('/');
    participantId = pathParts[pathParts.length - 1];
    
    // Fetch and populate
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
        document.getElementById('partEventId').value = p.event_id;
      }
    } catch(err) {
      console.error(err);
    }
  }

  document.getElementById('participantForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('partName').value,
      email: document.getElementById('partEmail').value,
      institusi: document.getElementById('partInstitusi').value,
      jurusan: document.getElementById('partJurusan').value,
      semester: parseInt(document.getElementById('partSemester').value),
      event_id: parseInt(document.getElementById('partEventId').value)
    };
    
    const url = isEdit ? `/api/participants/${participantId}` : '/api/participants';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if(res.ok) {
        window.location.href = '/panel/participants';
      } else {
        const errData = await res.json();
        const errorBox = document.getElementById('errorBox');
        errorBox.textContent = errData.message || `Error ${isEdit ? 'updating' : 'registering'} participant`;
        errorBox.style.display = 'block';
      }
    } catch(err) {
      console.error(err);
    }
  });
});
