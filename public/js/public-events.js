async function loadPublicEvents() {
  try {
    const res = await fetch('/api/events');
    const data = await res.json();
    const list = document.getElementById('publicEventsList');
    list.innerHTML = '';
    
    if (data.data && data.data.length > 0) {
      data.data.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'list-row';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.padding = 'var(--spacing-lg)';
        card.style.marginBottom = 'var(--spacing-md)';
        card.style.border = '1px solid var(--colors-hairline)';
        card.style.borderRadius = 'var(--rounded-sm)';
        
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 class="typography-heading-md">${ev.name}</h3>
              <p class="typography-body-md" style="color: var(--colors-mute); margin-top: var(--spacing-xs);">
                Date: ${new Date(ev.date).toLocaleDateString()} | Location: ${ev.location}
              </p>
            </div>
            <a href="/events/${ev.id}" class="button-primary">View Details</a>
          </div>
        `;
        list.appendChild(card);
      });
    } else {
      list.innerHTML = '<p class="typography-body-md" style="color: var(--colors-mute);">No upcoming events available.</p>';
    }
  } catch(err) {
    console.error(err);
    document.getElementById('publicEventsList').innerHTML = '<p class="typography-body-md" style="color: var(--colors-danger);">Failed to load events.</p>';
  }
}

loadPublicEvents();
