$(document).ready(() => {
  const mat = [];
  const rows = 19;
  const cols = 30;
  (function createMatrix() {
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(0);
      }
      mat.push(row);
    }
    return mat;
  }());

  function randomNumBord(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function randomNum(num) {
    return Math.floor(Math.random() * (num));
  }

  function fillMatrixRooms(matrix, colPos, rowPos) {
    const width = randomNumBord(8, 3);
    const height = randomNumBord(8, 3);
    for (let i = rowPos; i < rowPos + width; i++) {
      for (let j = colPos; j < colPos + height; j++) {
        if (i < rows && j < cols) {
          matrix[i][j] = 1;
        }
      }
    }
  }

  // координаты комнат
  const roomsNum = Math.floor(Math.random() * (10 - 5) + 5);
  for (let i = 0; i <= roomsNum; i++) {
    const x = randomNum(cols - 1); // по горизонтали
    const y = randomNum(rows - 1); // по вертикали

    fillMatrixRooms(mat, x, y);
  }

  function fillCorridors(matrix, colPositions, rowPositions) {
    for (let i = 0; i < colPositions.length; i++) {
      for (let j = 0; j < rows; j++) {
        matrix[j][colPositions[i]] = 1;
      }
    }
    for (let i = 0; i < rowPositions.length; i++) {
      for (let j = 0; j < cols; j++) {
        matrix[rowPositions[i]][j] = 1;
      }
    }
  }

  // координаты коридоров
  function getCorrCoordinates() {
    const coordinatesX = [];// начала справа
    const coordinatesY = [];// начала сверху
    const corNumX = randomNumBord(5, 3);
    const corNumY = randomNumBord(5, 3);
    for (let i = 0; i <= corNumX; i++) {
      const coordinateY = Math.floor(Math.random() * (cols - 1));
      coordinatesY.push(coordinateY);
    }
    for (let i = 0; i <= corNumY; i++) {
      const coordinateX = Math.floor(Math.random() * (rows - 1));
      coordinatesX.push(coordinateX);
    }
    fillCorridors(mat, coordinatesY, coordinatesX);
  }
  getCorrCoordinates();

  // заполнение персонажей и инвентаря

  const characters = {
    HP: 10,
    SW: 2,
    Player: 1,
    Enemy: 10,
  };

  const enemyCoordinates = [];
  const posP = {};

  function fillCharacters(num, code) {
    while (num > 0) {
      const coordinateX = randomNum(cols);
      const coordinateY = randomNum(rows);
      if (mat[coordinateY][coordinateX] === 1) {
        mat[coordinateY][coordinateX] = code;
        num--;
        if (code === 6 || code === 7) {
          enemyCoordinates.push({ x: coordinateX, y: coordinateY });
        } else if (code === 5) {
          posP.x = coordinateX; // по горизонтали
          posP.y = coordinateY; // по вертикали
        }
      } else continue;
    }
  }

  fillCharacters(characters.HP, 3);
  fillCharacters(characters.SW, 4);
  fillCharacters(characters.Player, 5);
  fillCharacters(characters.Enemy, 6);

  // движение врагов

  function moveEnemies(posE) {
    for (let i = 0; i < posE.length; i++) {
      const direction = randomNum(4);
      if (direction === 0 && posE[i].x < cols
      && (mat[posE[i].y][posE[i].x + 1] === 1)) {
        if (mat[posE[i].y][posE[i].x] === 6) {
          mat[posE[i].y][posE[i].x] = 1;
          posE[i].x++;
          mat[posE[i].y][posE[i].x] = 6;
        } else if (mat[posE[i].y][posE[i].x] === 7) {
          mat[posE[i].y][posE[i].x] = 1;
          posE[i].x++;
          mat[posE[i].y][posE[i].x] = 7;
        }
      } else if (direction === 1 && posE[i].x > 0
      && (mat[posE[i].y][posE[i].x - 1] === 1)) {
        if (mat[posE[i].y][posE[i].x] === 6) {
          mat[posE[i].y][posE[i].x] = 1;
          posE[i].x--;
          mat[posE[i].y][posE[i].x] = 6;
        } else if (mat[posE[i].y][posE[i].x] === 7) {
          mat[posE[i].y][posE[i].x] = 1;
          posE[i].x--;
          mat[posE[i].y][posE[i].x] = 7;
        }
      } else if (direction === 2 && posE[i].y - 1 > 0
      && (mat[posE[i].y - 1][posE[i].x] === 1)) {
        if (mat[posE[i].y][posE[i].x] === 6) {
          mat[posE[i].y][posE[i].x] = 1;
          posE[i].y--;
          mat[posE[i].y][posE[i].x] = 6;
        } else if (mat[posE[i].y][posE[i].x] === 7) {
          mat[posE[i].y][posE[i].x] = 1;
          posE[i].y--;
          mat[posE[i].y][posE[i].x] = 7;
        }
      } else if (direction === 3 && posE[i].y + 1 < rows
      && (mat[posE[i].y + 1][posE[i].x] === 1)) {
        if (mat[posE[i].y][posE[i].x] === 6) {
          mat[posE[i].y][posE[i].x] = 1;
          posE[i].y++;
          mat[posE[i].y][posE[i].x] = 6;
        } else if (mat[posE[i].y][posE[i].x] === 7) {
          mat[posE[i].y][posE[i].x] = 1;
          posE[i].y++;
          mat[posE[i].y][posE[i].x] = 7;
        }
      }
    }
  } // (извините)

  // урон и ульта героя

  let playerHP = 100;
  let playerSW = false;

  function damagePlayer(y, x) {
    const directions = [
      { y: y + 1, x },
      { y: y - 1, x },
      { y, x: x + 1 },
      { y, x: x - 1 },
    ];
    directions.forEach((dir) => {
      if (dir.y >= 0 && dir.y < 19 && (mat[dir.y][dir.x] === 6 || mat[dir.y][dir.x] === 7)) {
        playerHP -= 25;
      }
    });
  }

  function fillGame() {
    const table = document.createDocumentFragment();
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        const health = document.createElement('div');
        health.classList.add('health');
        const healthpart = document.createElement('div');
        healthpart.classList.add('healthpart');
        switch (mat[i][j]) {
          case (1):
            td.classList.add('tile');
            break;
          case (3):
            td.classList.add('tileHP');
            break;
          case (4):
            td.classList.add('tileSW');
            break;
          case (5):
            td.classList.add('tileP');
            health.style.width = `${playerHP}%`;
            td.appendChild(health);
            break;
          case (6):
            td.classList.add('tileE');
            td.appendChild(health);
            break;
          case (7):
            td.classList.add('tileE');
            healthpart.style.width = '50%';
            td.appendChild(healthpart);
            break;
          default:
            td.classList.add('tileW');
            break;
        }
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    document.getElementById('matrix').appendChild(table);
  }
  fillGame();

  function attackEnemy(y, x) {
    const enemyPos = [
      [y - 1, x],
      [y + 1, x],
      [y, x - 1],
      [y, x + 1],
    ];

    enemyPos.forEach(([yPos, xPos]) => {
      const tileValue = mat[yPos][xPos];

      if (tileValue === 7) {
        mat[yPos][xPos] = 1;
        characters.Enemy--;
      } else if (tileValue === 6) {
        if (playerSW) {
          mat[yPos][xPos] = 1;
          characters.Enemy--;
        } else mat[yPos][xPos] = 7;
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    const pos = {
      right: mat[posP.y][posP.x + 1],
      left: mat[posP.y][posP.x - 1],
    };

    if (e.code === 'ArrowRight' && posP.x < cols - 1
    && pos.right !== 0 && pos.right !== 6 && pos.right !== 7) {
      if (pos.right === 3) {
        playerHP = 100;
      } else if (pos.right === 4) {
        playerSW = true;
      }
      mat[posP.y][posP.x] = 1;
      posP.x++;
      mat[posP.y][posP.x] = 5;
    } else if (e.code === 'ArrowLeft' && posP.x > 0
    && pos.left !== 0 && pos.left !== 6 && pos.left !== 7) {
      if (pos.left === 3) {
        playerHP = 100;
      } else if (pos.left === 4) {
        playerSW = true;
      }
      mat[posP.y][posP.x] = 1;
      posP.x--;
      mat[posP.y][posP.x] = 5;
    } else if (e.code === 'ArrowUp' && posP.y > 0) {
      pos.up = mat[posP.y - 1][posP.x];
      if (pos.up !== 0 && pos.up !== 6 && pos.up !== 7) {
        if (pos.up === 3) {
          playerHP = 100;
        } else if (pos.up === 4) {
          playerSW = true;
        }
        mat[posP.y][posP.x] = 1;
        posP.y--;
        mat[posP.y][posP.x] = 5;
      }
    } else if (e.code === 'ArrowDown' && posP.y < rows - 1) {
      pos.down = mat[posP.y + 1][posP.x];
      if (pos.down !== 0 && pos.down !== 6 && pos.down !== 7) {
        if (pos.down === 3) {
          playerHP = 100;
        } else if (pos.down === 4) {
          playerSW = true;
        }
        mat[posP.y][posP.x] = 1;
        posP.y++;
        mat[posP.y][posP.x] = 5;
      }
    }

    if (e.code === 'Space') {
      attackEnemy(posP.y, posP.x);
      document.getElementById('matrix').innerHTML = '';
      playerSW = false;
      fillGame();
    }

    moveEnemies(enemyCoordinates);
    document.getElementById('matrix').innerHTML = '';
    damagePlayer(posP.y, posP.x);
    fillGame();

    if (playerHP === 0) {
      const doc = document.getElementById('matrix');
      doc.innerHTML = '';
      const lose = document.createElement('div');
      lose.innerHTML = 'YOU DIED!';
      lose.classList.add('lose');
      doc.appendChild(lose);
    }

    if (characters.Enemy === 0) {
      const doc = document.getElementById('matrix');
      doc.innerHTML = '';
      const win = document.createElement('div');
      win.innerHTML = 'YOU WON!';
      win.classList.add('win');
      doc.appendChild(win);
    }
  });
});
