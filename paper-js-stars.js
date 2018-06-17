var nCircles = 100;
var parallaxScale = 20;
var mouseScale = 40;

var path2 = new Path.Circle({
    center: [0, 0],
    radius: 10,
    fillColor: '',
    strokeColor: 'black',
    opacity: 0
});
var fillColor = "#"+((1<<24)*Math.random()|0).toString(16);

function createSymbol() {

    var fillColor = "#"+((1<<24)*Math.random()|0).toString(16);
    var path = new Path.Circle({
        center: [0, 0],
        radius: 7,
        opacity: 1
    });

    path.fillColor = {
        gradient: {
            stops: [[fillColor, 0], [fillColor, 0.7], ['fff0', 1]],
            radial: true
        },
        origin: path.position,
        destination: path.bounds.rightCenter
    };

    var symbol = new Symbol(path);

    return symbol;
}

var symbol2 = new Symbol(path2);

var vector = new Point(0, 0);
var rotation = new Point(0, 0);
var keyVector = new Point(0, 0);

for (var i = 0; i < nCircles; i++) {
    var symbolCenter = Point.random() * view.size;
    if (i == nCircles-1) {

        var placedSymbol = symbol2.place(symbolCenter);
    }
    else {
        var currentSymbol = createSymbol();
        var placedSymbol = currentSymbol.place(symbolCenter);
        placedSymbol.scale(i / nCircles);
    }
}

function onFrame(event) {
    function checkOutOfBounds(item){
        if (item.bounds.left > view.size.width) {
            item.position.x = 0;
        }
        if (item.bounds.top > view.size.height) {
            item.position.y = 0;
        }
        if (item.bounds.right < 0) {
            item.position.x = view.size.width;
        }
        if (item.bounds.bottom < 0) {
            item.position.y = view.size.height;
        }
    }

    for (var i = 0; i < nCircles; i++) {
        var item = project.activeLayer.children[i];
        item.position.x += vector.x*(item.bounds.width / parallaxScale) - rotation.x + keyVector.x;
        item.position.y += vector.y*(item.bounds.width / parallaxScale) - rotation.y + keyVector.y;

        if (i != nCircles - 1){
            checkOutOfBounds(item);
        }
    }
}

function onMouseMove(event) {
    var d = (event.point - view.center)/view.center;

    function polarize(val) {
        return -1 + 2*val;
    }
    vector.x = polarize(d.x < 0);
    rotation.x = polarize(d.x < 0);
    vector.y = polarize(d.y < 0);
    rotation.y = polarize(d.y < 0);

    var da = new Point(Math.abs(d.x), Math.abs(d.y));
    da *= mouseScale/5;
    var vectorScale = da;
    var rotationScale = da/2;

    vector *= vectorScale;
    rotation *= rotationScale;
}

