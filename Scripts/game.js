// variabel lapangan
var fieldWidth = 400, fieldHeight = 200, fieldDepth = 90 ; // default: 400 x 200

// arah bola pada koordinat x dan y serta kecepatan per frame
var ballDirX = 1, ballDirY = 1, ballDirZ = 1, ballSpeed = 1.2;

var table2DirX = 1, table2DirY = 1, table2Speed = 1.2;
var table3DirX = 1, table3DirY = 1, table3Speed = 1.2;

var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// variabel terkait game
var score1 = 0, score2 = 0;

// skor maksimal suatu ronde. Dapat diubah ke angka bulat lain
var maxScore = 7;

// Atur kesulitan lawan (0 - termudah, 1 - tersulit)
var difficulty = 0.05;

// atur ukuran scene
var WIDTH = 1280,
  HEIGHT = 720;

// atur atribut kamera
var VIEW_ANGLE = 90,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.01,
  FAR = 10000;

var c = document.getElementById("gameCanvas");

// buat renderer WebGL, kamera
// dan sebuah scene
var renderer = new THREE.WebGLRenderer();

camera = new THREE.PerspectiveCamera(
  VIEW_ANGLE,
  ASPECT,
  NEAR,
  FAR);

scene = new THREE.Scene();
// tambah kamera pada scene
scene.add(camera);

// atur posisi default kamera
// tanpa pengaturan ini akan mengacaukan bayangan rendering
camera.position.z = 300;

// mulai renderer
renderer.setSize(WIDTH, HEIGHT);

// pasang domElement renderer (the gameCanvas)
c.appendChild(renderer.domElement);

// atur bidang permainan 
var planeWidth = fieldWidth,
  planeHeight = fieldHeight + 220,
  planeQuality = 10;

// buat material paddle1 (grip)
var paddle1Material =
  new THREE.MeshLambertMaterial(
    {
      color: 0x2441ff,
      transparent:true,
      opacity:0.9
    });
// buat material paddle2
var paddle2Material =
  new THREE.MeshLambertMaterial(
    {
      color: 0xd13838,
      transparent:true,
      opacity:0.6
    });

// buat material bidang permainan	

const loader = new THREE.TextureLoader();


// buat material untuk meja
    var tableMaterial =
        new THREE.MeshLambertMaterial(
            {
                color: 0x406106
            });
    var table2Material =
        new THREE.MeshLambertMaterial(
            {
                color: 0xd4f757,
                transparent:true,
                opacity: 0.5,
            });        

const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xc6e84d
  // normalMap: tekstur,
});

// buat bidang permukaan untuk permainan
var plane = new THREE.Mesh(
  new THREE.PlaneGeometry(
    planeWidth * 0.95,	// 95% dari lebar meja, karena kita ingin menunjukkan gerakan bola di luar bidang
    planeHeight ,
    planeQuality,
    planeQuality),
  planeMaterial);

scene.add(plane);
plane.receiveShadow = true;

var table = new THREE.Mesh(
  new THREE.CubeGeometry(
      planeWidth * 1.05,	
      planeHeight * 1.03 ,
      100,				
      planeQuality,
      planeQuality,
      1),

  tableMaterial);
table.position.z = -51;	// kita "menenggelamkan" meja hingga 50 ke bawah. Tambahan kedalaman 1 agar bidang dapat terlihat
scene.add(table);
table.receiveShadow = true;

var table2 = new THREE.Mesh(
  new THREE.CubeGeometry(
      planeWidth *0.95,	
      10,
      100,				
      planeQuality,
      planeQuality,
      1),

  table2Material);
table2.position.z = 50;	
table2.position.y = -110;	

// kita "menenggelamkan" meja hingga 50 ke bawah. Tambahan kedalaman 1 agar bidang dapat terlihat
scene.add(table2);
table2.receiveShadow = true;

// jika dinding keluar ke sisi atas meja
if (table2.position.y <= -fieldHeight / 2) {
  table2DirY = -table2DirY;
}

// jika dinding keluar ke sisi bawah meja
if (table2.position.y >= fieldHeight / 2 ) {
  table2DirY = -table2DirY;
}

