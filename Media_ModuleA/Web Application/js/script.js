var currentWay = 2;
var numberWay = 3;
$(document).on('ready', function () {
    catchEventArrowClick();
    catchEventStart();
});

function catchEventStart() {
    $('#startButton').on('click', function () {
        run();
        init();
    });
}

function catchEventArrowClick() {
    $(document).on('keydown', function (e) {
        if (e.keyCode == 32) {
            jump();
            return false;
        }
        if (e.keyCode == 38) {
            moveUp();
            return false;
        }
        if (e.keyCode == 40) {
            moveDown();
            return false;
        }
        return true;
    });
}
var running = false;
function jump() {
    if (!running) {
        running = true;
        $("#runner").animate({'bottom': '+=70px', 'left': '+=50px'}, 400, function () {
            $("#runner").animate({'bottom': '-=70px', 'left': '+=50px'}, 400, function () {
                running = false;
            });
        });
    }

}

function moveUp() {
    if (currentWay > 1) {
        currentWay--;
        move();
    }

}

function moveDown() {
    if (currentWay < numberWay) {
        currentWay++;
        move();
    }
}
var bottomOfWays = ['118px', '95px', '60px'];
function move() {
    $('#runner img').css({'width': (100 - (numberWay - currentWay) * 15) + '%'});
    $('#runner').css({'bottom': bottomOfWays[currentWay - 1]});
}

var currentStep = 1;
var obstacles = new Array();
var intervalId;
var crash = false;
function run() {
    if (crash) {
        return;
    }
    currentStep++;
    if (currentStep > 4) {
        currentStep = 1;
    }
    $("#runner").css("left", "+=32px");
    $('#runner img').attr("src", "imgs/runner/runner_" + currentStep + ".png");

    setTimeout(function () {
        if (isCrash()) {
            crash = true;
            return;
        }
        run();

    }, 200);

}

function init() {
    var obstaclesX = new Array();
    for (var i = 1; i < 4; i++) {
        var x = Math.round(Math.random() * 2000 + 100);
        $('#runway' + i + ' .obstacle').css('left', x + 'px');
        obstaclesX[i] = x;
        obstacles.push([i, $('#runway' + i + ' .obstacle').offset().left + $('#runway' + i + ' .obstacle').width(), $('#runway' + i + ' .obstacle').offset().top]);
    }
    var numberWays = [1, 2, 3];
    for (var i = 0; i < 2; i++) {
        var index = Math.round(Math.random() * numberWays.length);
        if (index > numberWays.length - 1) {
            index = numberWays.length - 1;
        }
        if (index < 0) {
            index = 0;
        }
        var numberWay = numberWays[index];
        var x = Math.round(Math.random() * (4500 - obstaclesX[numberWay]));
        $('#runway' + numberWay + ' .obstacle').clone().css({'left': (x + obstaclesX[numberWay]) + 'px'}).appendTo($('#runway' + numberWay));
        obstacles.push([numberWay, $('#runway' + numberWay + ' .obstacle').offset().left + $('#runway' + numberWay + ' .obstacle').width(), $('#runway' + numberWay + ' .obstacle').offset().top]);
        numberWays.splice(index, 1);

    }


}

function isCrash() {
    var bottom = $('#runner').offset().top + $('#runner').height();
    var left = $('#runner').offset().left;
    var right = $('#runner').offset().left + $('#runner').width();
    for (var i = 0; i < obstacles.length; i++) {
        if (!running && currentWay == obstacles[i][0] && left < obstacles[i][1] && obstacles[i][1] <= right && bottom > obstacles[i][2]) {
            console.log('crash at ' + i);
            return true;
        }
    }
    return false;
}