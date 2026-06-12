document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    const res = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if(res.ok) {
      window.location.href = '/panel';
    } else {
      const errBox = document.getElementById('errorBox');
      let errorMsg = data.message || 'Login failed';
      if (data.errors && Array.isArray(data.errors)) {
        errorMsg += ':<br/>' + data.errors.map(e => `&bull; ${e.message}`).join('<br/>');
      }
      errBox.innerHTML = errorMsg;
      errBox.style.display = 'block';
    }
  } catch(err) {
    console.error(err);
  }
});
