"use strict"

var gl;
var shaderProgram;
var uPMatrix;
var vertexPositionBuffer;
var vertexCoordsBuffer;
var indexBuffer;
var textureBuffer;

function MatrixMul(a,b) //Mnożenie macierzy
{
  let c = [
  0,0,0,0,
  0,0,0,0,
  0,0,0,0,
  0,0,0,0
  ]
  for(let i=0;i<4;i++)
  {
    for(let j=0;j<4;j++)
    {
      c[i*4+j] = 0.0;
      for(let k=0;k<4;k++)
      {
        c[i*4+j]+= a[i*4+k] * b[k*4+j];
      }
    }
  }
  return c;
}
async function* makeTextFileLineIterator(fileURL) { //Odczyd pliku z serwera i podział na poszczególne linie.
  const utf8Decoder = new TextDecoder('utf-8');
  const response = await fetch(fileURL);
  const reader = response.body.getReader();
  let { value: chunk, done: readerDone } = await reader.read();
  chunk = chunk ? utf8Decoder.decode(chunk) : '';

  const re = /\n|\r|\r\n/gm;
  let startIndex = 0;
  let result;

  for (;;) {
    let result = re.exec(chunk);
    if (!result) {
      if (readerDone) {
        break;
      }
      let remainder = chunk.substr(startIndex);
      ({ value: chunk, done: readerDone } = await reader.read());
      chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : '');
      startIndex = re.lastIndex = 0;
      continue;
    }
    yield chunk.substring(startIndex, result.index);
    startIndex = re.lastIndex;
  }
  if (startIndex < chunk.length) {
    // last line didn't end in a newline char
    yield chunk.substr(startIndex);
  }
}

async function LoadObj(filename)
{
  let rawVertexPosition = [0,0,0]; //Dodana 0 pozycja która nie będzie uzywana
  let rawVertexNormal = [0,0,0];//Dodana 0 pozycja która nie będzie uzywana
  let rawVertexCoords = [0,0];//Dodana 0 pozycja która nie będzie uzywana

  //Opis sceny 3D, położenie punktów w przestrzeni 3D w formacie X,Y,Z 
  let vertexPosition = []; //Każdy punkt 3 składowe - X1,Y1,Z1
  let vertexNormal = [];
  let vertexCoords = [];
  let indexes = [];


  let aa = new Map();
  for await (let line of makeTextFileLineIterator(filename)) {
    const lineArray = line.split(' ');
    switch(lineArray[0]) {
      case "v": { //Położenie wierzchołków
        const x = parseFloat(lineArray[1]);
        const y = parseFloat(lineArray[2]);
        const z = parseFloat(lineArray[3]);
        rawVertexPosition.push(...[x,y,z]);
        break;
      };
      case "vn": { //Wektor normalny
        const xn = parseFloat(lineArray[1]);
        const yn = parseFloat(lineArray[2]);
        const zn = parseFloat(lineArray[3]);
        rawVertexNormal.push(...[xn,yn,zn]);
        break;
      }
      case "vt": { //Współrzędne tekstury
        const u = parseFloat(lineArray[1]);
        const v = parseFloat(lineArray[2]);
        rawVertexCoords.push(...[u,v]);
        break;
      }
      case "f": { //Indeksy trójkątów
        const i0 = lineArray[1];
        const i1 = lineArray[2];
        const i2 = lineArray[3];
        for(let ii of [i0,i1,i2]) {
          if(!aa.has(ii)) { //Ten indeks nie był jeszcze przemapowany
            //console.log(ii);
            const iia = ii.split('/');
            const indexVertexPosition = parseInt(iia[0]);//Indeks w tablicy położeń wierzchołków
            const indexVertexCoords = parseInt(iia[1]); //Indeks w tablicy wspołrzędnych tekstur
            const indexVertexNormal = parseInt(iia[2]); //Indeks w tablicy wektorów normalnych
            const index = vertexPosition.length/3;

            vertexPosition.push(rawVertexPosition[indexVertexPosition*3+0]); //Skopiowanie położenia X
            vertexPosition.push(rawVertexPosition[indexVertexPosition*3+1]); //Skopiowanie położenia Y
            vertexPosition.push(rawVertexPosition[indexVertexPosition*3+2]); //Skopiowanie położenia Z

            vertexNormal.push(rawVertexNormal[indexVertexNormal*3+0]); //Skopiowanie składowej X wektora normalnego
            vertexNormal.push(rawVertexNormal[indexVertexNormal*3+1]); 
            vertexNormal.push(rawVertexNormal[indexVertexNormal*3+2]); 

            vertexCoords.push(rawVertexCoords[indexVertexCoords*2+0]); 
            vertexCoords.push(rawVertexCoords[indexVertexCoords*2+1]); 
            aa.set(ii,index);
          }
          //console.log(aa.get(ii));
          indexes.push(aa.get(ii)) //Dodaj jego wynikowy indeks do tablicy indeksów
        }
        //rawVertexCoords.push(...[u,v]);
        break;
      }
    }
  }

  console.log(`Wczytano ${rawVertexPosition.length/3-1} wierzchołków`);
  console.log(`Wczytano ${rawVertexNormal.length/3-1} wektorów normalnych`);
  console.log(`Wczytano ${rawVertexCoords.length/2-1} współrzędnych tekstury`);

  console.log(`W efekcie mapowania stworzono ${vertexPosition.length/3} wierzchołków`);
  console.log(`W efekcie mapowania stworzono ${indexes.length} indeksów`);
 
  //console.log(indexes);
  //console.log(vertexPosition);
  return [indexes, vertexPosition, vertexCoords];
}

