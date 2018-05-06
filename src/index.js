export default class Brusher {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    this.blurryStyleNode = null;
    this.mouseSteps = [];
    this.drawBoardCanvas = null;
    this.drawBoardCanvasContext = null;
    this.imageCanvas = null;
    this.imageCanvasContext = null;
    this.image = null;
    this.tailAnimationFrame = null;

    this.options = {
      image: null,
      stroke: 80,
      keepCleared: false,
      autoBlur: false,
      autoBlurValue: 15,
      lineStyle: 'round',
      ...options,
      element: 'body',    // Only `body` element is supported for now
    };

    this.drawTail = this.drawTail.bind(this);
    this.validateOptions();
  }

  /**
   * Validates for any invalid options given
   */
  validateOptions() {
    if (!this.options.image) {
      throw new Error('Image path to use as brush is required');
    }
  }

  /**
   * Initializes the brusher, while preparing the
   * canvas and binding the necessary events
   */
  init() {
    if (!Brusher.isCanvasSupported()) {
      return;
    }

    this.prepareCanvas();
    this.bind();
  }

  bind() {
    document.addEventListener('mousemove', (e) => {
      if (!e.clientX || !e.clientY) {
        return;
      }

      // Keep the co-ordinates and time, this will be used while drawing
      // the stroke. Time helps us decrease the length of stroke over time.
      this.mouseSteps.unshift({
        time: Date.now(),
        ...this.getMousePositionInCanvas(e),
      });

      this.drawTail();
    });

    window.addEventListener('resize', () => {
      this.prepareCanvas();
    });
  }

  /**
   * Gets the mouse position relative to canvas
   * @param evMouseMove
   * @returns {{x: number, y: number}}
   */
  getMousePositionInCanvas(evMouseMove) {
    const canvasRect = this.drawBoardCanvas.getBoundingClientRect();

    return {
      x: evMouseMove.clientX - canvasRect.left,
      y: evMouseMove.clientY - canvasRect.top,
    };
  }

  /**
   * Prepares the canvases i.e. one upon which we will draw the image
   * and the other holds just the image for us to draw on to the
   * drawing canvas
   */
  prepareCanvas() {
    if (this.options.autoBlur) {
      this.attachBlurryBackground();
    }

    this.prepareDrawingCanvas();
    this.prepareImageCanvas();
    this.loadSelectedImage();
  }

  /**
   * Creates a blurry background for the body if needed
   * @todo use CSS file and just apply a class
   */
  attachBlurryBackground() {
    if (this.blurryStyleNode) {
      return;
    }

    const blurryCss = `
      body { position: relative;  }
      body:before {
        background-size: cover;
        background-position: 0 0;
        background-attachment: fixed;
        content: '';
        background-image: url('${this.options.image}');
        position: fixed;
        z-index: -1;
        display: block;
        width: 100%;
        height: 100%;
        -webkit-filter: blur(${this.options.autoBlurValue}px);
        filter: blur(${this.options.autoBlurValue}px); 
        top: 0;
        left: 0;
      }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.append(document.createTextNode(blurryCss));
    document.head.appendChild(style);

    this.blurryStyleNode = style;
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

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';

    this.drawBoardCanvas = canvas;
    this.drawBoardCanvasContext = canvas.getContext('2d');

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

    this.imageCanvasContext.lineCap = this.options.lineStyle;
    this.imageCanvasContext.shadowBlur = 30;
    this.imageCanvasContext.shadowColor = '#000000';
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

  /**
   * Draws tail at the path where mouse was last moved
   */
  drawTail() {
    this.removeOldSteps();

    window.cancelAnimationFrame(this.tailAnimationFrame);
    if (this.mouseSteps.length > 0) {
      this.tailAnimationFrame = window.requestAnimationFrame(this.drawTail);
    }

    // Do not clear the drawn image if the blur is to be kept
    if (!this.options.keepCleared) {
      this.imageCanvasContext.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
    }

    this.createStrokeFromSteps();

    let drawHeight = (this.drawBoardCanvas.width / this.image.naturalWidth) * this.image.naturalHeight;
    let drawWidth = this.drawBoardCanvas.width;

    if (drawHeight < this.drawBoardCanvas.height) {
      drawHeight = this.drawBoardCanvas.height;
      drawWidth = (this.drawBoardCanvas.height / this.image.naturalHeight) * this.image.naturalWidth;
    }

    this.drawBoardCanvasContext.drawImage(this.image, 0, 0, drawWidth, drawHeight);
    this.drawBoardCanvasContext.globalCompositeOperation = 'destination-in';
    this.drawBoardCanvasContext.drawImage(this.imageCanvas, 0, 0);
    this.drawBoardCanvasContext.globalCompositeOperation = 'source-over';
  }

  /**
   * Creates stroke from the recorded mouse steps
   */
  createStrokeFromSteps() {
    const currentTime = Date.now();

    for (let counter = 1; counter < this.mouseSteps.length; counter++) {
      const timeDiff = (currentTime - this.mouseSteps[counter].time) / 1000;
      const strokeAlpha = Math.max(1 - timeDiff, 0);

      this.imageCanvasContext.strokeStyle = `rgba(0,0,0,${strokeAlpha})`;
      this.imageCanvasContext.lineWidth = this.options.stroke;
      this.imageCanvasContext.beginPath();
      this.imageCanvasContext.moveTo(this.mouseSteps[counter - 1].x, this.mouseSteps[counter - 1].y);
      this.imageCanvasContext.lineTo(this.mouseSteps[counter].x, this.mouseSteps[counter].y);
      this.imageCanvasContext.stroke();
    }
  }

  /**
   * Remove any steps older than one second to not keep
   * them piling up in memory
   */
  removeOldSteps() {
    const currentTimeStamp = Date.now();

    for (let counter = 0; counter < this.mouseSteps.length; counter++) {
      if (currentTimeStamp - this.mouseSteps[counter].time > 1000) {
        this.mouseSteps.length = counter;
      }
    }
  }

  /**
   * Creates canvas for the set element
   * @returns {HTMLCanvasElement}
   */
  createCanvasNode() {
    const elementDimensions = this.getElementDimensions();

    const canvas = document.createElement('canvas');
    canvas.width = elementDimensions.width;
    canvas.height = elementDimensions.height;

    return canvas;
  }

  /**
   * Gets node from the given query selector
   * @returns {Object|Element}
   */
  getElementNode() {
    const element = this.options.element;
    if (element && typeof element === 'object' && 'nodeType' in element) {
      return element;
    }

    return document.querySelector(element || 'body');
  }

  /**
   * Gets dimensions for the selected element
   * @returns {ClientRect | DOMRect}
   */
  getElementDimensions() {
    return this.getElementNode().getBoundingClientRect();
  }

  /**
   * Checks if canvas is supported or not
   * @returns {boolean}
   */
  static isCanvasSupported() {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }
}
