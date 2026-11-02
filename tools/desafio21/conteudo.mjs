// Conteúdo do "Desafio 21 Dias · Protocolo Inteligente" — versão Ricardo Pace.
// Texto original (reescrito), neutro em gênero, ligado à consultoria. Nada de promessa de resultado.

export const REFS = {
  burke: "Burke LE, Wang J, Sevick MA. Self-monitoring in weight loss: a systematic review. J Am Diet Assoc, 2011. doi:10.1016/j.jada.2010.10.008",
  khatib: "Al Khatib HK et al. The effects of partial sleep deprivation on energy balance: a systematic review and meta-analysis. Eur J Clin Nutr, 2017. doi:10.1038/ejcn.2016.201",
  robinson: "Robinson E et al. Eating attentively: a systematic review and meta-analysis. Am J Clin Nutr, 2013. doi:10.3945/ajcn.112.045245",
  gardner: "Gardner B, Lally P, Wardle J. Making health habitual: the psychology of 'habit-formation' and general practice. Br J Gen Pract, 2012. doi:10.3399/bjgp12X659466",
  adriaanse: "Adriaanse MA et al. Do implementation intentions help to eat a healthy diet? A systematic review and meta-analysis. Appetite, 2011. doi:10.1016/j.appet.2010.10.012",
};

export const SEMANAS = [
  { n: 1, nome: "Entender o porquê", dias: [1, 7], frase: "Antes de mudar, perceber." },
  { n: 2, nome: "Criar espaço", dias: [8, 14], frase: "Entre a vontade e a ação existe uma escolha." },
  { n: 3, nome: "Sustentar", dias: [15, 21], frase: "Não é acertar sempre. É saber voltar." },
];