// mengupdate posisi dinding seiring waktu
table2.position.y += table2DirY * table2Speed;

// batasi kecepatan dinding pada koordinat y 2 kali pada koordinat x
// ini agar dinding tidak bergerak terlalu cepat dari kiri ke kanan
// menjaga game dapat dimainkan (playable)
if (table2DirY > table2Speed * 2) {
  table2DirY = table2Speed * 2;
}
else if (table2DirY < -table2Speed * 2) {
  table2DirY = -table2Speed * 2;
}


var table3 = new THREE.Mesh(
  new THREE.CubeGeometry(
      planeWidth *0.95,	
      10,
      100,			
      planeQuality,
      planeQuality,
      1),

  table2Material);
table3.position.z = 50;
table3.position.y = 110;

// kita "menenggelamkan" meja hingga 50 ke bawah. Tambahan kedalaman 1 agar bidang dapat terlihat
scene.add(table3);
table3.receiveShadow = true;
// atur variabel lingkaran
// nilai 'segmen' dan 'cincin' lebih rendah akan meningkatkan performa
var radius = 5,
  segments = 6,
  rings = 6;

// buat material lingkaran
var sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0x049f3a,
      wireframe: false
    });

// buat bola dengan geometri lingkaran
var ball = new THREE.Mesh(
  new THREE.SphereGeometry(radius,
    segments,
    rings),
  sphereMaterial);

// tambah lingkaran (sphere) pada layar
scene.add(ball);

ball.position.x = 0;
ball.position.y = 0;
ball.position.z = radius; // atur bola di atas permukaan

ball.receiveShadow = true;
ball.castShadow = true;

// atur variabel paddle (grip)
paddleWidth = 10;
paddleHeight = 50;
paddleDepth = 30;
paddleQuality = 1;

// atur grip 1
paddle1 = new THREE.Mesh(
  new THREE.CubeGeometry(
    paddleWidth,
    paddleHeight,
    paddleDepth,
    paddleQuality,
    paddleQuality,
    paddleQuality),
  paddle1Material);

// tambah grip pada scene
scene.add(paddle1);
paddle1.receiveShadow = true;
paddle1.castShadow = true;

// atur grip kedua
paddle2 = new THREE.Mesh(
  new THREE.CubeGeometry(
    paddleWidth,
    paddleHeight,
    paddleDepth,
    paddleQuality,
    paddleQuality,
    paddleQuality),
  paddle2Material);

// tambah grip kedua pada scene
scene.add(paddle2);
paddle2.receiveShadow = true;
paddle2.castShadow = true;

// atur grip-grip pada kedua sisi meja
paddle1.position.x = -fieldWidth / 2 + paddleWidth;
paddle2.position.x = fieldWidth / 2 - paddleWidth;

// letakkan grip di atas permukaan
paddle1.position.z = paddleDepth;
paddle2.position.z = paddleDepth - 3;

// // buat titik sinar/cahaya
pointLight =
  new THREE.PointLight(0xFFFFFF);

// atur posisinya
pointLight.position.x = 200; // -1000
pointLight.position.y = 0; // 0
pointLight.position.z = 1000; // 1000
pointLight.intensity = 1;
pointLight.distance = 10000;
// tambah pada scene
scene.add(pointLight);

pointLight2 =
  new THREE.PointLight(0xFFFFFF);

// atur posisinya
pointLight2.position.x = -200; // -1000
pointLight2.position.y = 0; // 0
pointLight2.position.z = 1000; // 1000
pointLight2.intensity = 1;
pointLight2.distance = 10000;
// tambah pada scene
scene.add(pointLight2);

// sinar direksional putih dibuat di atas.
directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// scene.add( directionalLight );

// buat sinar di sekeliling 
light = new THREE.AmbientLight(0xFFFFFF); // soft white light
// scene.add( light );

// tambah titik sinar
// untuk "menuang" bayangan
spotLight = new THREE.SpotLight(0xF8D898);
spotLight.position.set(0, 0, 460); // 0, 0, 460
spotLight.intensity = 0.6; // prev 0.6
spotLight.castShadow = true;
scene.add(spotLight);

// MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
renderer.shadowMapEnabled = true;

function setup() {
  // mengupdate papan skor untuk menunjukkan poin maksimal
  document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";

  // atur ulang skor player dan lawan
  score1 = 0;
  score2 = 0;

  draw();
}

function draw() {
  // gambar scene three.js
  renderer.render(scene, camera);

  // ulangi fungsi draw() terus-menerus
  requestAnimationFrame(draw);

  // proses logika game

  //  bola
  // jika bola menuju sisi kiri (sisi pemain)
  if (ball.position.x <= -fieldWidth / 2 - 80 ) {
    // CPU mencetak poin
    score2++;

    // update papan skor
    document.getElementById("scores").innerHTML = score1 + "-" + score2;

    // dan letakkan kembali bola ke tengah
    resetBall(2);

    // cek jika pertandingan berakhir
    matchScoreCheck();
  }

  // jika bola menuju sisi kanan (sisi CPU)
  if (ball.position.x >= fieldWidth / 2 + 80 ) {
    // pemain mencetak poin
    score1++;

    // update papan skor
    document.getElementById("scores").innerHTML = score1 + "-" + score2;

    // dan letakkan kembali bola ke tengah
    resetBall(1);

    // cek jika pertandingan berakhir
    matchScoreCheck();
  }

  if(table2.position.y >= -220 || table2.position.y <= -110)
  {
    table2Speed = table2Speed;
  }

  if(table2.position.y >= -111 || table2.position.y <= -219)
  {
    table2Speed = -table2Speed;
  }

  table2.position.y -= table2Speed/2 ;

  //logika dindin3

  if(table3.position.y >= 220 || table3.position.y <= 110)
  {
    table3Speed = -table3Speed;
  }

  if(table3.position.y >= 111 || table3.position.y <= 219)
  {
    table3Speed = table3Speed;
  }

  table3.position.y -= table3Speed/2 ;
  
  // jika bola menuju sisi atas (sisi meja)
  if (ball.position.y < table2.position.y ) {
    ballDirY = -ballDirY* 1.5;
  }
  // jika bola menuju sisi bawah (sisi meja)
  if (ball.position.y > table3.position.y ) {
    ballDirY = -ballDirY*1.5;
  }
  
  // jika bola menuju sisi atas (sisi atap)
  if (ball.position.z <= fieldDepth) {
    ballDirZ = -ballDirZ;
  }
  // jika bola menuju sisi bawah (sisi atap)
  if (ball.position.z >= 5) {
    ballDirZ = -ballDirZ;
  }
  
  // update posisi bola seiring waktu
  ball.position.x += ballDirX * ballSpeed ;
  ball.position.y += ballDirY * ballSpeed ;
  ball.position.z += ballDirZ * ballSpeed * 0.7 ;

  // batasi kecepatan bola pada koordinat y 2 kali pada koordinat x
// ini agar bola tidak bergerak terlalu cepat dari kiri ke kanan
// menjaga game dapat dimainkan (playable)
  if (ballDirY > ballSpeed * 2) {
    ballDirY = ballSpeed * 2;
  }
  else if (ballDirY < -ballSpeed * 2) {
    ballDirY = -ballSpeed * 2;
  }

  // batasi kecepatan bola pada koordinat z 2 kali pada koordinat x
// ini agar bola tidak bergerak terlalu cepat dari kiri ke kanan
// menjaga game dapat dimainkan (playable)
  if (ballDirZ > ballSpeed * 2) {
    ballDirZ = ballSpeed * 2;
  }
  else if (ballDirZ < -ballSpeed * 2) {
    ballDirZ = -ballSpeed * 2;
  }
  
  //  grip
  // jika bola sejajar grip pada bidang x
  // kita hanya mengecek antara bagian depan dengan tengah grip 

  if (ball.position.x <= paddle1.position.x + paddleWidth
    && ball.position.x >= paddle1.position.x) {
    // dan jika bola sejajar grip pada bidang y
    if (ball.position.y <= paddle1.position.y + paddleHeight / 2
      && ball.position.y >= paddle1.position.y - paddleHeight / 2) {
      if (ball.position.z <= paddle1.position.z + paddleDepth / 2 && ball.position.z >= paddle1.position.z - paddleDepth / 2) {
        // dan jika bola bergerak ke arah pemain (arah -ve)
        if (ballDirX < 0) {
          
          // ubah arah bola bergerak untuk membuat pantulan
    
          ballDirX = -ballDirX;
          ballDirZ = -ballDirZ;
          // kita memengaruhi sudut arah bola saat memukulnya
          // ini bukan fisika realistis, hanya menambah efek permainan
          // memungkinkan anda "memotong" bola untuk mengalahkan lawan
          ballDirY -= paddle1DirY * 1.5;//0.7
          // paddle1.position.x = (-fieldWidth / 2 + paddleWidth);

        }
      }
    }
  }

  // logika grip lawan	

  // jika bola sejajar grip pada bidang x
  // kita hanya mengecek antara bagian depan dengan tengah grip 
  if (ball.position.x <= paddle2.position.x + paddleWidth
    && ball.position.x >= paddle2.position.x) {
    // dan jika bola sejajar grip pada bidang y
    if (ball.position.y <= paddle2.position.y + paddleHeight / 2
      && ball.position.y >= paddle2.position.y - paddleHeight / 2) {
      // dan jika bola sejajar grip pada bidang z
      if (ball.position.z <= paddle2.position.z + paddleDepth / 2 
      && ball.position.z >= paddle2.position.z - paddleDepth / 2) {
        // dan jika bola bergerak ke arah lawan (arah +ve)
        if (ballDirX > 0) {
          
          // paddle2.scale.y = 15;
          // ubah arah bola bergerak untuk membuat pantulan
          ballDirX = -ballDirX;
          ballDirZ = -ballDirZ;
          // kita memengaruhi sudut arah bola saat memukulnya
          // ini bukan fisika realistis, hanya menambah efek permainan
          // memungkinkan anda "memotong" bola untuk mengalahkan lawan
          ballDirY -= paddle2DirY * 1.5;
        }
      }
    }
  }

  // kita bisa melihat bayangan jika kita menggerakan cahaya secara dinamis
  spotLight.position.x = ball.position.x;
  spotLight.position.y = ball.position.y;

  // kamera
  camera.position.x = paddle1.position.x - 80;
  camera.position.z = paddle1.position.z + 100;
  camera.rotation.z = -90 * Math.PI / 180;
  camera.rotation.y = -60 * Math.PI / 180;

  // gerakan grip pemain
  if (Key.isDown(Key.A)) {
    // jika grip tidak menyentuh sisi meja
    // kita bergerak
    if (paddle1.position.y < planeHeight * 0.45) {
      paddle1.position.y += paddleSpeed * 0.75
    }
    // jika tidak kita tidak  bergerak dan melebarkan grip
    // untuk mengindikasikan kita tidak dapat bergerak
    // else {
    //     paddle1DirY = 0;
    //     paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
    // }
  }
  // gerak ke kanan
  else if (Key.isDown(Key.D)) {
    // jika grip tidak menyentuh sisi meja
    // kita bergerak
    if (paddle1.position.y > -planeHeight * 0.45) {
      paddle1.position.y += -paddleSpeed * 0.75
    }
    // jika tidak kita tidak  bergerak dan melebarkan grip
    // untuk mengindikasikan kita tidak dapat bergerak
    // else {
    //     paddle1DirY = 0;
    //     paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
    // }
  }
  // gerak ke atas
  if (Key.isDown(Key.W)) {
    // jika grip tidak menyentuh sisi meja
    // kita bergerak
    if (paddle1.position.z < fieldHeight * 0.45) {
      paddle1.position.z += paddleSpeed * 0.5
    }
    // jika tidak kita tidak  bergerak dan melebarkan grip
    // untuk mengindikasikan kita tidak dapat bergerak
    // else {
    //     paddle1DirY = 0;
    //     paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
    // }
  }
  // gerak ke bawah
  else if (Key.isDown(Key.S)) {
    // jika grip tidak menyentuh sisi meja
    // kita bergerak
    if (paddle1.position.z > -(fieldHeight*0.01 - 20)) {
      paddle1.position.z += -paddleSpeed * 0.5
    }
    // jika tidak kita tidak  bergerak dan melebarkan grip
    // untuk mengindikasikan kita tidak dapat bergerak
    // else {
    //     paddle1DirY = 0;
    //     paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
    // }
  }
  // selain itu grip tidak bergerak
  else {
    // hentikan grip
    paddle1DirY = 0;
  }

  // gerakan grip lawan
  // Lerp ke bola pada bidang y
  paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;

  // Lerp ke bola pada bidang z
  paddle2DirZ = (ball.position.z - paddle2.position.z) * difficulty;

  // jika fungsi lerp menghasilkan nilai di atas kecepatan grip, kita jepit itu
  if (Math.abs(paddle2DirY) <= paddleSpeed) {
    paddle2.position.y += paddle2DirY;
  }
  // jika nilai lerp terlalu tinggi, kita harus batasi kecepatan paddleSpeed
  else {
    // jika grip lerping pada arah +ve
    if (paddle2DirY > paddleSpeed) {
      paddle2.position.y += paddleSpeed;
    }
    // jika grip lerping pada arah -ve
    else if (paddle2DirY < -paddleSpeed) {
      paddle2.position.y -= paddleSpeed;
    }
  }

  // jika fungsi lerp menghasilkan nilai di atas kecepatan grip, kita jepit itu
  if (Math.abs(paddle2DirZ) <= paddleSpeed && ball.position.z > 20) {
    paddle2.position.z += paddle2DirZ;
  }
  // jika nilai lerp terlalu tinggi, kita harus batasi kecepatan paddleSpeed
  else {
    // jika grip lerping pada arah +ve
    if (paddle2DirZ > paddleSpeed && ball.position.z > 20 ) {
      paddle2.position.z += paddleSpeed;
    }
    // jika grip lerping pada arah -ve
    else if (paddle2DirZ < -paddleSpeed && ball.position.z > 20 ) {
      paddle2.position.z -= paddleSpeed;
    }
  }

 

  paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
  paddle2.scale.z += (1 - paddle2.scale.z) * 0.2;
}

