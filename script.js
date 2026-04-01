function toggleMode() {
  const html = document.documentElement
  html.classList.toggle("light")
}

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame

onload = function () {
  setTimeout(init, 0)
}

init = function () {
  canvas = document.getElementById("bg-animation")
  ctx = canvas.getContext("2d")

  onresize = function () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  onresize()

  mouse = { x: canvas.width / 2, y: canvas.height / 2, out: false }

  // INTERAÇÃO COM MOUSE (Desktop)
  window.onmousemove = function (e) {
    mouse = { x: e.clientX, y: e.clientY, out: false }
  }
  window.onmouseout = function () {
    mouse.out = true
  }

  // INTERAÇÃO COM TOUCH (Mobile)
  window.addEventListener(
    "touchstart",
    function (e) {
      mouse.out = false

      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    },
    { passive: false },
  )

  window.addEventListener(
    "touchmove",
    function (e) {
      mouse.out = false
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    },
    { passive: false },
  )

  window.addEventListener("touchend", function () {
    mouse.out = true
  })

  gravityStrength = 10
  particles = []
  spawnTimer = 0
  spawnInterval = 10
  type = 0
  requestAnimationFrame(startLoop)
}

newParticle = function () {
  const isLight = document.documentElement.classList.contains("light")
  type = type ? 0 : 1

  let color
  if (isLight) {
    color = type
      ? `rgba(255, 255, 255, ${Math.random() * 0.4})`
      : "rgba(80, 50, 110, 0.25)"
  } else {
    color = type
      ? Math.random() > 0.5
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(168, 85, 247, 0.4)"
      : "rgba(37, 99, 235, 0.3)"
  }

  particles.push({
    x: mouse.x,
    y: mouse.y,
    xv: type ? 4 * Math.random() - 2 : 6 * Math.random() - 3,
    yv: type ? 4 * Math.random() - 2 : 6 * Math.random() - 3,
    c: color,
    s: type ? 5 + 10 * Math.random() : 1,
    a: 1,
  })
}
startLoop = function (newTime) {
  time = newTime
  requestAnimationFrame(loop)
}

loop = function (newTime) {
  draw()
  calculate(newTime)
  requestAnimationFrame(loop)
}

draw = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i]
    ctx.globalAlpha = p.a
    ctx.fillStyle = p.c
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.s, 0, 2 * Math.PI)
    ctx.fill()
  }
}

calculate = function (newTime) {
  var dt = newTime - time
  time = newTime

  if (!mouse.out) {
    spawnTimer += dt < 100 ? dt : 100
    for (; spawnTimer > 0; spawnTimer -= spawnInterval) {
      newParticle()
    }
  }

  particleOverflow = particles.length - 700
  if (particleOverflow > 0) {
    particles.splice(0, particleOverflow)
  }

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i]
    if (!mouse.out) {
      x = mouse.x - p.x
      y = mouse.y - p.y
      a = x * x + y * y
      a = a > 100 ? gravityStrength / a : gravityStrength / 100
      p.xv = (p.xv + a * x) * 0.99
      p.yv = (p.yv + a * y) * 0.99
    }
    p.x += p.xv
    p.y += p.yv
    p.a *= 0.99
  }
}