export const DIAS = [
  {
    t: "Prazer fora do prato",
    txt: [
      "Pense nos melhores momentos da sua semana. Quantos têm comida no meio? Aniversário, churrasco, a pizza de sexta, o doce depois de um dia pesado.",
      "Não tem nada de errado nisso. O problema começa quando a comida vira a <b>única</b> fonte de prazer, alívio e descanso. Aí qualquer dia ruim vira motivo para comer.",
      "Nesses 21 dias a gente não vai cortar nada do seu plano. A ideia é outra: <b>aumentar o seu cardápio de prazer</b>, fora do prato.",
    ],
    tarefas: [
      "Faça hoje 10 minutos de algo que te dá prazer e não envolve comer: música alta, ligar para alguém, um banho demorado, arrumar uma gaveta, caminhar sem pressa. Depois anote: como você se sentiu? Veio vontade de comer?",
      "Responda: em que momentos do meu dia eu como sem estar com fome? O que eu estou buscando nesses momentos?",
    ],
  },
  {
    t: "O que deu certo hoje",
    txt: [
      "A gente repassa mil vezes o que deu errado: o doce, o treino que faltou, a refeição fora do plano. E quase nunca repassa o que deu certo.",
      "Isso distorce a foto. Você passa a achar que nada está funcionando, e quem só enxerga erro desiste cedo.",
      "Hoje o treino é inverter o foco. Não é positividade forçada. É <b>registro honesto</b> das pequenas coisas que funcionaram.",
    ],
    tarefas: [
      "Escreva 10 coisas concretas que foram boas ou deram certo hoje. Fuja do genérico: “tomei café com calma”, “disse não a um compromisso”, “fiz o treino mesmo cansado”. Releia à noite.",
      "Lembre uma frustração recente. O que ela te ensinou? Você lidou com ela melhor do que lidaria um ano atrás?",
    ],
  },
  {
    t: "Mudar ou aceitar",
    txt: [
      "Todo mundo tem alguma coisa em si que não aceita. Pode ser o corpo, a ansiedade, a dificuldade de dizer não.",
      "Só que existem duas categorias aí: o que dá para mudar (rotina, treino, sono, forma de comer) e o que não dá (altura, idade, a história que já passou).",
      "Gastar energia brigando com o que não muda rouba energia do que muda. <b>Ou você muda, ou você aceita.</b> Ficar no meio só aumenta o desgaste.",
    ],
    tarefas: [
      "Liste o que você não aceita em você hoje. Ao lado de cada item, marque: posso mudar? Se sim, qual o primeiro passo? Se não, por que continuo gastando energia nisso?",
      "Escolha um único item e escreva uma forma nova de se relacionar com ele. Ex.: “meu corpo não está como eu quero, e mesmo assim merece cuidado”.",
    ],
  },
  {
    t: "O que a comida resolve para você",
    txt: [
      "Quando você come sem fome, a comida está resolvendo alguma coisa: estresse, tédio, solidão, cansaço, a sensação de que você “merece”.",
      "E ela resolve, por alguns minutos. É rápida, barata e está sempre ali. Por isso o hábito é tão forte.",
      "Se você não descobrir <b>o que</b> a comida está resolvendo, vai continuar precisando dela para isso. Hoje é dia de investigar.",
    ],
    tarefas: [
      "Lembre 3 vezes recentes em que você comeu sem fome. Em cada uma, o que você queria sentir? Alívio, prazer, companhia, desligar, recompensa?",
      "Crie um atalho. Complete: “Quando eu quiser sentir ________, vou tentar ________ antes de comer.” Ex.: alívio → banho de 5 minutos com música.",
    ],
  },
  {
    t: "Comer para não sentir",
    txt: [
      "Raiva que não dá para soltar. Tristeza que você não quer encarar. Ansiedade no fim do dia. Muita gente vai para a cozinha nessas horas, sem pensar.",
      "Comer funciona como anestesia: tira o foco do desconforto. Só que o efeito passa, a emoção continua ali, e agora vem junto a culpa.",
      "O treino de hoje é simples e difícil ao mesmo tempo: <b>dar nome ao que você está sentindo</b>. O que tem nome perde força.",
    ],
    tarefas: [
      "Qual emoção você mais evita sentir? Quais aparecem com mais frequência antes de você comer sem fome?",
      "Na próxima vontade fora de hora, pare 2 minutos antes. Pergunte: o que estou sentindo agora? Do que eu preciso de verdade? Anote o que percebeu.",
    ],
  },
  {
    t: "O “eu mereço”",
    txt: [
      "“Hoje foi pesado, eu mereço.” “Fiquei o dia todo no foco, agora vou me dar um agrado.” Essa voz é comum e convincente.",
      "No fundo, ela está pedindo reconhecimento pelo esforço. O problema é que o prêmio vem em forma de comida e, muitas vezes, chega acompanhado de culpa. O prêmio vira castigo.",
      "Você merece, sim. A pergunta é: <b>merece o quê?</b> Talvez descanso, atenção, um momento seu. Nem sempre isso cabe num pacote de biscoito.",
    ],
    tarefas: [
      "Quando você come como recompensa, que reconhecimento está buscando? Escreva 10 recompensas que não envolvem comida e que realmente funcionam para você.",
      "Use uma delas hoje. Depois anote: como foi ser recompensado desse jeito?",
    ],
  },
  {
    t: "Cansaço não é fome",
    txt: [
      "Repare: nos dias mais puxados, a vontade de comer à noite costuma ser maior. Muitas vezes não é o corpo pedindo energia, é a cabeça pedindo pausa.",
      "Comida dá prazer, mas não devolve descanso. E sono curto pesa: numa meta-análise de estudos de curto prazo, dormir menos que o habitual aumentou a ingestão em média de <b>385 kcal por dia</b>, sem aumentar o gasto de energia.",
      "Cuidar do cansaço e do sono também é cuidar da alimentação.",
    ],
    ref: "khatib",
    tarefas: [
      "O que mais tem te deixado esgotado nos últimos dias? O que você poderia aliviar, delegar ou pedir ajuda?",
      "Faça hoje uma pausa de 10 minutos sem celular e sem comida. E defina um horário para desacelerar 30 minutos antes de dormir: tela longe, luz baixa.",
    ],
    revisao: 1,
  },
  {
    t: "A pausa de 2 minutos",
    txt: [
      "Pensou em chocolate, quando viu já estava na cozinha. Isso é piloto automático: o cérebro adora atalhos e, com o tempo, transforma repetição em reflexo.",
      "Entre o pensamento e a ação existe um intervalo. Às vezes de segundos. <b>É nesse intervalo que mora a escolha.</b>",
      "A pausa não é proibição. Você pode comer depois. A diferença é que vai ser uma decisão, e não um reflexo.",
    ],
    tarefas: [
      "Anote as frases que aparecem na sua cabeça antes de comer sem fome: “só um pedaço”, “já que…”, “amanhã eu compenso”, “só hoje”.",
      "Hoje, a cada vontade fora de hora, diga: “vou esperar 2 minutos antes de decidir”. Respire, observe e só então escolha. Conte quantas vezes a vontade passou.",
    ],
  },
  {
    t: "Pensamento ou sentimento?",
    txt: [
      "A vontade de comer pode vir de duas fontes. De um <b>sentimento</b>: tristeza, rejeição, solidão. Ou de um <b>pensamento</b>: “já estraguei o dia mesmo”, “eu mereço”.",
      "O sentimento pede alívio. O pensamento vem com justificativa pronta, argumenta e convence.",
      "A boa notícia: pensamento a gente aprende a responder, e não a obedecer. Pensamento não é ordem.",
    ],
    tarefas: [
      "Faça o rastreio: cada vez que surgir vontade de comer, anote se ela veio de algo que você sentiu ou de algo que você pensou. Escreva qual foi.",
      "Pegue um pensamento sabotador e escreva uma resposta adulta a ele. Ex.: “Já que comi um pedaço, vou comer tudo.” → “Um pedaço não estraga nada. Comer tudo é que me afasta do que eu quero.”",
    ],
  },
  {
    t: "Como você fala com você",
    txt: [
      "Depois de um deslize, o que você diz para si mesmo? “Fraco.” “Sempre estraga tudo.” “Nunca vai conseguir.”",
      "Muita gente acha que muda na base da bronca. Mas culpa pesada costuma gerar mais um ciclo: se sentir mal, buscar consolo… na comida.",
      "Autocompaixão não é passar pano. É <b>falar com você como falaria com um amigo</b> que está tentando: com firmeza e sem humilhação.",
    ],
    tarefas: [
      "Escreva as frases que você costuma se dizer depois de errar. Ao lado de cada uma, reescreva como diria para um amigo. Ex.: “Errou, sim. Isso não apaga o que você já fez. Próxima refeição, segue o plano.”",
      "Grave um áudio de 1 minuto para você mesmo, para ouvir no próximo deslize. Diga o que você precisaria ouvir.",
    ],
  },
  {
    t: "Seu corpo é parceiro",
    txt: [
      "Muita gente só olha para o próprio corpo para criticar, medir ou esconder. Ele vira campo de batalha. E é difícil cuidar bem daquilo contra o que você briga todo dia.",
      "Você não precisa amar tudo nele agora. Mas ele te carrega, aguenta treino, trabalho, noites mal dormidas. <b>Treino não é castigo por ter comido.</b> É investimento no corpo que você já tem.",
      "Quem se trata como inimigo se sabota. Quem se respeita, mesmo insatisfeito, cuida com mais constância.",
    ],
    tarefas: [
      "Como você costuma falar do seu corpo, para você e para os outros? Escreva 3 coisas que ele já faz bem hoje.",
      "No treino de hoje, repare em uma coisa que você já faz melhor do que na primeira semana: uma carga, uma execução, o fôlego. Anote.",
    ],
  },
  {
    t: "Você no fim da fila",
    txt: [
      "Agenda cheia para todo mundo, menos para você. Almoço em pé. Sono atrasado. “Depois eu vejo isso.” “Hoje não deu.”",
      "Quando você vive em último lugar, a comida vira a única pausa, o único carinho do dia. E aí ela ganha um poder que não deveria ter.",
      "Ninguém vai te colocar como prioridade por você. Mas você pode começar com <b>um compromisso pequeno, marcado na agenda como reunião</b>.",
    ],
    tarefas: [
      "O que você deixou de fazer por você? Quais sinais mostram que você não tem se priorizado?",
      "Coloque na agenda os treinos desta semana com horário fixo, e mais um compromisso só seu. Trate como reunião que não se desmarca.",
    ],
  },
  {
    t: "Deslize não é tombo",
    txt: [
      "Comeu fora do plano. Na mesma hora: “pronto, estraguei tudo”. E aí vem o “já que…”, o exagero, e a promessa de compensar amanhã com restrição.",
      "Esse ciclo pesa mais do que o deslize em si. Uma pizza na sexta não define nada. O que pesa é sexta + culpa no sábado + abandono no domingo + “segunda eu recomeço”.",
      "Regra simples: <b>depois de um deslize, a próxima refeição é a do plano.</b> Normal. Sem compensar, sem jejum, sem treino para “pagar”.",
    ],
    tarefas: [
      "Descreva o seu ciclo: o que você pensa, sente e faz logo depois de comer fora do planejado?",
      "Complete e deixe salvo no celular: “Depois de um deslize, eu ________.” Ex.: “bebo água, sigo para a próxima refeição do plano e não comento o assunto comigo de novo”.",
    ],
  },
  {
    t: "Quem você está se tornando",
    txt: [
      "“Sou descontrolado.” “Sou ansiosa.” “Não consigo emagrecer.” Rótulos assim viram profecia: você passa a agir de acordo com eles.",
      "A saída não é negar a realidade. É trocar o rótulo por <b>uma ação que dá para treinar</b>.",
      "“Sou descontrolado” vira “estou aprendendo a pausar antes de comer”. “Não tenho disciplina” vira “treino 3 vezes por semana, mesmo sem vontade”.",
    ],
    tarefas: [
      "Liste 3 rótulos que você repete sobre você.",
      "Reescreva cada um como uma ação treinável, no presente. Escolha a frase que mais faz sentido e deixe à vista esta semana.",
    ],
    revisao: 2,
  },
  {
    t: "O ambiente a seu favor",
    txt: [
      "Até aqui a gente olhou para dentro. Hoje é para fora. O que está à vista, à mão e no caminho influencia muito o que você faz.",
      "Se todo armário que você abre tem um gatilho, você vai passar o dia gastando energia para resistir. Força de vontade cansa. <b>Ambiente organizado trabalha por você o dia inteiro.</b>",
      "Não é sobre proibir nada em casa. É sobre deixar o caminho fácil para o que você quer fazer mais.",
    ],
    tarefas: [
      "Diagnóstico: o que na sua casa, trabalho e rotina facilita o comer por impulso? O que poderia ajudar?",
      "Faça uma mudança concreta hoje. Ex.: tirar gatilhos da vista, deixar fruta ou garrafa de água à vista, separar a roupa do treino na noite anterior, deixar o lanche do plano pronto.",
    ],
  },
  {
    t: "Nem 8, nem 80",
    txt: [
      "Dias de controle total, até que “só hoje” vira exagero. Depois culpa, depois restrição. É o 8 ou 80, e ele cansa corpo e cabeça.",
      "A permissão faz parte do processo. Quem se proíbe tudo tende a perder o controle quando se permite.",
      "Atenção também conta: numa meta-análise, <b>comer distraído aumentou a quantidade ingerida</b> na refeição e, ainda mais, nas refeições seguintes. Comer presente ajuda a parar no ponto.",
    ],
    ref: "robinson",
    tarefas: [
      "Como você costuma se permitir? A permissão vira exagero? Qual o seu maior medo ao comer algo que considera “proibido”?",
      "Dentro da margem do seu plano, escolha algo que você costuma comer escondido. Sirva uma porção, coma sentado, sem tela, devagar. Ao terminar, siga o dia normal. Anote como foi.",
    ],
  },
  {
    t: "Prova de que você cumpre",
    txt: [
      "Quem já tentou várias vezes carrega uma voz no fundo: “isso não vai durar”. E mesmo indo bem, age como quem vai desistir.",
      "Confiança não nasce de discurso motivacional. Nasce de <b>evidência</b>: você percebendo que faz o que diz que vai fazer.",
      "Por isso o gesto de hoje é pequeno de propósito. O objetivo é cumprir.",
    ],
    tarefas: [
      "Que história você conta sobre a sua capacidade de manter um processo? Agora liste as evidências contrárias: o que você já cumpriu nestes 16 dias?",
      "Escolha um gesto pequeno que você sabe que consegue, e cumpra hoje. Ex.: o treino do app, a refeição do plano sem tela, a pausa de 2 minutos. Anote: “hoje eu fiz o que disse que ia fazer”.",
    ],
  },
  {
    t: "As pessoas em volta",
    txt: [
      "“Só hoje você não vai comer?” “Vai ficar doente.” “Daqui a pouco desiste.” Pequenas frases que puxam de volta para o padrão antigo.",
      "Nem todo mundo vai entender ou apoiar. Tudo bem. Você não precisa brigar nem se afastar de ninguém, mas também não precisa <b>comer para não ofender</b>.",
      "Ter uma frase pronta tira o peso da hora.",
    ],
    tarefas: [
      "Quem hoje te fortalece no processo? Quem te puxa, mesmo sem perceber? Como você costuma reagir à pressão?",
      "Pense no próximo evento (almoço de família, happy hour). Escreva a frase que vai usar. Ex.: “Obrigado, estou bem assim.” “Hoje eu escolhi isso e estou feliz com a escolha.”",
    ],
  },
  {
    t: "Plano de retomada",
    txt: [
      "Perder peso e manter são coisas diferentes. O que costuma derrubar não é o deslize. É não saber o que fazer depois dele.",
      "Uma ferramenta com boa evidência é o plano <b>se → então</b>: você decide antes o que vai fazer numa situação de risco. Numa meta-análise, esse tipo de plano ajudou mais a incluir comportamentos saudáveis do que a cortar os não saudáveis.",
      "Por isso, planeje o que você vai <b>fazer</b>, e não só o que vai evitar.",
    ],
    ref: "adriaanse",
    tarefas: [
      "Como você costuma agir quando sai do plano? Volta rápido ou se abandona?",
      "Escreva 3 planos se → então para as suas situações de risco. Ex.: “Se eu chegar em casa com muita fome às 20h, então como o lanche que deixei pronto.” “Se eu perder o treino de segunda, então faço na terça no mesmo horário.”",
    ],
  },
  {
    t: "O que a balança não mostra",
    txt: [
      "Amanhã é o fechamento. Antes dele, um aviso: se você olhar só para o número da balança, vai deixar de fora muita coisa.",
      "Perceber a vontade antes de agir, voltar mais rápido depois de um deslize, dormir um pouco melhor, falar consigo com menos crueldade. Isso também é progresso, e é o que sustenta o resto.",
      "Hoje é dia de enxergar o todo.",
    ],
    tarefas: [
      "O que mudou em você nestes 20 dias? Que hábitos começaram? Como está sua relação com a comida agora?",
      "Prepare o Dia 21: separe fita métrica e a ficha de medidas. Amanhã, meça nas mesmas condições do Dia 1: ao acordar, depois de ir ao banheiro, antes de comer ou beber, na mesma balança.",
    ],
  },
  {
    t: "O desafio acaba. O processo continua.",
    txt: [
      "Você chegou ao fim dos 21 dias. Vale lembrar: hábito não se forma em 21 dias. No estudo mais citado sobre isso, o novo comportamento levou cerca de 66 dias para ficar automático, com enorme variação entre as pessoas. Estes 21 dias foram a largada.",
      "Hoje tem 4 passos: <b>registrar</b> peso e medidas com calma, <b>comparar</b> a avaliação de antes e agora, escrever uma <b>carta</b> para você e assumir <b>3 hábitos</b> para os próximos 30 dias.",
      "Me mande seu resumo no WhatsApp. É com ele que a gente ajusta a próxima fase da sua consultoria.",
    ],
    ref: "gardner",
    tarefas: [
      "Preencha a ficha de medidas e a avaliação final (próximas páginas).",
      "Escreva uma carta curta para você ler quando pensar em desistir. Comece com: “Nesses 21 dias eu aprendi que…”",
      "Defina seus 3 hábitos para os próximos 30 dias na tabela de continuidade.",
    ],
  },
];

export const CHECKLIST = [
  { q: "Há quanto tempo foi minha última refeição?", a: "Se comi há pouco, vale fazer a pausa antes de decidir." },
  { q: "Sinto sinais no corpo?", a: "Estômago vazio, leve fraqueza, dificuldade de concentrar. Se não sinto nada disso, pode não ser fome." },
  { q: "De onde veio a vontade?", a: "Vi ou senti o cheiro de algo? Estou entediado, ansioso, estressado? Ou o corpo foi avisando aos poucos?" },
  { q: "Qualquer comida resolveria?", a: "Fome costuma aceitar qualquer refeição. Vontade emocional costuma pedir um alimento específico, e na hora." },
  { q: "Bebi água e esperei 10 minutos. E agora?", a: "Se a vontade continua ou aumenta, é provável que seja fome. Se diminuiu, era outra coisa." },
];
