// Variáveis globais
let slideAtual = 0;
let totalSlides = document.querySelectorAll('.polaroid').length;
let cartaAberta = false;
let confetesAtivos = false;
let musicaAtual = null;

// Inicialização quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar contador
  atualizarContador();
  setInterval(atualizarContador, 1000);
  
  // Inicializar data atual
  const dataAtual = new Date();
  document.getElementById('data-atual').textContent = dataAtual.toLocaleDateString('pt-BR');
  
  // Inicializar carrossel
  atualizarCarrossel();
  
  // Inicializar efeitos de scroll
  inicializarEfeitosScroll();
  
  // Inicializar partículas
  inicializarParticulas();
  
  // Adicionar evento de fechamento para fotos expandidas
  document.addEventListener('click', function(e) {
    const fotoExpandida = document.querySelector('.foto-expandida');
    if (fotoExpandida && fotoExpandida.classList.contains('ativa') && e.target === fotoExpandida) {
      fotoExpandida.classList.remove('ativa');
      setTimeout(() => {
        fotoExpandida.remove();
      }, 300);
    }
  });
});

// Função para atualizar o contador de tempo juntos
function atualizarContador() {
  // Data de início do relacionamento (29/03/2025 às 10h da manhã)
  const dataInicio = new Date(2025, 2, 29, 10, 0, 0); // Mês é 0-indexed (0=Jan, 1=Fev, 2=Mar)
  
  const agora = new Date();
  const diferenca = agora - dataInicio;
  
  // Converter para dias, horas, minutos e segundos
  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
  
  // Atualizar elementos HTML
  document.getElementById('dias-juntos').textContent = dias;
  document.getElementById('horas-juntos').textContent = horas.toString().padStart(2, '0');
  document.getElementById('minutos-juntos').textContent = minutos.toString().padStart(2, '0');
  document.getElementById('segundos-juntos').textContent = segundos.toString().padStart(2, '0');
}

// Funções do carrossel
function moverCarrossel(direcao) {
  slideAtual = (slideAtual + direcao + totalSlides) % totalSlides;
  atualizarCarrossel();
}

function irParaSlide(indice) {
  slideAtual = indice;
  atualizarCarrossel();
}

function atualizarCarrossel() {
  const slides = document.querySelectorAll('.polaroid');
  const indicadores = document.querySelectorAll('.indicador');
  
  // Remover classe active de todos os slides e indicadores
  slides.forEach(slide => slide.classList.remove('active'));
  indicadores.forEach(ind => ind.classList.remove('ativo'));
  
  // Adicionar classe active ao slide atual e indicador correspondente
  slides[slideAtual].classList.add('active');
  indicadores[slideAtual].classList.add('ativo');
}

// Função para expandir foto ao clicar
function expandirFoto(elemento) {
  const imgSrc = elemento.querySelector('img').src;
  const legenda = elemento.querySelector('.legenda p').textContent;
  
  const fotoExpandida = document.createElement('div');
  fotoExpandida.className = 'foto-expandida';
  fotoExpandida.innerHTML = `
    <span class="fechar-foto">&times;</span>
    <img src="${imgSrc}" alt="${legenda}">
  `;
  
  document.body.appendChild(fotoExpandida);
  
  // Adicionar classe ativa após um pequeno delay para permitir a transição
  setTimeout(() => {
    fotoExpandida.classList.add('ativa');
  }, 10);
  
  // Adicionar evento de clique para fechar
  fotoExpandida.querySelector('.fechar-foto').addEventListener('click', function() {
    fotoExpandida.classList.remove('ativa');
    setTimeout(() => {
      fotoExpandida.remove();
    }, 300);
  });
}

// Função para revelar motivo ao clicar
function revelarMotivo(elemento) {
  elemento.classList.toggle('virado');
}

// Função para abrir o envelope e mostrar a carta
function abrirEnvelope() {
  if (cartaAberta) return;
  
  const envelope = document.getElementById('envelope');
  const carta = document.getElementById('carta');
  
  envelope.classList.add('aberto');
  
  // Soltar corações quando o envelope é aberto
  soltarCoracoes(50);
  
  // Mostrar a carta após a animação do envelope
  setTimeout(() => {
    carta.classList.add('aberta');
    
    // Iniciar a animação de digitação do texto da carta
    const textoCompleto = `
     <p>Meu amor,</p>

<p>Hoje a gente comemora <span class="destaque">dois meses</span> juntos, e eu queria aproveitar esse momento pra dizer o quanto você é importante pra mim. Esses sessenta dias foram incríveis, e cada instante do seu lado eu guardo com muito carinho.</p>

<p>Foi tão incrível te ver pela primeira vez, e você me surpreendeu demais vindo me encontrar mesmo depois de ter caído de moto. Só de lembrar disso, já me sinto sortuda.

<p>Desde aquele dia, cada mensagem, cada conversa, cada risada juntos foi especial. Eu amo como você me faz sorrir até nos dias ruins, como você me escuta de verdade, e como está sempre ali, me apoiando em tudo.</p>

<p>Esses dois meses são só o começo da nossa história. Mal posso esperar pra gente criar mais momentos juntos, superar tudo lado a lado, celebrar nossas conquistas e construir um futuro cheio de amor.

<p>Obrigada por ser quem você é. Por me escolher todos os dias. E por fazer meu coração bater mais forte só de pensar em você.</p>

<p>Feliz dois meses, meu amor. Que venham muitos mais</p>



    `;
    
    const options = {
      strings: [textoCompleto],
      typeSpeed: 20,
      showCursor: true,
      cursorChar: '❤️',
      onComplete: function() {
        // Adicionar mais corações quando terminar de digitar
        soltarCoracoes(30);
      }
    };
    
    new Typed('#texto-carta', options);
    cartaAberta = true;
  }, 1000);
}

