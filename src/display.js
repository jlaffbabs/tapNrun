class Display {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.canvas.width = 900
    this.canvas.height = 500
    this.finishLine = 7.8/9 * this.canvas.width
    this.timer = new Timer
    this.player = new Player(-8, 35, 12)
    this.player2 = new Player(-8, 160, 12)
    this.lane3runner = new Player(50, 332, 0.98)
    this.lane4runner = new Player(50, 450, 0.7)
    this.controller = new Controller
    this.interval
    this.stopwatch = setInterval(this.trackFinish.bind(this), 10)
    this.mouseOn = true
    this.myAudio = new Audio('./assets/Audio/raceon.mp3');
    this.time1 = null
    this.time2 = null
    this.countdown = new Countdown(this.player, this.player2, this.lane3runner, this.lane4runner, this.timer)
  }

  startButton() {
    var ctx = this.canvas.getContext('2d');
    let img = new Image()
    img.src = ("./assets/pixel-start.jpg")
    img.onload = function() {
      ctx.drawImage(img, 0, 0, 900, 500)
    }
  }

  aiMovement() {
    this.lane3runner.move()
    this.lane4runner.move()
  }

  infiniteDraw() {
    this.interval = setInterval(this.drawCanvas.bind(this), 10)
  }

  drawPlayers() {
    var p1 = new Image()
    var p2 = new Image()
    p1.src = ("./assets/Joao.png")
    p2.src = ("./assets/Joao1.png")
    this.imgToShape(p1, p2)
  }

  imgToShape(img1, img2) {
    var ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.drawImage(img1, this.player.x, this.player.y, 100, 100)
    ctx.drawImage(img2, this.player2.x, this.player2.y, 100, 100)
    ctx.arc(this.lane3runner.x, this.lane3runner.y, 40, 0, 2 * Math.PI);
    ctx.arc(this.lane4runner.x, this.lane4runner.y, 40, 0, 2 * Math.PI);
    ctx.fill()
  }

  playAudio() {
    this.myAudio.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);
    this.myAudio.play();
  }

  timerShow() {
    var ctx = this.canvas.getContext('2d')
    ctx.font = "30px sans-serif";
    ctx.fillText(this.timer.formatTime(), 745, 490)
  }

  finishTimeShow() {
    var ctx = this.canvas.getContext('2d')
    if (this.player.x > this.finishLine && this.time1=== null) {
      this.time1 = this.timer.formatTime()
      ctx.fillText(this.time1, 650, 95)
    } else if (this.player.x > this.finishLine) {
      ctx.fillText(this.time1, 650, 95)
    }
    if (this.player2.x > this.finishLine && this.time2 === null) {
      this.time2 = this.timer.formatTime()
      ctx.fillText(this.time2, 650, 220)
    } else if (this.player2.x > this.finishLine) {
      ctx.fillText(this.time2, 650, 220)
    }
    if (this.lane3runner.x > 845) {
      ctx.fillText("00:08:110", 650, 340)
    }
    if (this.lane4runner.x > 845) {
      ctx.fillText("00:11:352", 650, 460)
    }
  }

  cdShow() {
    var ctx = this.canvas.getContext('2d')
    ctx.font = "130px sans-serif"
    if (this.countdown.doCount === true) {
      ctx.fillText(this.countdown.count + 1, 450, 250)
    }
  }

  drawCanvas() {
    var ctx = this.canvas.getContext('2d')
    this.playAudio()
    this.drawPlayers()
    this.timerShow()
    this.finishTimeShow()
    this.cdShow()
    this.mouseOn = false
    this.aiMovement();
  }

  trackFinish() {
    if (this.player.x > this.finishLine) {
      this.player.moveAllowed = false
    }
    if (this.player2.x > this.finishLine) {
      this.player2.moveAllowed = false
    }
    if (this.lane3runner.x > 845) {
      this.lane3runner.moveAllowed = false
    }
    if (this.lane4runner.x > 845) {
      this.lane4runner.moveAllowed = false
    }
    if (this.player.x > this.finishLine && this.player2.x > this.finishLine && this.lane4runner.x > 845 && this.lane3runner.x > 845) {
      this.timer.stop()
      clearInterval(this.stopwatch);
      clearInterval(this.interval)
      this.drawCanvas()
      this.mouseOn = true
      this.drawReplay()
    }
  }

  drawReplay() {
    var ctx = this.canvas.getContext('2d');
    let img = new Image()
    img.src = ("./assets/playagain-btn-big.png")
    img.onload = function() {
      ctx.drawImage(img, 225, 125, 450, 250)
    }
    this.restart()
  }

  restart() {
    this.player.reset(-8, 35)
    this.player2.reset(-8, 160)
    this.lane3runner.reset(50, 332)
    this.lane4runner.reset(50, 450)
    this.timer.reset()
    this.time1 = null
    this.time2 = null
    this.stopwatch = setInterval(this.trackFinish.bind(this), 10)
  }
}
