$(function () {
  const $player = $('#player');
  const $barrel = $('.barrel');
  const shootSound = document.getElementById("shootSound");
  const $score = $('#score');

  let playerX = 200;
  let playerY = 200;
  const playerSpeed = 5;
  const keys = {};
  let score = 0;
  
  $('#startBtn').on('click', function () {
  $('#landingPage').hide();
  $('#gameContainer').show();
});

  // Track key state
  $(window).on('keydown', (e) => keys[e.key.toLowerCase()] = true);
  $(window).on('keyup', (e) => keys[e.key.toLowerCase()] = false);

  // Move player based on key state
  function updatePlayerPosition() {
    if (keys['arrowup'] || keys['w']) playerY -= playerSpeed;
    if (keys['arrowdown'] || keys['s']) playerY += playerSpeed;
    if (keys['arrowleft'] || keys['a']) playerX -= playerSpeed;
    if (keys['arrowright'] || keys['d']) playerX += playerSpeed;

    $player.css({ left: playerX, top: playerY });

    requestAnimationFrame(updatePlayerPosition);
  }
  updatePlayerPosition();

  // Rotate the barrel toward the mouse
  $(window).on('mousemove', function (e) {
    const centerX = playerX + 15;
    const centerY = playerY + 15;

    const dx = e.pageX - centerX;
    const dy = e.pageY - centerY;
    const angle = Math.atan2(dy, dx);
    const degrees = angle * (180 / Math.PI);

    $barrel.css('transform', `rotate(${degrees}deg)`);
  });

  // Shoot on mouse click
 $(window).on('mousedown', function (e) {
  const centerX = playerX + 15;
  const centerY = playerY + 15;
  const dx = e.pageX - centerX;
  const dy = e.pageY - centerY;
  const angle = Math.atan2(dy, dx);

  shootSound.currentTime = 0;
  shootSound.play();

  // Calculate smoke position offset
  const smokeX = centerX + Math.cos(angle) * 20;
  const smokeY = centerY + Math.sin(angle) * 20;

  createBullet(centerX, centerY, angle);
  createSmoke(smokeX, smokeY);
});


  // Create a bullet
  function createBullet(x, y, angle) {
    const $bullet = $('<div class="bullet"></div>');
    $bullet.css({ left: x, top: y });
    $('body').append($bullet);

    const bulletSpeed = 10;
    const vx = Math.cos(angle) * bulletSpeed;
    const vy = Math.sin(angle) * bulletSpeed;

    const interval = setInterval(() => {
      x += vx;
      y += vy;
      $bullet.css({ left: x, top: y });

      // Remove if out of bounds
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
        $bullet.remove();
        clearInterval(interval);
      }

      // Check collision with enemies
      $('.enemy').each(function () {
        const ex = $(this).offset().left;
        const ey = $(this).offset().top;
        if (Math.abs(ex - x) < 20 && Math.abs(ey - y) < 20) {
          $(this).remove();
          $bullet.remove();
          clearInterval(interval);
          score++;
          updateScore();
        }
      });
    }, 16);
  }

  // Create smoke when shooting
  function createSmoke(x, y) {
    const $smoke = $('<div class="smoke"></div>');
    $smoke.css({ left: x, top: y });
    $('body').append($smoke);
    setTimeout(() => $smoke.remove(), 500);
  }

  // Spawn enemy
  function spawnEnemy() {
    const $enemy = $('<div class="enemy"></div>');
    const x = Math.random() * (window.innerWidth - 40);
    const y = Math.random() * (window.innerHeight - 40);
    $enemy.css({ left: x, top: y });
    $('body').append($enemy);
  }

  // Update score UI
  function updateScore() {
    $score.text("Score: " + score);
  }

  // Repeat enemy spawn
  setInterval(spawnEnemy, 2000);
});
