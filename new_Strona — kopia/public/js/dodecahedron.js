// import vertexShaderSource from './shaders/vertex.glsl'
// import fragmentShaderSource from './shaders/fragment.glsl'

// 'use strict'

const vertexShaderSource = `
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

attribute vec3 aPosition;
attribute vec2 aCoords;

varying vec2 vCoords;

void main()
{ 
    vec4 position = vec4(aPosition, 1.0);
    gl_Position = projectionMatrix * viewMatrix * position;

    vCoords = aCoords;
}
`;

const fragmentShaderSource = `
precision highp float;

varying vec2 vCoords;

uniform sampler2D uSampler;

void main()
{
    gl_FragColor = texture2D(uSampler, vCoords);
}
`;

function initShaders() {
  //Tworzenie shaderow
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  //tworzenie programu
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
}

function initBuffers() {
  function createDodecahedron() {
    const t = (1 + Math.sqrt(5)) / 2;
    const d = t - 1;

    console.log(`a = ${2 * d}`);

    let vertexPosition = [
      1,
      1,
      1,
      1,
      1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      t,
      0,
      d,
      t,
      0,
      -d,
      -t,
      0,
      d,
      -t,
      0,
      -d,
      d,
      t,
      0,
      d,
      -t,
      0,
      -d,
      t,
      0,
      -d,
      -t,
      0,
      0,
      d,
      t,
      0,
      -d,
      t,
      0,
      d,
      -t,
      0,
      -d,
      -t,
      -t,
      0,
      0,

      -d,
      -t,
      -0.000001,
      -d,
      t,
      -0.000001,
      -d,
      t,
      -0.0000001,

      -d,
      -t + 0.00001,
      0.00001,
      -d,
      -t + 0.00001,
      -0.00001,
      -d,
      t + 0.00001,
      0.00001,
      -d,
      t + 0.00001,
      -0.00001,
      d,
      t + 0.00001,
      -0.00001,
      d,
      t + 0.00001,
      0.00001,
      d,
      -t + 0.00001,
      0.00001,
      d,
      -t + 0.00001,
      -0.00001,

      -t,
      0,
      -0.000001,
      -t,
      0,
      -0.00001,

      0,
      t + 0.00001,
      0.00001,
      0,
      t + 0.00001,
      -0.00001,
      0,
      -t + 0.00001,
      -0.00001,
      0,
      -t + 0.00001,
      0.00001,
    ];

    return vertexPosition;
  }

  function createCoords() {
    let position = createDodecahedron();

    let vertexCoords = [];

    for (let i = 0; i < position.length; i += 3) {
      const X = position[i + 0];
      const Y = position[i + 1];
      const Z = position[i + 2];
      const fi = Math.atan2(-Z, X); //atan(-Z/X)
      const phi = Math.asin(Y / Math.sqrt(X * X + Y * Y + Z * Z)); //asin(Y/|R|)
      const u = fi / (2 * Math.PI) + 0.5;
      const v = phi / Math.PI + 0.5;

      vertexCoords.push(...[u, v]);
    }

    console.log(position.length);
    return vertexCoords;
  }

  const indices = [
    0,
    8,
    9,
    0,
    9,
    1,
    0,
    1,
    12,
    9,
    3,
    19,
    9,
    19,
    18,
    9,
    18,
    1,
    19,
    7,
    11,
    19,
    11,
    5,
    19,
    5,
    18,
    10,
    6,
    17,
    10,
    17,
    16,
    10,
    16,
    4,
    16,
    17,
    2,
    16,
    2,
    8,
    16,
    8,
    0,
    8,
    2,
    13,
    8,
    13,
    3,
    8,
    3,
    9,
    //19-22
    21,
    32,
    11,
    15,
    10,
    20,
    21,
    11,
    7,
    15,
    6,
    10,
    //23-26
    22,
    11,
    33,
    14,
    20,
    10,
    14,
    10,
    4,
    22,
    5,
    11,
    //27-31
    3,
    7,
    19,
    3,
    7,
    36,
    7,
    36,
    25,
    3,
    36,
    31,
    //31=44
    17,
    6,
    2,
    2,
    6,
    37,
    6,
    37,
    24,
    2,
    37,
    30,

    16,
    4,
    0,
    0,
    4,
    34,
    4,
    34,
    26,
    0,
    34,
    29,
    1,
    18,
    5, //dolny trojkat
    1,
    5,
    35,
    5,
    35,
    27,
    1,
    35,
    28,
  ];

  const dodecahedronPosition = createDodecahedron();
  const dodecahedronCoords = createCoords();

  //Tworzenie buforów
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(dodecahedronPosition),
    gl.STATIC_DRAW
  );
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numItems = dodecahedronPosition.length;

  vertexCoordsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexCoordsBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(dodecahedronCoords),
    gl.STATIC_DRAW
  );
  vertexCoordsBuffer.itemSize = 2;
  vertexCoordsBuffer.numItems = 12;

  indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  indexBuffer.itemSize = 3;
  indexBuffer.numItems = indices.length;
}

