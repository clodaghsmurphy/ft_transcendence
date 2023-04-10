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
    let servingPlayer = 1;

    function centerCanvas() {
        const x = (p5.windowWidth - p5.width) / 2;
        const y = (p5.windowHeight - p5.height) / 2;
        canvas.position(x, y);
    }

    p5.setup = () => {
        canvas = p5.createCanvas(400, 400);
        canvas.parent('game');
        centerCanvas();
    };

    p5.windowResized = () => {
        centerCanvas();
    };


    p5.draw = () => {
        p5.background(0);
        p5.textSize(32);
        p5.text(score1, p5.width / 4, 40);
        p5.text(score2, 3 * p5.width / 4, 40);
        p5.fill(p5.color(255, 255, 255));

        p5.rectMode(p5.CENTER);
        p5.rect(20, paddle1, paddleWidth, paddleHeight);
        p5.rect(p5.width - 20, paddle2, paddleWidth, paddleHeight);

        p5.ellipse(ballX, ballY, 20, 20);
    };

    p5.updateWithProps = (props) => {
        if (!props || !props.data) {
            return;
        }

        let data = props.data;

        paddle1 = data.player1_pos;
        paddle2 = data.player2_pos;

        score1 = data.player1_goals;
        score2 = data.player2_goals;

        ballX = data.ball_pos_x;
        ballY = data.ball_pos_y;
    };
}
