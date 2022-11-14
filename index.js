const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');

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
    this.r = 15;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.x += this.vx;
    this.y += this.vy;
  }
}

let pacman = new Pacman(1.5 * Brick.width, 1.5 * Brick.height, 0, 0);

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1],
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
  wall.forEach((brick) => {
    brick.draw();
    // sat theorem or some other crazy shit
    /*
    if (!(
      pacman.y - pacman.r > brick.y + Brick.height ||
      pacman.x + pacman.r < brick.x ||
      pacman.y + pacman.r < brick.y ||
      pacman.x - pacman.r > brick.x + Brick.width
    ))
      ako se bar na jednoj osi projekcije (senke) ne preklapaju i onda se dobije ovo njegovo ispod
    */
    if (
      pacman.y - pacman.r + pacman.vy <= brick.y + Brick.height &&
      pacman.x + pacman.r + pacman.vx >= brick.x &&
      pacman.y + pacman.r + pacman.vy >= brick.y &&
      pacman.x - pacman.r + pacman.vx <= brick.x + Brick.width
    ) {
      pacman.vx = 0;
      pacman.vy = 0;
    }
  });
  pacman.update();
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      pacman.vx = 0;
      pacman.vy = -5;
      break;
    case 'a':
      pacman.vy = 0;
      pacman.vx = -5;
      break;
    case 's':
      pacman.vx = 0;
      pacman.vy = 5;
      break;
    case 'd':
      pacman.vy = 0;
      pacman.vx = 5;
      break;
  }
});
