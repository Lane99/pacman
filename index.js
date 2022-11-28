const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');

let lastKey = '';
window.addEventListener('keydown', (e) => (lastKey = e.key));

class Brick {
  static width = 40;
  static height = 40;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, Brick.width, Brick.height);
  }
}

class Pacman {
  static v = 5;

  vx = 0;
  vy = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 15;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
  }

  updateSpeed() {
    if (lastKey == 'w') this.vy = -Pacman.v;
    else if (lastKey == 'a') this.vx = -Pacman.v;
    else if (lastKey == 's') this.vy = Pacman.v;
    else if (lastKey == 'd') this.vx = Pacman.v;
  }

  updatePosition() {
    this.x += this.vx;
    this.y += this.vy;
  }
}

let pacman = new Pacman(1.5 * Brick.width, 1.5 * Brick.height);

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

let wall = [];

map.forEach((row, i) => {
  row.forEach((el, j) => {
    if (el) wall.push(new Brick(j * Brick.width, i * Brick.height));
  });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  wall.forEach((brick) => brick.draw());
  pacman.draw();
  pacman.updateSpeed();
  pacman.updatePosition();
  if (collisionDirection(pacman, wall) == 'horizontal') {
    if (lastKey == 'a' || lastKey == 'd') {
      lastKey = '';
      pacman.x -= pacman.vx;
      pacman.vx = 0;
    }
  } else if (collisionDirection(pacman, wall) == 'vertical') {
    if (lastKey == 'w' || lastKey == 's') {
      lastKey = '';
      pacman.y -= pacman.vy;
      pacman.vy = 0;
    }
  } else {
    if 
  }

  requestAnimationFrame(animate);
  //setInterval(animate, 1000);
}

animate();

function collisionDirection(pacman, wall) {
  /*
    dva pravougaonika se preklapaju onda i samo onda ako se sve njihove senke preklapaju
    ovo je SAT teorema primenjena na kvadrate
  */
  if (
    wall.some(
      (brick) =>
        pacman.y - pacman.r <= brick.y + Brick.height &&
        pacman.x + pacman.r >= brick.x &&
        pacman.y + pacman.r >= brick.y &&
        pacman.x - pacman.r <= brick.x + Brick.width
    )
  ) {
    if (pacman.vx) return 'horizontal';
    else if (pacman.vy) return 'vertical';
  }
  return 'none';
}
