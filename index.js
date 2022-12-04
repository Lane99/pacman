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
  static r = 19;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Pacman.r, 0, 2 * Math.PI);
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
  //console.log(possibleMoves(pacman, world));
  if (lastKey == 'd' && possibleMoves(pacman, world).d) pacman.x += Pacman.v;
  else if (lastKey == 'a' && possibleMoves(pacman, world).a)
    pacman.x -= Pacman.v;
  else if (lastKey == 's' && possibleMoves(pacman, world).s)
    pacman.y += Pacman.v;
  else if (lastKey == 'w' && possibleMoves(pacman, world).w)
    pacman.y -= Pacman.v;

  requestAnimationFrame(animate);
}

animate();

function possibleMoves(pacman, world) {
  let moves = {
    w: true,
    a: true,
    s: true,
    d: true,
  };

  pacman.x += Pacman.v;
  if (getCollidingBricks(pacman, world)) {
    moves.d = false;
  }
  pacman.x -= Pacman.v;

  pacman.x -= Pacman.v;
  if (getCollidingBricks(pacman, world)) {
    moves.a = false;
  }
  pacman.x += Pacman.v;

  pacman.y += Pacman.v;
  if (getCollidingBricks(pacman, world)) {
    moves.s = false;
  }
  pacman.y -= Pacman.v;

  pacman.y -= Pacman.v;
  if (getCollidingBricks(pacman, world)) {
    moves.w = false;
  }
  pacman.y += Pacman.v;

  // world.forEach((tile, index) => {
  //   if (isColliding(pacman, tile)) collidingTilesInd.push(index);
  // });
  // if (
  //   collidingTilesInd.map((ind) => world[ind]).some((el) => el.type == 'brick')
  // )
  //   moves.d = false;
  return moves;
}

function getCollidingBricks(pacman, world) {
  return world.find(
    (tile) => tile.type == 'brick' && isColliding(pacman, tile)
  );
}

function isColliding(pacman, tile) {
  /*
    dva pravougaonika se preklapaju onda i samo onda ako se sve njihove senke preklapaju
    ovo je SAT teorema primenjena na kvadrate
  */
  return (
    pacman.y - Pacman.r <= tile.y + Tile.height &&
    pacman.x + Pacman.r >= tile.x &&
    pacman.y + Pacman.r >= tile.y &&
    pacman.x - Pacman.r <= tile.x + Tile.width
  );
}
