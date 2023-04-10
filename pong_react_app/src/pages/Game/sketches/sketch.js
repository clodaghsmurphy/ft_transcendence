import { ReactP5Wrapper } from "react-p5-wrapper";

export default function sketch(p5) {
    class Paddle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.w = 10;
            this.h = 80;
            this.velocity = p5.createVector(0, 0);
        }

        update(pos) {
            this.y = pos;
        }

        show() {
            p5.rectMode(p5.CENTER);
            p5.rect(this.x, this.y, this.w, this.h);
        };
    }

    let canvas;
    let ball, paddle1, paddle2;
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
        paddle1 = new Paddle(20, p5.height / 2);
        paddle2 = new Paddle(p5.width - 20, p5.height / 2);
    };

    p5.windowResized = () => {
        centerCanvas();
    };

    p5.draw = () => {
        p5.background(0);
        p5.textSize(32);
        p5.text(score1, p5.width / 4, 40);
        p5.text(score2, 3 * p5.width / 4, 40);

        paddle1.show();
        paddle2.show();
    };

    p5.myCustomRedrawAccordingToNewPropsHandler = (data) => {
        if (canvas && data) {
            paddle1.update(data.player1_pos);
            paddle2.update(data.player2_pos);
        }
    };
}
