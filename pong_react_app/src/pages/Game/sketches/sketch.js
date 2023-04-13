import { ReactP5Wrapper } from "react-p5-wrapper";

export default function sketch(p5) {

    let canvas;
    let ballX = 200,
        ballY = 200;
    let previousBallX1 = 200,
        previousBallX2 = 200,
        previousBallX3 = 300,
        previousBallY1 = 200,
        previousBallY2 = 200,
        previousBallY3 = 300;
    let ballRadius = 20;
    let paddle1 = 200,
        paddle2 = 200;
    let paddleWidth = 10,
        paddleHeight = 80;
    let score1 = 0,
        score2 = 0;

    let obstacles = [];

    const dimension_width = 600,
        dimension_height = 400;
    const header = document.getElementsByTagName("header");
    let header_hauteur = header[0].offsetHeight;
    const gameDiv = document.getElementById("game");
    let div_largeur = gameDiv.offsetWidth,
        div_hauteur = gameDiv.offsetHeight;
    let game_height = div_hauteur - header_hauteur,
        game_width = div_largeur;

    let terrain_height,
        terrain_width;
    tailleterrain();


    let ratio_hauteur = (1 / dimension_height) * terrain_height,
        ratio_largeur = (1 / dimension_width) * terrain_width;

    function centerCanvas() {
        const x = (game_width - p5.width) / 2; // Calcul de la position x du canvas pour le centrer horizontalement
        const y = (game_height - p5.height) / 2; // Calcul de la position y du canvas pour le centrer verticalement
        canvas.position(x, y);
    }

    function tailleterrain() {
        // Calculer le facteur d'échelle en fonction de la taille de la div
        let scaleX = game_width / dimension_width;
        let scaleY = game_height / dimension_height;

        let scale = Math.min(scaleX, scaleY); // Utiliser le facteur d'échelle le plus petit pour conserver les proportions
        // Appliquer l'échelle et centrer le terrain de jeu au milieu du canvas
        terrain_height = dimension_height * scale;
        terrain_width = dimension_width * scale;
    }

    p5.setup = () => {
        tailleterrain();
        canvas = p5.createCanvas(terrain_width, terrain_height);
        canvas.parent('game');
        centerCanvas();
    };

    p5.draw = () => {
        p5.background(0);
        p5.fill(p5.color(255, 255, 255));
        p5.strokeWeight(0);

        //Score
        p5.textSize(32);
        p5.text(score1, p5.width / 4, 40);
        p5.text(score2, 3 * p5.width / 4, 40);

        p5.rectMode(p5.CENTER);

        // Obstacles
        obstacles.forEach((obstacle) => {
            p5.rect(obstacle.pos_x * ratio_hauteur, obstacle.pos_y * ratio_hauteur, obstacle.width * ratio_largeur, obstacle.length * ratio_hauteur);
        });

        // Effet balle
        p5.fill(p5.color(69, 41, 77));
        p5.rect(previousBallX3 * ratio_largeur, previousBallY3 * ratio_hauteur, ballRadius * ratio_largeur, ballRadius * ratio_hauteur);
        p5.fill(p5.color(155, 89, 182));
        p5.rect(previousBallX2 * ratio_largeur, previousBallY2 * ratio_hauteur, ballRadius * ratio_largeur, ballRadius * ratio_hauteur);
        p5.fill(p5.color(34, 68, 131));
        p5.rect(previousBallX1 * ratio_largeur, previousBallY1 * ratio_hauteur, ballRadius * ratio_largeur, ballRadius * ratio_hauteur);
        p5.fill(p5.color(255, 255, 255));
        p5.rect(ballX * ratio_largeur, ballY * ratio_hauteur, ballRadius * ratio_largeur, ballRadius * ratio_hauteur);


        p5.fill(p5.color(0, 0, 0));
        p5.stroke(p5.color(255, 255, 255));
        p5.strokeWeight(5);

        // Paddle
        p5.rect(20 * ratio_largeur, paddle1 * ratio_hauteur, paddleWidth * ratio_largeur, paddleHeight * ratio_hauteur);
        p5.rect(p5.width - 20 * ratio_largeur, paddle2 * ratio_hauteur, paddleWidth * ratio_largeur, paddleHeight * ratio_hauteur);
    };

    p5.updateWithProps = (props) => {
        if (!props || !props.data) {
            return;
        }


        // Check if resize needed
        if (div_largeur != gameDiv.offsetWidth || div_hauteur != gameDiv.offsetHeight ||
            header_hauteur != header[0].offsetHeight) {
            div_largeur = gameDiv.offsetWidth;
            div_hauteur = gameDiv.offsetHeight;
            header_hauteur = header[0].offsetHeight;
            game_height = div_hauteur - header_hauteur;
            game_width = div_largeur;
            console.log("Resive");
            tailleterrain();
            p5.resizeCanvas(terrain_width, terrain_height);
            centerCanvas();
            ratio_hauteur = (1 / dimension_height) * terrain_height;
            ratio_largeur = (1 / dimension_width) * terrain_width;
        }

        // let bob = {
        //     header_hight: header_hauteur,
        //     div_largeur: div_largeur,
        //     div_hauteur: div_hauteur,
        //     header_hauteur: header_hauteur,
        //     game_height: game_height,
        //     game_width: game_width,
        // }
        // console.log(bob);

        let data = props.data;
        paddle1 = data.player1_pos;
        paddle2 = data.player2_pos;

        score1 = data.player1_goals;
        score2 = data.player2_goals;

        previousBallX3 = previousBallX2;
        previousBallX2 = previousBallX1;
        previousBallX1 = ballX;
        ballX = data.ball_pos_x;

        previousBallY3 = previousBallY2;
        previousBallY2 = previousBallY1;
        previousBallY1 = ballY;
        ballY = data.ball_pos_y;

        ballRadius = data.ball_radius;
        paddleHeight = data.racket_length;
        paddleWidth = data.racket_width;

        obstacles = data.obstacles;
    };

}
