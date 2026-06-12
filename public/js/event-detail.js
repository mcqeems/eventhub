async function loadEventDetail() {
  // Extract ID from the URL path: /events/:id
  const pathParts = window.location.pathname.split('/');
  const eventId = pathParts[pathParts.length - 1];
  const container = document.getElementById('eventDetailContainer');

  try {
    const res = await fetch(`/api/events/${eventId}`);
    const ev = await res.json();

    if (res.ok && ev) {
      const eventData = ev.data || ev;

      container.innerHTML = `
        <h1 class="typography-display-xl" style="margin-bottom: var(--spacing-sm);">${eventData.name}</h1>
        <div style="margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-md); border-bottom: 1px solid var(--colors-hairline);">
          <p class="typography-body-md" style="margin-bottom: var(--spacing-xs);"><strong>Date:</strong> ${new Date(eventData.date).toLocaleDateString()}</p>
          <p class="typography-body-md" style="margin-bottom: var(--spacing-xs);"><strong>Location:</strong> ${eventData.location}</p>
          ${eventData.max ? `<p class="typography-body-md" style="margin-bottom: var(--spacing-xs);"><strong>Capacity:</strong> ${eventData.max} max participants</p>` : ''}
        </div>
        
        <div class="section">
          <h2 class="typography-heading-md" style="margin-bottom: var(--spacing-sm);">Ready to Join?</h2>
          <button id="showApplyBtn" class="button-primary" onclick="document.getElementById('applyFormContainer').style.display='block'; this.style.display='none';">Apply for Participation</button>
          
          <div id="applyFormContainer" style="display: none; max-width: 400px; margin-top: var(--spacing-md); padding: var(--spacing-lg); background-color: var(--colors-surface-soft); border-radius: var(--rounded-sm); border: 1px solid var(--colors-hairline);">
            <form id="applyForm">
              <div class="form-group">
                <label>Your Name</label>
                <input type="text" id="partName" class="text-input" required />
              </div>
              <div class="form-group" style="margin-bottom: 8px;">
                <label>Your Email</label>
                <input type="email" id="partEmail" class="text-input" required />
              </div>
              <div class="form-group" style="margin-bottom: 8px;">
                <label>Institution</label>
                <input type="text" id="partInstitusi" class="text-input" required />
              </div>
              <div class="form-group" style="margin-bottom: 8px;">
                <label>Major</label>
                <input type="text" id="partJurusan" class="text-input" required />
              </div>
              <div class="form-group" style="margin-bottom: 16px;">
                <label>Semester</label>
                <input type="number" id="partSemester" min="1" class="text-input" required />
              </div>
              <div id="formMsgBox" class="message-box" style="display:none;"></div>
              <button type="submit" class="button-primary">Submit Application</button>
              <button type="button" class="button-tab" onclick="document.getElementById('applyFormContainer').style.display='none'; document.getElementById('showApplyBtn').style.display='inline-block';">Cancel</button>
            </form>
          </div>
        </div>
      `;

      document
        .getElementById('applyForm')
        .addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('partName').value;
          const email = document.getElementById('partEmail').value;
          const institusi = document.getElementById('partInstitusi').value;
          const jurusan = document.getElementById('partJurusan').value;
          const semester = parseInt(
            document.getElementById('partSemester').value,
          );
          const msgBox = document.getElementById('formMsgBox');

          try {
            const partRes = await fetch('/api/participants', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name,
                email,
                institusi,
                jurusan,
                semester,
                event_id: parseInt(eventId),
              }),
            });

            if (partRes.ok) {
              msgBox.className = 'message-box message-success';
              msgBox.textContent =
                'You have successfully applied for participation!';
              msgBox.style.display = 'block';
              e.target.reset();
            } else {
              const errData = await partRes.json();
              msgBox.className = 'message-box message-error';
              msgBox.textContent =
                errData.message || 'Error applying for event.';
              msgBox.style.display = 'block';
            }
          } catch (err) {
            msgBox.className = 'message-box message-error';
            msgBox.textContent = 'Network error. Please try again.';
            msgBox.style.display = 'block';
          }
        });
    } else {
      container.innerHTML =
        '<p class="typography-body-md" style="color: var(--colors-danger);">Event not found.</p>';
    }
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="typography-body-md" style="color: var(--colors-danger);">Failed to load event details.</p>';
  }
}

loadEventDetail();