async function startGL() 
{
//   alert("StartGL");
  let canvas = document.getElementById("canvas-left"); //wyszukanie obiektu w strukturze strony 
  gl = canvas.getContext("experimental-webgl"); //pobranie kontekstu OpenGL'u z obiektu canvas
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.viewportWidth = canvas.width; //przypisanie wybranej przez nas rozdzielczości do systemu OpenGL
  gl.viewportHeight = canvas.height;

  console.log('canvas');

  
  //Kod shaderów
  const vertextShaderSource = ` //Znak akcentu z przycisku tyldy - na lewo od przycisku 1 na klawiaturze
    precision highp float;
    attribute vec3 aVertexPosition;
    attribute vec2 aVertexCoords;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    varying vec3 vColor;
    varying vec2 vTexUV;


    void main(void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); 
      //vColor = aVertexColor;
      //aVertexCoords.y = 1.0 - aVertexCoords.y; 
      vTexUV = aVertexCoords;
    }
  `;
  const fragmentShaderSource = `
    precision highp float;
    //varying vec3 vColor;
    varying vec2 vTexUV;
    
    uniform sampler2D uSampler;

    void main(void) {
      //gl_FragColor = vec4(vColor,1.0); //Ustalenie stałego koloru wszystkich punktów sceny
      gl_FragColor = texture2D(uSampler,vTexUV); //Odczytanie punktu tekstury i przypisanie go jako koloru danego punktu renderowaniej figury
    }
  `;
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //Stworzenie obiektu shadera 
  let vertexShader   = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource); //Podpięcie źródła kodu shader
  gl.shaderSource(vertexShader, vertextShaderSource);
  gl.compileShader(fragmentShader); //Kompilacja kodu shader
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) { //Sprawdzenie ewentualnych błedów kompilacji
    alert(gl.getShaderInfoLog(fragmentShader));
    return null;
  }
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader));
    return null;
  }

  shaderProgram = gl.createProgram(); //Stworzenie obiektu programu 
  gl.attachShader(shaderProgram, vertexShader); //Podpięcie obu shaderów do naszego programu wykonywanego na karcie graficznej
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) alert("Could not initialise shaders");  //Sprawdzenie ewentualnych błedów


  let vertexPosition; 
  let vertexCoords;
  let indexes;

  [indexes, vertexPosition, vertexCoords] = await LoadObj('net.obj');

  vertexPositionBuffer = gl.createBuffer(); //Stworzenie tablicy w pamieci karty graficznej
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3; //zdefiniowanie liczby współrzednych per wierzchołek
  vertexPositionBuffer.numItems = 36; //Zdefinoiowanie liczby punktów w naszym buforze

  indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
  indexBuffer.itemSize = 3;
  indexBuffer.numItems = indexes.length;


  vertexCoordsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexCoordsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexCoords), gl.STATIC_DRAW);
  vertexCoordsBuffer.itemSize = 2;
  vertexCoordsBuffer.numItems = 12;


  textureBuffer = gl.createTexture();
  var textureImg = new Image();
  textureImg.onload = function() { //Wykonanie kodu automatycznie po załadowaniu obrazka
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg); //Faktyczne załadowanie danych obrazu do pamieci karty graficznej
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Ustawienie parametrów próbkowania tekstury
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  textureImg.src="texture.png"; //Nazwa obrazka

  //Macierze opisujące położenie wirtualnej kamery w przestrzenie 3D
  let aspect = gl.viewportWidth/gl.viewportHeight;
  let fov = 45.0 * Math.PI / 180.0; //Określenie pola widzenia kamery
  let zFar = 100.0; //Ustalenie zakresów renderowania sceny 3D (od obiektu najbliższego zNear do najdalszego zFar)
  let zNear = 0.1;
  uPMatrix = [
   1.0/(aspect*Math.tan(fov/2)),0                           ,0                         ,0                            ,
   0                         ,1.0/(Math.tan(fov/2))         ,0                         ,0                            ,
   0                         ,0                           ,-(zFar+zNear)/(zFar-zNear)  , -1,
   0                         ,0                           ,-(2*zFar*zNear)/(zFar-zNear) ,0.0,
  ];

  Tick();
} 

