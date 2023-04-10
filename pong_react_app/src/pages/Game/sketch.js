function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('canvas-container');
}

function draw() {
    background(220);
    circle(width / 2, height / 2, 50);
}


// Initialisation des variables
let ball, paddle1, paddle2;
let score1 = 0,
    score2 = 0;
let servingPlayer = 1;

function setup() {
    createCanvas(600, 400);
    paddle1 = new Paddle(20, height / 2);
    paddle2 = new Paddle(width - 20, height / 2);
    ball = new Ball(width / 2, height / 2);
}

function draw() {
    background(0);

    // Affichage des scores
    textSize(32);
    text(score1, width / 4, 40);
    text(score2, 3 * width / 4, 40);

    // Mise à jour et affichage des raquettes
    paddle1.update();
    paddle1.show();
    paddle2.update();
    paddle2.show();

    // Mise à jour et affichage de la balle
    ball.update();
    ball.show();

    // Gestion des collisions de la balle avec les murs
    if (ball.hitsTopBottom()) {
        ball.velocity.y *= -1;
    }

    // Gestion des collisions de la balle avec les raquettes
    if (ball.hitsPaddle(paddle1)) {
        ball.x = paddle1.x + ball.radius + paddle1.w / 2;
        ball.velocity.x *= -1;
        servingPlayer = 2;
    } else if (ball.hitsPaddle(paddle2)) {
        ball.x = paddle2.x - ball.radius - paddle2.w / 2;
        ball.velocity.x *= -1;
        servingPlayer = 1;
    }

    // Gestion des points marqués
    if (ball.x < 0) {
        score2++;
        ball.reset();
        servingPlayer = 1;
    } else if (ball.x > width) {
        score1++;
        ball.reset();
        servingPlayer = 2;
    }

    // Affichage du joueur qui sert
    textSize(32);
    textAlign(CENTER);
    if (servingPlayer === 1) {
        text("Player 1 serves", width / 2, height - 40);
    } else {
        text("Player 2 serves", width / 2, height - 40);
    }
}

// Fonction pour créer un objet raquette
function Paddle(x, y) {
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 80;
    this.velocity = createVector(0, 0);

    // Mise à jour de la position de la raquette
    this.update = function() {
        this.velocity.limit(10);
        this.y += this.velocity.y;
        this.y = constrain(this.y, this.h / 2, height - this.h / 2);
    }

    // Affichage de la raquette
    this.show = function() {
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }
}

function Ball(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(5, 5);
    this.radius = 10;

    this.update = function() {
        this.position.add(this.velocity);
        if (this.position.y < 0 || this.position.y > height) {
            this.velocity.y = -this.velocity.y;
        }
    }

    this.show = function() {
        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    }
}
