export default function sketch(p5) {
    let canvas;

    const header = document.getElementsByTagName('header');
    let header_height = header[0].offsetHeight;

    const game_div = document.getElementById('game');

    let div_height = game_div.offsetHeight - header_height,
        div_width = game_div.offsetWidth;

    let text_x0 = (div_width - p5.width) / 2,
        text_y0 = (div_height - p5.height) / 2;

    let text_x1 = text_x0,
        text_x2 = text_x0,
        text_x3 = text_x0;

    let text_y1 = text_y0,
        text_y2 = text_y0,
        text_y3 = text_y0;


    let text_width, text_height;

    let dir_x = 7,
        dir_y = 7;

    function centerCanvas() {
        const x = (div_width - p5.width) / 2;
        const y = (div_height - p5.height) / 2;
        canvas.position(x, y);
    }

    p5.setup = () => {
        p5.textSize(42);
        text_width = p5.textWidth("WAITING");
        text_height = 42;

        canvas = p5.createCanvas(div_width, div_height);
        canvas.parent('game');
        centerCanvas();
    };

    p5.draw = () => {
        p5.background(0);
        p5.textSize(32);
        p5.textFont('arcade_normalregular');

        p5.fill(p5.color(69, 41, 77));
        p5.text("WAITING", text_x3, text_y3);
        p5.fill(p5.color(155, 89, 182));
        p5.text("WAITING", text_x2, text_y2);
        p5.fill(p5.color(34, 68, 131));
        p5.text("WAITING", text_x1, text_y1);
        p5.fill(p5.color(255, 255, 255));
        p5.text("WAITING", text_x0, text_y0);

        text_x3 = text_x2;
        text_x2 = text_x1;
        text_x1 = text_x0;

        text_y3 = text_y2;
        text_y2 = text_y1;
        text_y1 = text_y0;

        text_x0 += dir_x;
        text_y0 += dir_y;

        if (text_x0 + text_width >= div_width || text_x0 <= 0) {
            dir_x *= -1;
        }

        if (text_y0 + text_height >= div_height || text_y0 <= 0) {
            dir_y *= -1;
        }
    };
}
