const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');

let lastKey = '';
window.addEventListener('keydown', (e) => (lastKey = e.key));

class Tile {
  static width = 40;
  static height = 40;

  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  draw() {
    if (this.type == 'brick') ctx.fillStyle = 'blue';
    else if (this.type == 'empty') ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, Tile.width, Tile.height);
  }
}

class Pacman {
  static v = 5;
  static r = 15;

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
}

let pacman = new Pacman(1.5 * Tile.width, 1.5 * Tile.height);

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

let world = [];

map.forEach((row, i) => {
  row.forEach((el, j) => {
    if (el) world.push(new Tile(j * Tile.width, i * Tile.height, 'brick'));
    else world.push(new Tile(j * Tile.width, i * Tile.height, 'empty'));
  });
});

function animate() {
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.forEach((tile) => tile.draw());
  pacman.draw();
  if (nextTileType(pacman.x, pacman.y, lastKey) == 'empty') {
    console.log('prazno');
  } else console.log('puno');

  //requestAnimationFrame(animate);
  //setInterval(animate, 1000);
}

animate();

function nextTileType(x, y, direction) {
  world.forEach((tile) =>
    console.log(
      tile.x,
      Math.min(...world.map((tile) => Math.abs(x + Pacman.r - tile.x)))
    )
  );
}

function collisionDirection(pacman, world) {
  /*
    dva pravougaonika se preklapaju onda i samo onda ako se sve njihove senke preklapaju
    ovo je SAT teorema primenjena na kvadrate
  */
  if (
    world.some(
      (brick) =>
        pacman.y - pacman.r <= brick.y + Tile.height &&
        pacman.x + pacman.r >= brick.x &&
        pacman.y + pacman.r >= brick.y &&
        pacman.x - pacman.r <= brick.x + Tile.width
    )
  ) {
    if (pacman.vx) return 'horizontal';
    else if (pacman.vy) return 'vertical';
  }
  return 'none';
}
