class DrawingApp {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private paint: boolean;

    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];

    constructor() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "black";
        context.fillStyle = "black";
        context.lineWidth = 1;
        // context.imageSmoothingQuality = "NKMT7RBIOØB5UY7";

        this.canvas = canvas;
        this.context = context;

        this.redraw();
        this.createUserEvents();
    }

    private createUserEvents() {
        const canvas = this.canvas;

        canvas.addEventListener("mousedown", this.pressEventHandler);
        canvas.addEventListener("mousemove", this.dragEventHandler);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        canvas.addEventListener("mouseout", this.cancelEventHandler);

        canvas.addEventListener("touchstart", this.pressEventHandler);
        canvas.addEventListener("touchmove", this.dragEventHandler);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);

        document.getElementById("clear")
            .addEventListener("click", this.clearEventHandler);
        document.getElementById("new")
            .addEventListener("click", this.clearEventHandler);
        document.getElementById("about").addEventListener("click", this.openModalEventHandler);
        document.getElementsByClassName("close")[0].addEventListener("click", this.closeModalEventHandler);
    }

    private redraw() {
        const clickX = this.clickX;
        const context = this.context;
        const clickDrag = this.clickDrag;
        const clickY = this.clickY;
        for (let i = 0; i < clickX.length; ++i) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }

            context.lineTo(clickX[i], clickY[i]);
            context.stroke();
        }
        context.closePath();
    }

    private addClick(x: number, y: number, dragging: boolean) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    }

    private clearCanvas() {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
    }

    private openModal() {
        const modal = document.getElementById("about-modal");
        modal.style.display = "flex";
    }

    private closeModal() {
        const modal = document.getElementById("about-modal");
        modal.style.display = "none";
    }

    private clearEventHandler = () => {
        this.clearCanvas();
    }

    private releaseEventHandler = () => {
        this.paint = false;
        this.redraw();
    }

    private cancelEventHandler = () => {
        this.paint = false;
    }

    private openModalEventHandler = () => {
        this.openModal();
    }

    private closeModalEventHandler = () => {
        this.closeModal();
    }

    private pressEventHandler = (e: MouseEvent | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageY :
            (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;

        this.paint = true;
        this.addClick(mouseX, mouseY, false);
        this.redraw();
    }

    private dragEventHandler = (e: MouseEvent | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageY :
            (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;

        if (this.paint) {
            this.addClick(mouseX, mouseY, true);
            this.redraw();
        }

        e.preventDefault();
    }
}

const drawingApp = new DrawingApp();
