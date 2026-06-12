document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [eventsRes, partsRes] = await Promise.all([
      fetch('/api/events'),
      fetch('/api/participants'),
    ]);

    const eventsData = await eventsRes.json();
    const partsData = await partsRes.json();

    const events = eventsData.data || [];
    const participants = partsData.data || [];

    document.getElementById('stat-total-events').textContent = events.length;
    document.getElementById('stat-total-participants').textContent =
      participants.length;

    const eventCounts = {};
    events.forEach((ev) => {
      eventCounts[ev.name] = 0;
    });
    participants.forEach((p) => {
      const event = events.find((e) => String(e.id) === String(p.event_id));
      if (event) {
        eventCounts[event.name]++;
      }
    });

    const chartLabels = Object.keys(eventCounts);
    const chartData = Object.values(eventCounts);

    const pieColors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#E7E9ED',
      '#8A2BE2',
      '#00FA9A',
      '#DC143C',
    ];

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartData,
            backgroundColor: pieColors.slice(0, chartLabels.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });

    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Total Events', 'Total Participants'],
        datasets: [
          {
            label: 'Count',
            data: [events.length, participants.length],
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });

    const sortedEvents = [...events].sort((a, b) => b.id - a.id).slice(0, 5);
    const recentEventsList = document.getElementById('recent-events-list');
    if (sortedEvents.length > 0) {
      recentEventsList.innerHTML = sortedEvents
        .map(
          (ev) => `
        <div style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--colors-hairline);">
          <strong style="display: block;">${ev.name}</strong>
          <span class="typography-body-md" style="color: var(--colors-mute);">${new Date(ev.date).toLocaleDateString()} &mdash; ${ev.location}</span>
        </div>
      `,
        )
        .join('');
    } else {
      recentEventsList.innerHTML =
        '<p class="typography-body-md" style="color: var(--colors-mute);">No events yet.</p>';
    }

    const sortedParts = [...participants]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
    const recentPartsList = document.getElementById('recent-participants-list');
    if (sortedParts.length > 0) {
      recentPartsList.innerHTML = sortedParts
        .map((p) => {
          const ev = events.find((e) => e.id === p.events.name);
          const evName = ev ? ev.name : `Event: ${p.events.name}`;
          return `
        <div style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--colors-hairline);">
          <strong style="display: block;">${p.name}</strong>
          <span class="typography-body-md" style="color: var(--colors-mute);">${evName} &mdash; ${p.institusi}</span>
        </div>
      `;
        })
        .join('');
    } else {
      recentPartsList.innerHTML =
        '<p class="typography-body-md" style="color: var(--colors-mute);">No participants yet.</p>';
    }
  } catch (err) {
    console.error('Error loading dashboard data:', err);
    document.getElementById('stat-total-events').textContent = 'Error';
    document.getElementById('stat-total-participants').textContent = 'Error';
  }
});
