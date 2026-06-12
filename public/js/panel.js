document.getElementById('logoutBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/auth/sign-out');
    if(res.ok) window.location.href = '/sign-in';
  } catch(err) {
    console.error(err);
  }
});
