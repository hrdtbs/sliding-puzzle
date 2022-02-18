import { html, css, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";
import { Board } from "./core/board";
import { Drawer } from "./core/drawer";
import { assertIsDefined } from "./utils/assertIsDefined";

@customElement("sliding-puzzle")
export class SlidingPuzzle extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: flex;
      width: 100%;
    }
    canvas {
      display: block;
      width: 100%;
    }
    img {
      position: absolute;
      top: 0px;
      left: 0px;
      display: block;
      max-width: 100%;
      width: 100%;
      z-index: -1;
      opacity: 0;
    }
  `;

  @property()
  src: string | undefined;

  @property()
  size = 3;

  @state()
  private board = new Board();

  @state()
  private drawer: Drawer | undefined = undefined;

  protected firstUpdated(_changedProperties: PropertyValues<any>): void {
    this.board = new Board(this.size);
  }

  canvasRef: Ref<HTMLCanvasElement> = createRef();

  render() {
    return html`
      <canvas ${ref(this.canvasRef)} @click=${this.onClickCanvas}></canvas>
      <img src="${this.src}" @load=${this.onLoadImage} />
    `;
  }

  private draw() {
    this.drawer?.clear();
    this.board.forEach(this.drawer?.drawPart);
  }

  private onClickCanvas(event: MouseEvent) {
    const [x, y] = this.drawer!.getPosition(event.offsetX, event.offsetY);
    const moved = this.board.move(x, y);
    if (moved) {
      this.draw();
      if (this.board.solved) {
        this.drawer?.fill();
      }
    }
  }

  private onLoadImage(event: Event) {
    const image = event.currentTarget as HTMLImageElement;
    const canvas = this.canvasRef.value;
    assertIsDefined(canvas);
    this.drawer = new Drawer(canvas, image, this.size);
    this.draw();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sliding-puzzle": SlidingPuzzle;
  }
}
