class Murk {
    constructor(options = {}) {
        this.mouseSteps = [];
        this.drawBoardCanvas = null;
        this.drawBoardCanvasContext = null;

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

    /**
     * Prepares the canvases i.e. one upon which we will draw the image
     * and the other holds just the image for us to draw on to the
     * drawing canvas
     */
    prepareCanvas() {
        this.prepareDrawingCanvas();
        this.prepareColoredImageCanvas();
    }

    /**
     * Prepares the canvas attached to the document, upon which we
     * will draw the non-blurred image
     */
    prepareDrawingCanvas() {
        if (this.drawBoardCanvas && this.drawBoardCanvas.parentElement) {
            this.drawBoardCanvas.parentElement.removeChild(this.drawBoardCanvas);
        }

        const elementDimensions = this.getElementDimensions();

        const canvas = document.createElement("canvas");
        canvas.width = elementDimensions.width;
        canvas.height = elementDimensions.height;

        this.drawBoardCanvas = canvas;
        this.drawBoardCanvasContext = canvas.getContext("2d");

        document.body.appendChild(this.drawBoardCanvas);
    }

    prepareColoredImageCanvas() {

    }

    drawTail() {
        // @todo draw tail on the path where mouse was last moved
    }

    getElementNode() {
        const element = this.options.element;
        if (element && typeof element === 'object' && 'nodeType' in element) {
            return element;
        }

        return document.querySelector(element || 'body');
    }

    getElementDimensions() {
        return this.getElementNode().getBoundingClientRect();
    }
}