//let angle = 45.0; //Macierz transformacji świata - określenie położenia kamery
var angleZ = 0.0;
var angleY = 0.0;
var angleX = 90.0;
var tz = -12.0;

function Tick()
{  
  let uMVMatrix = [
  1,0,0,0, //Macierz jednostkowa
  0,1,0,0,
  0,0,1,0,
  0,0,0,1
  ];

  let uMVRotZ = [
  +Math.cos(angleZ*Math.PI/180.0),+Math.sin(angleZ*Math.PI/180.0),0,0,
  -Math.sin(angleZ*Math.PI/180.0),+Math.cos(angleZ*Math.PI/180.0),0,0,
  0,0,1,0,
  0,0,0,1
  ];

  let uMVRotY = [
  +Math.cos(angleY*Math.PI/180.0),0,-Math.sin(angleY*Math.PI/180.0),0,
  0,1,0,0,
  +Math.sin(angleY*Math.PI/180.0),0,+Math.cos(angleY*Math.PI/180.0),0,
  0,0,0,1
  ];

  let uMVRotX = [
  1,0,0,0,
  0,+Math.cos(angleX*Math.PI/180.0),+Math.sin(angleX*Math.PI/180.0),0,
  0,-Math.sin(angleX*Math.PI/180.0),+Math.cos(angleX*Math.PI/180.0),0,
  0,0,0,1
  ];

  let uMVTranslateZ = [
  1,0,0,0,
  0,1,0,0,
  0,0,1,0,
  0,0,tz,1
  ];
 
  uMVMatrix = MatrixMul(uMVMatrix,uMVRotX);
  uMVMatrix = MatrixMul(uMVMatrix,uMVRotY);
  uMVMatrix = MatrixMul(uMVMatrix,uMVRotZ);

  uMVMatrix = MatrixMul(uMVMatrix,uMVTranslateZ);
  //alert(uPMatrix);
  
  //Render Scene
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight); 
  gl.clearColor(0.0,0.0,0.0,0.5); //Wyczyszczenie obrazu kolorem czerwonym
  gl.clearDepth(1.0);             //Wyczyścienie bufora głebi najdalszym planem
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(shaderProgram)   //Użycie przygotowanego programu shaderowego
  
  gl.enable(gl.DEPTH_TEST);           // Włączenie testu głębi - obiekty bliższe mają przykrywać obiekty dalsze
  gl.depthFunc(gl.LEQUAL);            // 
  
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, new Float32Array(uPMatrix)); //Wgranie macierzy kamery do pamięci karty graficznej
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMVMatrix"), false, new Float32Array(uMVMatrix));
  
  gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexPosition"));  //Przekazanie położenia
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexPosition"), vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexCoords"));  //Pass the geometry
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexCoordsBuffer);
  gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexCoords"), vertexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  
  // gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems*vertexPositionBuffer.itemSize); //Faktyczne wywołanie rendrowania
  gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  
  // setTimeout(Tick,100);
  requestAnimationFrame(Tick);
}
function handlekeydown(e)
{
 if(e.keyCode==87) angleX=angleX+5.0; //W
 if(e.keyCode==83) angleX=angleX-5.0; //S
 if(e.keyCode==68) angleY=angleY+5.0;
 if(e.keyCode==65) angleY=angleY-5.0;
 if(e.keyCode==81) angleZ=angleZ+5.0;
 if(e.keyCode==69) angleZ=angleZ-5.0;
}