// Função para soltar corações
function soltarCoracoes(quantidade = 20) {
  const coracoes = ['❤️', '💖', '💕', '💓', '💗', '💘', '💝', '💙', '💞'];
  
  for (let i = 0; i < quantidade; i++) {
    const coracao = document.createElement('div');
    coracao.className = 'coracao-voador';
    coracao.textContent = coracoes[Math.floor(Math.random() * coracoes.length)];
    coracao.style.left = Math.random() * 100 + 'vw';
    coracao.style.fontSize = (Math.random() * 15 + 15) + 'px';
    coracao.style.animationDuration = (Math.random() * 3 + 3) + 's';
    document.body.appendChild(coracao);

    // Remover o coração após a animação
    setTimeout(() => coracao.remove(), 6000);
  }
}

// Função para inicializar efeitos de scroll
function inicializarEfeitosScroll() {
  const elementos = document.querySelectorAll('.motivo, .momento, .intro, .galeria, .envelope-section, .mensagem-final, .musicas-section');
  
  elementos.forEach(elemento => {
    elemento.classList.add('fade-in');
  });
  
  // Função para verificar se elemento está visível na tela
  function verificarVisibilidade() {
    elementos.forEach(elemento => {
      const posicao = elemento.getBoundingClientRect();
      const visivel = (posicao.top <= window.innerHeight * 0.8);
      
      if (visivel) {
        elemento.classList.add('visivel');
      }
    });
  }
  
  // Verificar visibilidade inicial e adicionar evento de scroll
  verificarVisibilidade();
  window.addEventListener('scroll', verificarVisibilidade);
}

// Função para inicializar partículas
function inicializarParticulas() {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 30,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#89CFF0"
        },
        "shape": {
          "type": "heart"
        },
        "opacity": {
          "value": 0.5,
          "random": true
        },
        "size": {
          "value": 10,
          "random": true
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "bubble"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "bubble": {
            "distance": 150,
            "size": 15,
            "duration": 2,
            "opacity": 0.8,
            "speed": 3
          },
          "push": {
            "particles_nb": 4
          }
        }
      },
      "retina_detect": true
    });
  }
}

// Função para explodir corações e mostrar mensagem surpresa
function explodir() {
  // Esconder o botão
  const botao = document.getElementById('coracao-botao');
  botao.classList.add('escondido');
  
  // Mostrar mensagem surpresa
  document.getElementById('mensagem-surpresa').classList.add('visivel');
  
  // Soltar muitos corações
  soltarCoracoes(100);
  
  // Adicionar confetes se ainda não estiverem ativos
  if (!confetesAtivos) {
    criarConfetes();
    confetesAtivos = true;
  }
}

// Função para criar confetes
function criarConfetes() {
  const cores = ['#89CFF0', '#B0E0E6', '#7CB9E8', '#FFD700', '#ADD8E6', '#87CEEB'];
  const confetesContainer = document.createElement('div');
  confetesContainer.className = 'confetes-container';
  document.body.appendChild(confetesContainer);
  
  for (let i = 0; i < 100; i++) {
    const confete = document.createElement('div');
    confete.className = 'confete';
    confete.style.left = Math.random() * 100 + 'vw';
    confete.style.width = Math.random() * 10 + 5 + 'px';
    confete.style.height = Math.random() * 10 + 5 + 'px';
    confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
    confete.style.opacity = Math.random() * 0.6 + 0.4;
    
    // Animação de queda
    confete.style.animation = `queda ${Math.random() * 3 + 2}s linear forwards`;
    confete.style.animationDelay = Math.random() * 5 + 's';
    
    // Adicionar ao container
    confetesContainer.appendChild(confete);
  }
  
  // Adicionar keyframes para animação de queda
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes queda {
      0% {
        transform: translateY(-100px) rotate(0deg);
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
      }
    }
  `;
  document.head.appendChild(style);
}

// Funções para o player de música
function tocarMusica(id) {
  const audioPlayer = document.getElementById('audio-player');
  const musica = document.querySelector(`.musica-card[data-id="${id}"]`);
  const musicaSrc = musica.getAttribute('data-src');
  const playBtn = musica.querySelector('.play-btn i');
  
  // Se já estiver tocando a mesma música, pausar
  if (musicaAtual === id && !audioPlayer.paused) {
    audioPlayer.pause();
    playBtn.className = 'fas fa-play';
    musica.classList.remove('tocando');
    return;
  }
  
  // Resetar todos os botões e estados
  document.querySelectorAll('.musica-card').forEach(card => {
    card.classList.remove('tocando');
    card.querySelector('.play-btn i').className = 'fas fa-play';
  });
  
  // Configurar nova música
  audioPlayer.src = musicaSrc;
  
  // Tocar a música
  audioPlayer.play()
    .then(() => {
      // Reprodução iniciada com sucesso
      musicaAtual = id;
      playBtn.className = 'fas fa-pause';
      musica.classList.add('tocando');
      
      // Adicionar evento para quando a música terminar
      audioPlayer.onended = function() {
        // Encontrar próxima música
        const musicas = document.querySelectorAll('.musica-card');
        let proximoIndice = 0;
        
        for (let i = 0; i < musicas.length; i++) {
          if (musicas[i].getAttribute('data-id') === id) {
            proximoIndice = (i + 1) % musicas.length;
            break;
          }
        }
        
        // Tocar próxima música
        tocarMusica(musicas[proximoIndice].getAttribute('data-id'));
      };
    })
    .catch(error => {
      // Erro ao iniciar reprodução
      console.error('Erro ao reproduzir áudio:', error);
    });
}

function ajustarVolume(valor) {
  const audioPlayer = document.getElementById('audio-player');
  audioPlayer.volume = valor;
}
