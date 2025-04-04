const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const soundEffect = new Audio('./assets/audio.mp3')


const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")


const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

let direction, loopId
const size = 30


const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max-min) + min)
}
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number/size) * size
}
const randomColor = () => {
    const red = randomNumber(10, 255)
    const green = randomNumber(10, 255)
    const blue = randomNumber(10, 255)
    return `rgb(${red}, ${green}, ${blue})`
}
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

const checkCollisions = () => {
    const head = snake.at(-1)
    const limit = canvas.width - size
    const headIndex = snake.length - 2
    const wallCollision = head.x < 0 || head.x > limit || head.y < 0 || head.y > limit
    const selfCollision = snake.find((position, index)=>{
        return index < headIndex && position.x == head.x && position.y == head.y
    })
    
    if(wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}

const moveSnake = () => {
    if(!direction) return

    const head = snake.at(-1)
    
    if (direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }
    if (direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }
    if (direction == "down"){
        snake.push({x: head.x, y: head.y+size})
    }
    if (direction == "up"){
        snake.push({x: head.x, y: head.y-size})
    }
    snake.shift()
}
const drawSnake = () => {
    context.fillStyle = "#e0cbd6"
   
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            context.fillStyle = "#E37383"
        }
        context.fillRect(position.x, position.y, size, size)
    })
}
const drawGrid = () => {
    context.lineWidth = 1;
    context.strokeStyle = "#7f557b"

    for(let i = size; i < canvas.width; i += size){
        context.beginPath()
        context.lineTo(i, 0)
        context.lineTo(i, 600)
        context.stroke()

        context.beginPath()
        context.lineTo(0, i)
        context.lineTo(600, i)
        context.stroke()
    }

    
}
const drawFood = () => {
    const {x, y, color} = food

    context.shadowColor = color
    context.shadowBlur = 10
    context.fillStyle = color
    context.fillRect(x, y, size, size)
    context.shadowBlur = 0

}
const hasEaten = () => {
    const head = snake.at(-1)
    
    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        soundEffect.play()
        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }
        food.y = y
        food.x = x
        food.color = randomColor()
    }
}
const loop = () => {
    clearInterval(loopId)
    context.clearRect(0, 0, canvas.width, canvas.height)

    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    hasEaten()
    checkCollisions()

   loopId = setTimeout(() => {
        loop()
    }, 200)
}


loop()


document.addEventListener('keydown', (event) => {
    let key = event.key.toLowerCase()
    if((key === 'arrowdown' || key === 's') && direction !== 'up') {
        direction = "down"
    }
    if((key === 'arrowup' || key === 'w') && direction != "down"){
        direction = "up"
    }
    if((key === 'arrowright' || key === 'd') && direction != "left"){
        direction = "right"
    }
    if((key === 'arrowleft' || key === 'a') &&direction != "right"){
        direction = "left"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})