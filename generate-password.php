<?php

declare(strict_types=1);

$hash = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $password = $_POST['password'] ?? '';
  if ($password === '') {
    $error = 'Please enter a password.';
  } else {
    $hash = hash('sha256', $password);
  }
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generate Admin Password Hash</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 2rem;
        background: #f7f4ef;
        color: #1c1c1f;
      }

      form {
        display: grid;
        gap: 1rem;
        max-width: 420px;
      }

      input {
        padding: 0.6rem 0.8rem;
        border-radius: 8px;
        border: 1px solid #ccc;
      }

      button {
        padding: 0.6rem 1rem;
        border: none;
        border-radius: 999px;
        background: #0b6b5b;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }

      code {
        display: block;
        background: white;
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid #ddd;
      }

      .error {
        color: #b42318;
      }
    </style>
  </head>
  <body>
    <h1>Generate Admin Hash</h1>
    <p>Use this tool on a secure environment only.</p>
    <form method="post">
      <label>
        Password
        <input type="password" name="password" required />
      </label>
      <button type="submit">Generate SHA-256</button>
    </form>

    <?php if ($error !== ''): ?>
      <p class="error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>

    <?php if ($hash !== ''): ?>
      <h2>Hash</h2>
      <code><?php echo htmlspecialchars($hash, ENT_QUOTES, 'UTF-8'); ?></code>
    <?php endif; ?>
  </body>
</html>