function resetBall(loser) {
  // posisi bola di tengah meja
  ball.position.x = 0;
  ball.position.y = 0;
  ball.position.z = 10;

  // jika pemain kehilangan poin terakhir, bola diberikan ke lawan
  if (loser == 1) {
    ballDirX = -1;
  }
  // jika lawan kalah, bola diberikan ke pemain
  else {
    ballDirX = 1;
  }

  // atur bola untuk bergerak +ve pada bidang y (ke kiri dari kamwea)
  ballDirY = 1;
}

var bounceTime = 0;
// mengecek apakah pemain atau lawan meraih poin maksimal
function matchScoreCheck() {
  // jika pemain meraih poin maksimal
  if (score1 >= maxScore) {
    // stop bola
    ballSpeed = 0;
    table2Speed = 0;
    table3Speed = 0;
    // tulis ke banner
    document.getElementById("scores").innerHTML = "Player wins!";
    document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
    // buat grip memantul ke atas dan bawah
    bounceTime++;
    paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
    // 'perbesar' dan 'peras' grip untuk menunjukkan sukacita menang
    paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
    paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
  }
  // jika lawan meraih poin maksimal
  else if (score2 >= maxScore) {
    // stop bola
    ballSpeed = 0;
    table2Speed = 0;
    table3Speed = 0;
    // tulis ke banner
    document.getElementById("scores").innerHTML = "CPU wins!";
    document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
    // buat grip memantul ke atas dan bawah
    bounceTime++;
    paddle2.position.z = Math.sin(bounceTime * 0.1) * 100;
    // 'perbesar' dan 'peras' grip untuk menunjukkan sukacita menang
    paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 100;
    paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 100;
  }
}