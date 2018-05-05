class Murk {
    constructor(options = {}) {
        this.mouseSteps = [];
        this.drawBoardCanvas = null;
        this.drawBoardCanvasContext = null;
        this.imageCanvas = null;
        this.imageCanvasContext = null;
        this.image = null;

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
        this.prepareImageCanvas();
        this.loadSelectedImage();
    }

    /**
     * Prepares the canvas attached to the document, upon which we
     * will draw the non-blurred image
     */
    prepareDrawingCanvas() {
        if (this.drawBoardCanvas && this.drawBoardCanvas.parentElement) {
            this.drawBoardCanvas.parentElement.removeChild(this.drawBoardCanvas);
        }

        const canvas = this.createCanvasNode();

        this.drawBoardCanvas = canvas;
        this.drawBoardCanvasContext = canvas.getContext("2d");

        document.body.appendChild(this.drawBoardCanvas);
    }

    /**
     * Prepares the canvas for the image which will help us draw the colored
     * image on top of the blurred image/empty background
     */
    prepareImageCanvas() {
        const canvas = this.createCanvasNode();

        this.imageCanvas = canvas;
        this.imageCanvasContext = canvas.getContext('2d');

        this.imageCanvasContext.lineCap = "round";
        this.imageCanvasContext.shadowBlur = 30;
        this.imageCanvasContext.shadowColor = "#000000";
    }

    /**
     * Loads the given image in the virtual image property and
     * draws the tail if necessary
     */
    loadSelectedImage() {
        if (this.image) {
            return;
        }

        this.image = new Image();
        this.image.addEventListener('load', () => this.drawTail());
        this.image.addEventListener('error', () => console.error('Failed to load image'));

        this.image.src = this.options.image;
    }

    drawTail() {
        // @todo draw tail on the path where mouse was last moved
    }

    createCanvasNode() {
        const elementDimensions = this.getElementDimensions();

        const canvas = document.createElement("canvas");
        canvas.width = elementDimensions.width;
        canvas.height = elementDimensions.height;

        return canvas;
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