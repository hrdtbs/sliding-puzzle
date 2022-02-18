export class Drawer {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  ctx: CanvasRenderingContext2D;
  canvasCellWidth: number;
  canvasCellHeight: number;
  imageCellWidth: number;
  imageCellHeight: number;
  columnCount: number;
  rowCount: number;
  constructor(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    size: number
  ) {
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      throw new Error("Failed to create context");
    }
    const columnCount = size;
    const rowCount = size;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx = ctx;
    this.canvas = canvas;
    this.image = image;
    this.canvasCellWidth = canvas.width / columnCount;
    this.canvasCellHeight = canvas.height / rowCount;
    this.imageCellWidth = image.naturalWidth / columnCount;
    this.imageCellHeight = image.naturalHeight / rowCount;
    this.columnCount = columnCount;
    this.rowCount = rowCount;
  }
  getPosition = (nx: number, ny: number) => {
    const x = Math.floor(nx / this.canvasCellWidth);
    const y = Math.floor(ny / this.canvasCellHeight);
    return [x, y];
  };
  drawPart = (sx: number, sy: number, dx: number, dy: number) => {
    this.ctx.drawImage(
      this.image,
      this.imageCellWidth * sx,
      this.imageCellHeight * sy,
      this.imageCellWidth,
      this.imageCellHeight,
      this.canvasCellWidth * dx,
      this.canvasCellHeight * dy,
      this.canvasCellWidth,
      this.canvasCellHeight
    );
  };
  fill = () => {
    const x = this.columnCount - 1;
    const y = this.rowCount - 1;
    this.drawPart(x, y, x, y);
  };
  clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };
}
