class Murk {
    constructor(options = {}) {
        // Holds the positions where mouse was moved
        this.tailSteps = [];

        this.options = {
            element: 'body',
            image: 'original.jpg',
            ...options
        };
    }

    init() {
        this.prepareCanvas();
        this.bind();
    }

    bind() {
        // @todo bindings for mouse move to draw tail
    }

    prepareCanvas() {
        // @todo create canvas upon which the non-blurred image will be drawn
    }

    drawTail() {
        // @todo draw tail on the path where mouse was last moved
    }
}