function initTexture(url) {
  textureBuffer = gl.createTexture();

  var textureImg = new Image();
  textureImg.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textureImg
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  };
  textureImg.src = url;
}

function matrixUpdate() {
  function MatrixMul(a, b) {
    //Mnożenie macierzy
    let c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        c[i * 4 + j] = 0.0;
        for (let k = 0; k < 4; k++) {
          c[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
        }
      }
    }
    return c;
  }

  //model view matrix
  viewMatrix = [
    1,
    0,
    0,
    0, //Macierz jednostkowa
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
  ];

  let zRotation = [
    +Math.cos((angleZ * Math.PI) / 180.0),
    +Math.sin((angleZ * Math.PI) / 180.0),
    0,
    0,
    -Math.sin((angleZ * Math.PI) / 180.0),
    +Math.cos((angleZ * Math.PI) / 180.0),
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
  ];

  let yRotation = [
    +Math.cos((angleY * Math.PI) / 180.0),
    0,
    -Math.sin((angleY * Math.PI) / 180.0),
    0,
    0,
    1,
    0,
    0,
    +Math.sin((angleY * Math.PI) / 180.0),
    0,
    +Math.cos((angleY * Math.PI) / 180.0),
    0,
    0,
    0,
    0,
    1,
  ];

  let xRotation = [
    1,
    0,
    0,
    0,
    0,
    +Math.cos((angleX * Math.PI) / 180.0),
    +Math.sin((angleX * Math.PI) / 180.0),
    0,
    0,
    -Math.sin((angleX * Math.PI) / 180.0),
    +Math.cos((angleX * Math.PI) / 180.0),
    0,
    0,
    0,
    0,
    1,
  ];

  let zTranslation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, tz, 1];

  viewMatrix = MatrixMul(viewMatrix, xRotation);
  viewMatrix = MatrixMul(viewMatrix, yRotation);
  viewMatrix = MatrixMul(viewMatrix, zRotation);

  viewMatrix = MatrixMul(viewMatrix, zTranslation);
}

function render() {
  matrixUpdate();

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clearColor(0.0, 0.0, 0.0, 0.0); //Wyczyszczenie obrazu kolorem czerwonym
  gl.clearDepth(1.0); //Wyczyścienie bufora głebi najdalszym planem
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(shaderProgram); //Użycie przygotowanego programu shaderowego

  gl.enable(gl.DEPTH_TEST); // Włączenie testu głębi - obiekty bliższe mają przykrywać obiekty dalsze
  gl.depthFunc(gl.LEQUAL); //

  gl.uniformMatrix4fv(
    gl.getUniformLocation(shaderProgram, "projectionMatrix"),
    false,
    new Float32Array(uPMatrix)
  ); //Wgranie macierzy kamery do pamięci karty graficznej
  gl.uniformMatrix4fv(
    gl.getUniformLocation(shaderProgram, "viewMatrix"),
    false,
    new Float32Array(viewMatrix)
  );

  gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aPosition")); //Przekazanie położenia
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(
    gl.getAttribLocation(shaderProgram, "aPosition"),
    vertexPositionBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aCoords")); //Pass the geometry
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexCoordsBuffer);
  gl.vertexAttribPointer(
    gl.getAttribLocation(shaderProgram, "aCoords"),
    vertexCoordsBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  angleY += 0.5;
  requestAnimationFrame(render);
}

function camera(afov = 70, far = 100, near = 0.1) {
  let aspect = gl.viewportWidth / gl.viewportHeight;
  let fov = (afov * Math.PI) / 180.0; //Określenie pola widzenia kamery
  let zFar = far; //Ustalenie zakresów renderowania sceny 3D (od obiektu najbliższego zNear do najdalszego zFar)
  let zNear = near;
  uPMatrix = [
    1.0 / (aspect * Math.tan(fov / 2)),
    0,
    0,
    0,
    0,
    1.0 / Math.tan(fov / 2),
    0,
    0,
    0,
    0,
    -(zFar + zNear) / (zFar - zNear),
    -1,
    0,
    0,
    -(2 * zFar * zNear) / (zFar - zNear),
    0.0,
  ];
}

var angleZ = 180.0;
var angleY = 0.0;
var angleX = 0.0;
var tz = -5.0;

function startGL() {
  let canvas = document.getElementById("canvas-hero");
  gl = canvas.getContext("experimental-webgl");
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  const texture = "./images/textures/texture2.webp";
  // const texture = './images/textures/1.jpg'

  initShaders();
  initBuffers();
  initTexture(texture);
  camera(43);

  render();
}
