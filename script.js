var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var model = null;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var drawing = false;

canvas.addEventListener("mousedown", () => {
    drawing = true;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(event) {

    if (!drawing) return;

    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    ctx.lineTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
    );
}

function erase() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.getElementById("result").innerHTML =
        "Cleared";
}

async function loadModel() {

    try {

        model = await tf.loadLayersModel(
            "tensorflow/model.json"
        );

        document.getElementById("result").innerHTML =
            "Model loaded";

        console.log("MODEL LOADED");

    } catch(err) {

        console.error(err);

        document.getElementById("result").innerHTML =
            "MODEL ERROR";
    }
}

async function predictModel() {

    if(model == null) {
        document.getElementById("result").innerHTML =
            "Model not loaded";
        return;
    }

    let imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let tensor = tf.browser.fromPixels(
        imageData,
        1
    );

    tensor = tf.image.resizeBilinear(
        tensor,
        [28, 28]
    );

    tensor = tensor.toFloat();

    tensor = tensor.div(255.0);

    tensor = tensor.expandDims(0);

    let prediction = model.predict(tensor);

    let result = prediction.argMax(1).dataSync()[0];

    document.getElementById("result").innerHTML =
        "Prediction: " + result;
}

loadModel();