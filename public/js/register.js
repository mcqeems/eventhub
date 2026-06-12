document
  .getElementById('registerForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const secretKey = document.getElementById('secretKey').value;

    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, secretKey }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/sign-in';
      } else {
        const errBox = document.getElementById('errorBox');
        let errorMsg = data.message || 'Registration failed';
        if (data.errors && Array.isArray(data.errors)) {
          errorMsg += ':<br/>' + data.errors.map(e => `&bull; ${e.message}`).join('<br/>');
        }
        errBox.innerHTML = errorMsg;
        errBox.style.display = 'block';
      }
    } catch (err) {
      console.error(err);
    }
  });
