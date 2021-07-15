const sprite = new Image()
sprite.src = './sprites.png'

const canvas = document.getElementById('canvas-game')
const contexto = canvas.getContext('2d')

let frames = 0

function fazColisao(bird, chao){
   const birdY = bird.destinationY + bird.height
   const chaoY = chao.destinationY
    if(birdY >= chaoY){
        return true
    } 
}

function criaBird(){
    const bird = {
        sourceX: 0,
        sourceY: 0,
        width: 34,
        height: 24,
        destinationX: 10,
        destinationY: 60,
        gravity: 0.25,
        velocity: 0,
        pulo: 4.6,
        pula(){
            bird.velocity = - bird.pulo
        },
        atualizar(){
            if(fazColisao(bird, globais.floor)){
                console.log('bateu no chao')
                changeScreen(Telas.GAME_OVER)
                return
            } 
    
            bird.velocity = bird.velocity + bird.gravity
            bird.destinationY = bird.destinationY + bird.velocity
        },
        moviment: [
            {sourceX: 0, sourceY: 0},
            {sourceX: 0, sourceY: 26},
            {sourceX: 0, sourceY: 52}
        ],
        frameAtual: 0,
        updateFrames(){
            const limitFrame = 10
            const passTheInterval = frames % limitFrame === 0
            if(passTheInterval){
                const incremento = 1 + bird.frameAtual
                const baseRepeticao = bird.moviment.length
                bird.frameAtual = incremento % baseRepeticao
            }
        },
        desenhar(){
            bird.updateFrames()
            const {sourceX, sourceY} = bird.moviment[bird.frameAtual]
            contexto.drawImage(sprite, 
                sourceX, sourceY, //source x and y, distance of the figure from the border
                bird.width, bird.height, //size of the figure in the source 
                bird.destinationX, bird.destinationY, // x and y in the canvas, distance of the figure from the border
                bird.width, bird.height)//size of the figure in the canvas 
        }
    }
    return bird
}

function criaFloor(){
    const floor = {
        sourceX: 0,
        sourceY: 610,
        width: 224,
        height: 112,
        destinationX: 0,
        destinationY: canvas.height - 112,
        desenhar(){
            contexto.drawImage(sprite, floor.sourceX, floor.sourceY, floor.width, floor.height, floor.destinationX, floor.destinationY, floor.width, floor.height)
            contexto.drawImage(sprite, floor.sourceX, floor.sourceY, floor.width, floor.height, (floor.width + floor.destinationX), floor.destinationY, floor.width, floor.height)
        },
        atualizar(){    
            const moverChao = 1

            const moviment = floor.destinationX - moverChao
            const repeat = floor.width / 6
            // console.log('floorX' + floor.destinationX)
            // console.log('moviment: ' + moviment)
            // console.log(moviment%repeat)
            floor.destinationX = moviment % repeat
        }
    }
    return floor
}

