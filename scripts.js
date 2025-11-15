const divPalavra = document.querySelector('.palavra')
const divTeclado = document.querySelector('.teclado')
const divMensagem = document.querySelector('.mensagem')
const contadorErros = document.getElementById('erros')
const botaoStart = document.getElementById('start')
const botaoReiniciar = document.getElementById('reiniciar')

let palavra = ""
let letras = []
let botoes = []
let acertos = 0
let erros = 0

async function carregarPalavra() {
    try {
        const req = await fetch("https://api.dicionario-aberto.net/random")
        const json = await req.json()
        return json.word.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase()
    } catch {
        const lista = ["CASA", "BANANA", "JOGO", "ESCOLA", "PONTE", "CARRO"]
        return lista[Math.floor(Math.random() * lista.length)]
    }
}

function montarTeclado() {
    divTeclado.innerHTML = ""
    botoes = []
    for (let i = 65; i <= 90; i++) {
        const b = document.createElement('button')
        b.innerText = String.fromCharCode(i)
        b.addEventListener('click', () => tentarLetra(b))
        divTeclado.appendChild(b)
        botoes.push(b)
    }
}

function tentarLetra(botao) {
    botao.disabled = true
    let letra = botao.innerText
    let acertou = false

    for (let i = 0; i < palavra.length; i++) {
        if (palavra[i] === letra && letras[i].innerText === "") {
            letras[i].innerText = letra
            acertos++
            acertou = true
        }
    }

    if (!acertou) {
        erros++
        contadorErros.innerText = `Erros: ${erros}/6`
    }

    if (erros === 6) fimDeJogo(false)
    if (acertos === palavra.length) fimDeJogo(true)
}

function fimDeJogo(ganhou) {
    divMensagem.style.display = "block"
    divMensagem.className = "mensagem " + (ganhou ? "ganhou" : "perdeu")
    divMensagem.innerText = ganhou ? "Parabéns! Você venceu!" : `Você perdeu! A palavra era: ${palavra}`
    botoes.forEach(b => b.disabled = true)
    botaoReiniciar.style.display = "inline-block"
}

botaoStart.addEventListener('click', async () => {
    botaoStart.style.display = "none"
    iniciar()
})

botaoReiniciar.addEventListener('click', iniciar)

async function iniciar() {
    divMensagem.style.display = "none"
    contadorErros.style.display = "block"
    botaoReiniciar.style.display = "none"
    erros = 0
    acertos = 0
    contadorErros.innerText = "Erros: 0/6"

    palavra = await carregarPalavra()
    palavra = palavra.replace(/[^A-Z]/g, "")

    divPalavra.innerHTML = ""
    letras = []

    for (let i = 0; i < palavra.length; i++) {
        const d = document.createElement('div')
        divPalavra.appendChild(d)
        letras.push(d)
    }

    montarTeclado()
}
