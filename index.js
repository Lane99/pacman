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
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = 18;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
  }

  updateSpeed() {
    if (lastKey == 'w') {
      this.vy = -5;
      if (!isGoingToCollide(this, wall)) this.vx = 0;
      else this.vy = 0;
    } else if (lastKey == 'a') {
      this.vx = -5;
      if (!isGoingToCollide(this, wall)) this.vy = 0;
      else this.vx = 0;
    } else if (lastKey == 's') {
      this.vy = 5;
      if (!isGoingToCollide(this, wall)) this.vx = 0;
      else this.vy = 0;
    } else if (lastKey == 'd') {
      this.vx = 5;
      if (!isGoingToCollide(this, wall)) this.vy = 0;
      else this.vx = 0;
    }
  }

  updatePosition() {
    this.x += this.vx;
    this.y += this.vy;
  }
}

let pacman = new Pacman(1.5 * Brick.width, 1.5 * Brick.height, 0, 0);

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
  requestAnimationFrame(animate);
}

animate();

function isGoingToCollide(pacman, wall) {
  /*
    dva pravougaonika se preklapaju onda i samo onda ako se sve njihove senke preklapaju
    ovo je SAT teorema primenjena na kvadrate
  */
  return wall.some(
    (brick) =>
      pacman.y - pacman.r + pacman.vy <= brick.y + Brick.height &&
      pacman.x + pacman.r + pacman.vx >= brick.x &&
      pacman.y + pacman.r + pacman.vy >= brick.y &&
      pacman.x - pacman.r + pacman.vx <= brick.x + Brick.width
  );
}
