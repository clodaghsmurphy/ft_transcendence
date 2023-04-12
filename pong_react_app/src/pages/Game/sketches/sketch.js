import { ReactP5Wrapper } from "react-p5-wrapper";

export default function sketch(p5) {

    let canvas;
    let ballX = 200,
        ballY = 200;
    let paddle1 = 200,
        paddle2 = 200;
    let paddleWidth = 10,
        paddleHeight = 80;
    let score1 = 0,
        score2 = 0;

    const header = document.querySelector('.nav-bar');
    let header_hauteur = header.offsetHeight;
    const gameDiv = document.getElementById("game");
    let div_largeur = gameDiv.offsetWidth,
    div_hauteur = gameDiv.offsetHeight;
    if (header_hauteur == div_hauteur)
        header_hauteur = 0;
    let game_height = div_hauteur - header_hauteur,
        game_width = div_largeur;

    let ratio_hauteur = (1 / 400) * game_height,
        ratio_largeur = (1 / 400) * game_width;

    function centerCanvas() {
        const gameDiv = document.getElementById("game");
        const x = 0;
        const y = 0;
        canvas.position(x, y);
    }

    p5.setup = () => {
        const gameDiv = document.getElementById("game");
        canvas = p5.createCanvas(game_width, game_height);
        canvas.parent('game');
    };

    p5.draw = () => {
        p5.background(0);
        p5.textSize(32);
        p5.text(score1, p5.width / 4, 40);
        p5.text(score2, 3 * p5.width / 4, 40);
        p5.fill(p5.color(255, 255, 255));

        p5.rectMode(p5.CENTER);
        p5.rect(20 * ratio_largeur, paddle1 * ratio_hauteur, paddleWidth * ratio_largeur, paddleHeight * ratio_hauteur);
        p5.rect(p5.width - 20 * ratio_largeur, paddle2 * ratio_hauteur, paddleWidth * ratio_largeur, paddleHeight * ratio_hauteur);

        p5.ellipse(ballX * ratio_largeur, ballY * ratio_hauteur, 20 * ratio_largeur , 20 * ratio_hauteur);


        p5.ellipse(game_width, game_height, 20, 20);

    };

    p5.updateWithProps = (props) => {
        if (!props || !props.data) {
            return;
        }
        

        // Check if resize needed
        if (div_largeur != gameDiv.offsetWidth || div_hauteur != gameDiv.offsetHeight
            || header_hauteur != header.offsetHeight)
        {
            div_largeur = gameDiv.offsetWidth;
            div_hauteur = gameDiv.offsetHeight;
            header_hauteur = header.offsetHeight;
            if (header_hauteur == div_hauteur)
                header_hauteur = 0;
            game_height = div_hauteur - header_hauteur;
            game_width = div_largeur;
            console.log("Resive");
            p5.resizeCanvas(game_width, game_height);
            ratio_hauteur = (1 / 400) * game_height;
            ratio_largeur = (1 / 400) * game_width;
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

        ballX = data.ball_pos_x;
        ballY = data.ball_pos_y;
    };

}
