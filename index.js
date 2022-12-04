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
  if (lastKey == 'd' && possibleMoves(pacman).d) pacman.x += Pacman.v;
  if (!possibleMoves(pacman).d) pacman.x -= Pacman.v;
  requestAnimationFrame(animate);
}

animate();

function possibleMoves(pacman) {
  let moves = {
    w: true,
    a: true,
    s: true,
    d: true,
  };
  let collidingTilesInd = [];
  world.forEach((tile, index) => {
    if (isColliding(pacman, tile)) collidingTilesInd.push(index);
  });
  if (
    collidingTilesInd.map((ind) => world[ind]).some((el) => el.type == 'brick')
  )
    moves.d = false;
  return moves;
}

function isColliding(pacman, tile) {
  /*
    dva pravougaonika se preklapaju onda i samo onda ako se sve njihove senke preklapaju
    ovo je SAT teorema primenjena na kvadrate
  */
  return (
    pacman.y - pacman.r <= tile.y + Tile.height &&
    pacman.x + pacman.r >= tile.x &&
    pacman.y + pacman.r >= tile.y &&
    pacman.x - pacman.r <= tile.x + Tile.width
  );
}