function criaCanos(){
    const canos = {
        width: 52,
        height: 400,
        chao: {
            sourceY: 169,
            sourceX: 0
        },
        ceu: {
            sourceY: 169,
            sourceX: 52
        },
        espaço: 80,
        desenhar(){
            canos.pares.forEach((par) => {
                const espaçamentosCanos = 90
                const randomY = par.y
    
                const canoChaoX = par.x
                const canoChaoY = canos.height + espaçamentosCanos + randomY
                contexto.drawImage(sprite, canos.chao.sourceX, canos.chao.sourceY, canos.width, canos.height, canoChaoX, canoChaoY, canos.width, canos.height)
                
                const canoCeuX = par.x
                const canoCeuY = randomY
                contexto.drawImage(sprite, canos.ceu.sourceX, canos.ceu.sourceY, canos.width, canos.height, canoCeuX, canoCeuY, canos.width, canos.height)
                par.canoCeu = {
                    x: canoCeuX,
                    y: canoCeuY + canos.height
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
        },
        temColisao(par){
            const cabecaBird = globais.bird.destinationY
            const peBird = globais.bird.destinationY + globais.bird.height
            if((globais.bird.destinationX + globais.bird.width) >= par.x){
                if(cabecaBird < par.canoCeu.y){
                    return true
                }
                if(peBird > par.canoChao.y){
                    return true
                }
            }
        },
        pares: [],
        atualizar(){
            const passou100frames = frames % 100 === 0
            if(passou100frames){
                canos.pares.push({
                    x: canvas.width,
                    y: -200 * (Math.random() + 1) 
                })
            }
            canos.pares.forEach((par) => {
                par.x = par.x - 2
                if(canos.temColisao(par)){
                    console.log('Voce perdeu')
                    changeScreen(Telas.GAME_OVER)
                }
                if(par.x + canos.width <= 0){
                    canos.pares.shift()
                }
            })
        }
    }
    return canos
}

function criaPlacar(){
    const placar = {
        pontuacao: 0,
        desenhar(){
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right'
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
        },
        atualizar(){
            const intervaloFrames = 25
            const passouIntervalo = frames % intervaloFrames === 0
            if(passouIntervalo){
                placar.pontuacao += passouIntervalo + 1
            }
        }
    }
    return placar
}

const backgroundCitys = {
    sourceX: 390,
    sourceY: 0,
    width: 276,
    height: 204,
    destinationX: 0,
    destinationY: canvas.height - 204,
    desenhar(){
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(sprite, backgroundCitys.sourceX, backgroundCitys.sourceY, backgroundCitys.width, backgroundCitys.height, backgroundCitys.destinationX, backgroundCitys.destinationY, backgroundCitys.width, backgroundCitys.height)
        contexto.drawImage(sprite, backgroundCitys.sourceX, backgroundCitys.sourceY, backgroundCitys.width, backgroundCitys.height, (backgroundCitys.width + backgroundCitys.destinationX), backgroundCitys.destinationY, backgroundCitys.width, backgroundCitys.height)
    }
}

const getReady = {
    sourceX:134,
    sourceY: 0,
    width: 174,
    height: 152,
    destinationX: canvas.width / 2 - 174 / 2,
    destinationY: canvas.height / 2 - 152,
    desenhar(){
        contexto.drawImage(sprite, getReady.sourceX, getReady.sourceY, getReady.width, getReady.height, getReady.destinationX, getReady.destinationY, getReady.width, getReady.height)
    }
}

const gameOver = {
    sourceX: 134,
    sourceY: 153,
    width: 226,
    height: 200,
    destinationX: canvas.width / 2 - 226 / 2,
    destinationY: 50,
    desenhar(){
        contexto.drawImage(sprite, gameOver.sourceX, gameOver.sourceY, gameOver.width, gameOver.height, gameOver.destinationX, gameOver.destinationY, gameOver.width, gameOver.height)
    }
}

let TelaAtiva = {}
const changeScreen = (screen) => {
    TelaAtiva = screen
    if(TelaAtiva.incializar){
        TelaAtiva.incializar()
    }
}
const globais = {}

const Telas = {
    INICIO: {
        incializar(){
            globais.bird = criaBird()
            globais.floor = criaFloor()
            globais.canos = criaCanos()
        },
        desenhar(){
            backgroundCitys.desenhar()
            globais.floor.desenhar()
            globais.bird.desenhar()
            getReady.desenhar()
        },
        click(){
            changeScreen(Telas.JOGO)
        },
        atualizar(){
            globais.floor.atualizar()
        }
    }
}

Telas.JOGO = {
    incializar(){
        globais.placar = criaPlacar()
    },
    desenhar(){
        backgroundCitys.desenhar()
        globais.canos.desenhar()
        globais.floor.desenhar()
        globais.bird.desenhar()
        globais.placar.desenhar()
    },
    click(){
        globais.bird.pula()
    },
    atualizar(){
        globais.canos.atualizar()
        globais.floor.atualizar()
        globais.bird.atualizar()
        globais.placar.atualizar()
    }
}

Telas.GAME_OVER = {
    atualizar(){

    },
    desenhar(){
        gameOver.desenhar()
    },
    click(){
        changeScreen(Telas.INICIO)
    }
}

function looping(){
    TelaAtiva.desenhar()
    TelaAtiva.atualizar()
    // contexto.drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number)
    frames++
    requestAnimationFrame(looping)
}

window.addEventListener('click', () => TelaAtiva.click && TelaAtiva.click())
changeScreen(Telas.INICIO)
looping()