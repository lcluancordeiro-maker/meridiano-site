import type { Locale } from "./config";

export type Dictionary = {
  nav: {
    trilhas: string;
    calculadora: string;
    resolverFoto: string;
    quadro: string;
    turmas: string;
    progresso: string;
    entrar: string;
    sair: string;
    abrirMenu: string;
    fecharMenu: string;
  };
  home: {
    heroTag: string;
    heroTitle: string;
    heroSubtitle: string;
    verTrilhas: string;
    comecarFundamental2: string;
    escolhaNivel: string;
    niveisDisponiveis: string;
    estatisticaHeading: string;
    estatisticaSubtitle: string;
    programacaoHeading: string;
    programacaoSubtitle: string;
    econometriaHeading: string;
    econometriaSubtitle: string;
    financasHeading: string;
    financasSubtitle: string;
    emBreve: string;
    comecarTrilha: string;
    sobreHeading: string;
    sobreBody: string;
    footer: string;
    privacyLink: string;
  };
  auth: {
    entrarTitle: string;
    entrarSubtitle: string;
    cadastroTitle: string;
    cadastroSubtitle: string;
    contasIndisponiveis: string;
    naoTemConta: string;
    jaTemConta: string;
    criarConta: string;
    entrarLink: string;
    nome: string;
    email: string;
    senha: string;
    entrarButton: string;
    criarContaButton: string;
    enviando: string;
    continuarComGoogle: string;
    continuarComMicrosoft: string;
    ouContinueComEmail: string;
    oauthErro: string;
  };
  foto: {
    title: string;
    subtitle: string;
    exclusivo: string;
    fazerLogin: string;
    ou: string;
    criarUmaConta: string;
    tirarFoto: string;
    formatoInfo: string;
    resolver: string;
    analisando: string;
    trocarFoto: string;
  };
  quadro: {
    title: string;
    subtitle: string;
    desfazer: string;
    limpar: string;
    baixarPng: string;
    resolverIA: string;
    analisando: string;
    autoAnalisar: string;
    facaLogin: string;
    paraResolver: string;
    borracha: string;
    fina: string;
    media: string;
    grossa: string;
    corPreto: string;
    corAzul: string;
    corVermelho: string;
    corVerde: string;
  };
  solution: {
    enunciado: string;
    passoAPasso: string;
    resposta: string;
  };
  errors: {
    unsupportedType: string;
    imageTooLarge: string;
    missingImage: string;
    dailyLimitExceeded: string;
    unauthorized: string;
    anthropicNotConfigured: string;
    aiError: string;
    generic: string;
  };
  theme: {
    ativarClaro: string;
    ativarEscuro: string;
  };
  language: {
    label: string;
  };
  premium: {
    navBadge: string;
    pageTitle: string;
    pageSubtitle: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    paymentMethods: string;
    subscribeButton: string;
    manageButton: string;
    activeStatus: string;
    notConfigured: string;
    requiresLogin: string;
    paywallHeading: string;
    paywallBody: string;
    actionError: string;
  };
  turmas: {
    title: string;
    notConfigured: string;
    requiresLogin: string;
    teachingHeading: string;
    memberHeading: string;
    noTurmasTeaching: string;
    noTurmasMember: string;
    createHeading: string;
    nameLabel: string;
    createButton: string;
    joinHeading: string;
    codeLabel: string;
    joinButton: string;
    joinCodePrefix: string;
    viewButton: string;
    notFoundOrNoAccess: string;
    backToTurmas: string;
    rosterHeading: string;
    noStudents: string;
    xpLabel: string;
    streakLabel: string;
    assignmentsHeading: string;
    noAssignments: string;
    createAssignmentHeading: string;
    levelLabel: string;
    topicLabel: string;
    difficultyLabel: string;
    assignButton: string;
    studentAssignmentsHeading: string;
    practiceLink: string;
    shareCodeHint: string;
  };
  pwa: {
    installTitle: string;
    installBody: string;
    installButton: string;
    dismissButton: string;
    notificationsOnBody: string;
    notificationsOffBody: string;
    notificationsEnableButton: string;
    notificationsDisableButton: string;
    notificationsDenied: string;
    notificationsError: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  "pt-BR": {
    nav: {
      trilhas: "Trilhas",
      calculadora: "Calculadora",
      resolverFoto: "Resolver por foto",
      quadro: "Quadro",
      turmas: "Turmas",
      progresso: "Progresso",
      entrar: "Entrar",
      sair: "Sair",
      abrirMenu: "Abrir menu",
      fecharMenu: "Fechar menu",
    },
    home: {
      heroTag: "Do fundamental ao superior",
      heroTitle:
        "Aprenda matemática no seu ritmo, com teoria clara e exercícios que dão feedback na hora.",
      heroSubtitle:
        "Trilhas organizadas por nível de ensino, explicações objetivas e prática guiada — tudo direto no navegador, sem precisar instalar nada.",
      verTrilhas: "Ver trilhas disponíveis",
      comecarFundamental2: "Começar Fundamental II",
      escolhaNivel: "Escolha seu nível de ensino",
      niveisDisponiveis: "Já disponíveis: Ensino Fundamental II, Ensino Médio e Ensino Superior — o Fundamental I chega em breve.",
      estatisticaHeading: "Estatística",
      estatisticaSubtitle: "Uma trilha independente, organizada em três níveis — do descritivo ao inferencial.",
      programacaoHeading: "Programação & Machine Learning",
      programacaoSubtitle: "Do fundamental ao superior — lógica de programação, algoritmos e os conceitos por trás do machine learning.",
      econometriaHeading: "Econometria",
      econometriaSubtitle: "Regressão e modelos preditivos, com pré-requisito de Estatística e Cálculo.",
      financasHeading: "Matemática Financeira",
      financasSubtitle: "Juros simples e compostos, descontos e financiamentos — para entender o dinheiro no dia a dia.",
      emBreve: "Em breve",
      comecarTrilha: "Começar trilha",
      sobreHeading: "Sobre o Meridiano Matemática",
      sobreBody:
        "Um app web instalável (PWA) que funciona em qualquer dispositivo — computador, celular ou tablet — e pode ser adicionado à tela inicial no iOS e Android como um app nativo. Cada trilha combina teoria objetiva com exercícios corrigidos na hora para consolidar o aprendizado.",
      footer: "Meridiano Matemática.",
      privacyLink: "Política de Privacidade",
    },
    auth: {
      entrarTitle: "Entrar",
      entrarSubtitle: "Acesse sua conta para sincronizar seu progresso entre dispositivos.",
      cadastroTitle: "Criar conta",
      cadastroSubtitle: "Seu progresso, XP e conquistas passam a ficar salvos na nuvem.",
      contasIndisponiveis: "Contas ainda não estão disponíveis neste app — volte em breve.",
      naoTemConta: "Não tem conta?",
      jaTemConta: "Já tem conta?",
      criarConta: "Criar conta",
      entrarLink: "Entrar",
      nome: "Nome",
      email: "E-mail",
      senha: "Senha",
      entrarButton: "Entrar",
      criarContaButton: "Criar conta",
      enviando: "Enviando...",
      continuarComGoogle: "Continuar com Google",
      continuarComMicrosoft: "Continuar com Microsoft",
      ouContinueComEmail: "ou continue com e-mail",
      oauthErro: "Não foi possível concluir o login. Tente novamente.",
    },
    foto: {
      title: "Resolver por foto",
      subtitle: "Tire uma foto de um problema de matemática e receba a solução passo a passo.",
      exclusivo: "Essa funcionalidade é exclusiva para quem tem conta.",
      fazerLogin: "Fazer login",
      ou: "ou",
      criarUmaConta: "criar uma conta",
      tirarFoto: "Tirar foto ou escolher da galeria",
      formatoInfo: "JPEG, PNG, GIF ou WEBP — até 8MB",
      resolver: "Resolver",
      analisando: "Analisando...",
      trocarFoto: "Trocar foto",
    },
    quadro: {
      title: "Quadro de rascunho",
      subtitle:
        "Um espaço para escrever e fazer contas, como um quadro negro digital. Desenhe com o mouse, dedo ou caneta — e peça a solução por IA quando quiser.",
      desfazer: "Desfazer",
      limpar: "Limpar",
      baixarPng: "Baixar PNG",
      resolverIA: "Resolver com IA",
      analisando: "Analisando...",
      autoAnalisar: "Analisar automaticamente ao pausar",
      facaLogin: "Faça login",
      paraResolver: "para pedir a solução do que você desenhou.",
      borracha: "Borracha",
      fina: "Fina",
      media: "Média",
      grossa: "Grossa",
      corPreto: "Cor Preto",
      corAzul: "Cor Azul",
      corVermelho: "Cor Vermelho",
      corVerde: "Cor Verde",
    },
    solution: {
      enunciado: "Enunciado",
      passoAPasso: "Passo a passo",
      resposta: "Resposta",
    },
    errors: {
      unsupportedType: "Formato de imagem não suportado. Use JPEG, PNG, GIF ou WEBP.",
      imageTooLarge: "A imagem é muito grande (máximo 8MB).",
      missingImage: "Selecione ou desenhe algo antes de enviar.",
      dailyLimitExceeded: "Você atingiu o limite diário de fotos resolvidas. Tente novamente amanhã.",
      unauthorized: "Sua sessão expirou. Entre novamente para continuar.",
      anthropicNotConfigured: "Essa funcionalidade ainda não está disponível.",
      aiError: "Não foi possível analisar a imagem agora. Tente novamente em instantes.",
      generic: "Algo deu errado ao processar a imagem. Tente novamente.",
    },
    theme: {
      ativarClaro: "Ativar tema claro",
      ativarEscuro: "Ativar tema escuro",
    },
    language: {
      label: "Idioma",
    },
    premium: {
      navBadge: "Premium",
      pageTitle: "Assinatura Premium",
      pageSubtitle: "Desbloqueie todas as trilhas e uma cota bem maior de resolução por IA.",
      benefit1: "Todas as trilhas, incluindo Estatística Intermediário/Avançado e futuras trilhas avançadas",
      benefit2: "Cota bem maior de resolução por foto e pelo quadro de rascunho",
      benefit3: "Apoie diretamente o desenvolvimento de novos conteúdos",
      paymentMethods: "Aceita cartão de crédito/débito, boleto e Pix.",
      subscribeButton: "Assinar Premium",
      manageButton: "Gerenciar assinatura",
      activeStatus: "Você já é Premium — obrigado pelo apoio!",
      notConfigured: "Assinaturas ainda não estão disponíveis neste app — volte em breve.",
      requiresLogin: "Faça login para assinar o Premium.",
      paywallHeading: "Conteúdo Premium",
      paywallBody: "Esse tópico faz parte do plano Premium.",
      actionError: "Não foi possível continuar. Tente novamente.",
    },
    turmas: {
      title: "Turmas",
      notConfigured: "Turmas ainda não estão disponíveis neste app — volte em breve.",
      requiresLogin: "Faça login para criar ou entrar em uma turma.",
      teachingHeading: "Turmas que você leciona",
      memberHeading: "Turmas em que você está matriculado",
      noTurmasTeaching: "Você ainda não criou nenhuma turma.",
      noTurmasMember: "Você ainda não entrou em nenhuma turma.",
      createHeading: "Criar turma",
      nameLabel: "Nome da turma",
      createButton: "Criar turma",
      joinHeading: "Entrar com código",
      codeLabel: "Código da turma",
      joinButton: "Entrar",
      joinCodePrefix: "Código",
      viewButton: "Ver turma",
      notFoundOrNoAccess: "Turma não encontrada ou você não tem acesso a ela.",
      backToTurmas: "← Voltar para turmas",
      rosterHeading: "Alunos",
      noStudents: "Ainda não há alunos nesta turma. Compartilhe o código de acesso.",
      xpLabel: "XP",
      streakLabel: "Sequência",
      assignmentsHeading: "Tarefas atribuídas",
      noAssignments: "Nenhuma tarefa atribuída ainda.",
      createAssignmentHeading: "Atribuir tarefa",
      levelLabel: "Nível",
      topicLabel: "Tópico",
      difficultyLabel: "Dificuldade",
      assignButton: "Atribuir",
      studentAssignmentsHeading: "Tarefas da turma",
      practiceLink: "Praticar",
      shareCodeHint: "Compartilhe este código com seus alunos para que eles entrem na turma.",
    },
    pwa: {
      installTitle: "Instalar o app",
      installBody: "Adicione o Meridiano Matemática à tela inicial para acesso rápido, em tela cheia e offline.",
      installButton: "Instalar",
      dismissButton: "Agora não",
      notificationsOnBody: "Lembretes de sequência ativados — avisamos quando sua sequência estiver em risco.",
      notificationsOffBody: "Ative lembretes para não perder sua sequência de dias praticando.",
      notificationsEnableButton: "Ativar lembretes",
      notificationsDisableButton: "Desativar lembretes",
      notificationsDenied: "Permissão de notificações negada — habilite nas configurações do navegador para ativar os lembretes.",
      notificationsError: "Não foi possível ativar os lembretes agora. Tente novamente.",
    },
  },
  en: {
    nav: {
      trilhas: "Tracks",
      calculadora: "Calculator",
      resolverFoto: "Photo solver",
      quadro: "Whiteboard",
      turmas: "Classes",
      progresso: "Progress",
      entrar: "Log in",
      sair: "Log out",
      abrirMenu: "Open menu",
      fecharMenu: "Close menu",
    },
    home: {
      heroTag: "From elementary to college",
      heroTitle:
        "Learn math at your own pace, with clear theory and exercises that give instant feedback.",
      heroSubtitle:
        "Tracks organized by grade level, clear explanations and guided practice — all in your browser, nothing to install.",
      verTrilhas: "See available tracks",
      comecarFundamental2: "Start Middle School",
      escolhaNivel: "Choose your grade level",
      niveisDisponiveis: "Already available: Middle School, High School and College — Elementary School is coming soon.",
      estatisticaHeading: "Statistics",
      estatisticaSubtitle: "An independent track with three levels — from descriptive to inferential.",
      programacaoHeading: "Programming & Machine Learning",
      programacaoSubtitle: "From elementary to college — programming logic, algorithms, and the concepts behind machine learning.",
      econometriaHeading: "Econometrics",
      econometriaSubtitle: "Regression and predictive models, with a Statistics and Calculus prerequisite.",
      financasHeading: "Personal Finance Math",
      financasSubtitle: "Simple and compound interest, discounts and loans — to understand everyday money.",
      emBreve: "Coming soon",
      comecarTrilha: "Start track",
      sobreHeading: "About Meridiano Matemática",
      sobreBody:
        "An installable web app (PWA) that works on any device — computer, phone or tablet — and can be added to the home screen on iOS and Android like a native app. Each track combines clear theory with exercises graded instantly to reinforce learning.",
      footer: "Meridiano Matemática.",
      privacyLink: "Privacy Policy",
    },
    auth: {
      entrarTitle: "Log in",
      entrarSubtitle: "Access your account to sync your progress across devices.",
      cadastroTitle: "Create account",
      cadastroSubtitle: "Your progress, XP and achievements will be saved to the cloud.",
      contasIndisponiveis: "Accounts aren't available in this app yet — check back soon.",
      naoTemConta: "Don't have an account?",
      jaTemConta: "Already have an account?",
      criarConta: "Create account",
      entrarLink: "Log in",
      nome: "Name",
      email: "Email",
      senha: "Password",
      entrarButton: "Log in",
      criarContaButton: "Create account",
      enviando: "Submitting...",
      continuarComGoogle: "Continue with Google",
      continuarComMicrosoft: "Continue with Microsoft",
      ouContinueComEmail: "or continue with email",
      oauthErro: "We couldn't complete the login. Please try again.",
    },
    foto: {
      title: "Photo solver",
      subtitle: "Take a photo of a math problem and get a step-by-step solution.",
      exclusivo: "This feature is exclusive to account holders.",
      fazerLogin: "Log in",
      ou: "or",
      criarUmaConta: "create an account",
      tirarFoto: "Take a photo or choose from gallery",
      formatoInfo: "JPEG, PNG, GIF or WEBP — up to 8MB",
      resolver: "Solve",
      analisando: "Analyzing...",
      trocarFoto: "Change photo",
    },
    quadro: {
      title: "Scratch whiteboard",
      subtitle:
        "A space to write and work out math, like a digital chalkboard. Draw with your mouse, finger or pen — and ask the AI to solve it whenever you want.",
      desfazer: "Undo",
      limpar: "Clear",
      baixarPng: "Download PNG",
      resolverIA: "Solve with AI",
      analisando: "Analyzing...",
      autoAnalisar: "Auto-analyze on pause",
      facaLogin: "Log in",
      paraResolver: "to ask for the solution to what you drew.",
      borracha: "Eraser",
      fina: "Thin",
      media: "Medium",
      grossa: "Thick",
      corPreto: "Black color",
      corAzul: "Blue color",
      corVermelho: "Red color",
      corVerde: "Green color",
    },
    solution: {
      enunciado: "Problem",
      passoAPasso: "Step by step",
      resposta: "Answer",
    },
    errors: {
      unsupportedType: "Unsupported image format. Use JPEG, PNG, GIF or WEBP.",
      imageTooLarge: "The image is too large (8MB max).",
      missingImage: "Select or draw something before submitting.",
      dailyLimitExceeded: "You've reached today's photo-solve limit. Try again tomorrow.",
      unauthorized: "Your session expired. Log in again to continue.",
      anthropicNotConfigured: "This feature isn't available yet.",
      aiError: "Couldn't analyze the image right now. Try again in a moment.",
      generic: "Something went wrong processing the image. Try again.",
    },
    theme: {
      ativarClaro: "Switch to light theme",
      ativarEscuro: "Switch to dark theme",
    },
    language: {
      label: "Language",
    },
    premium: {
      navBadge: "Premium",
      pageTitle: "Premium Subscription",
      pageSubtitle: "Unlock every track and a much higher AI-solve quota.",
      benefit1: "Every track, including Statistics Intermediate/Advanced and future advanced tracks",
      benefit2: "A much higher quota for photo and whiteboard solving",
      benefit3: "Directly support the development of new content",
      paymentMethods: "Accepts credit/debit card, and (in Brazil) boleto and Pix.",
      subscribeButton: "Subscribe to Premium",
      manageButton: "Manage subscription",
      activeStatus: "You're already Premium — thanks for the support!",
      notConfigured: "Subscriptions aren't available in this app yet — check back soon.",
      requiresLogin: "Log in to subscribe to Premium.",
      paywallHeading: "Premium content",
      paywallBody: "This topic is part of the Premium plan.",
      actionError: "Couldn't continue right now. Try again.",
    },
    turmas: {
      title: "Classes",
      notConfigured: "Classes aren't available in this app yet — check back soon.",
      requiresLogin: "Log in to create or join a class.",
      teachingHeading: "Classes you teach",
      memberHeading: "Classes you're enrolled in",
      noTurmasTeaching: "You haven't created any classes yet.",
      noTurmasMember: "You haven't joined any classes yet.",
      createHeading: "Create a class",
      nameLabel: "Class name",
      createButton: "Create class",
      joinHeading: "Join with a code",
      codeLabel: "Class code",
      joinButton: "Join",
      joinCodePrefix: "Code",
      viewButton: "View class",
      notFoundOrNoAccess: "Class not found, or you don't have access to it.",
      backToTurmas: "← Back to classes",
      rosterHeading: "Students",
      noStudents: "No students in this class yet. Share the join code.",
      xpLabel: "XP",
      streakLabel: "Streak",
      assignmentsHeading: "Assigned tasks",
      noAssignments: "No tasks assigned yet.",
      createAssignmentHeading: "Assign a task",
      levelLabel: "Level",
      topicLabel: "Topic",
      difficultyLabel: "Difficulty",
      assignButton: "Assign",
      studentAssignmentsHeading: "Class tasks",
      practiceLink: "Practice",
      shareCodeHint: "Share this code with your students so they can join the class.",
    },
    pwa: {
      installTitle: "Install the app",
      installBody: "Add Meridiano Matemática to your home screen for quick, full-screen, offline access.",
      installButton: "Install",
      dismissButton: "Not now",
      notificationsOnBody: "Streak reminders are on — we'll warn you when your streak is at risk.",
      notificationsOffBody: "Turn on reminders so you never lose your practice streak.",
      notificationsEnableButton: "Enable reminders",
      notificationsDisableButton: "Disable reminders",
      notificationsDenied: "Notification permission denied — enable it in your browser settings to turn on reminders.",
      notificationsError: "Couldn't enable reminders right now. Please try again.",
    },
  },
  es: {
    nav: {
      trilhas: "Rutas",
      calculadora: "Calculadora",
      resolverFoto: "Resolver por foto",
      quadro: "Pizarra",
      turmas: "Clases",
      progresso: "Progreso",
      entrar: "Iniciar sesión",
      sair: "Cerrar sesión",
      abrirMenu: "Abrir menú",
      fecharMenu: "Cerrar menú",
    },
    home: {
      heroTag: "De primaria a la universidad",
      heroTitle:
        "Aprende matemáticas a tu ritmo, con teoría clara y ejercicios que dan retroalimentación al instante.",
      heroSubtitle:
        "Rutas organizadas por nivel educativo, explicaciones claras y práctica guiada — todo desde el navegador, sin instalar nada.",
      verTrilhas: "Ver rutas disponibles",
      comecarFundamental2: "Empezar Secundaria",
      escolhaNivel: "Elige tu nivel educativo",
      niveisDisponiveis: "Ya disponibles: Secundaria, Bachillerato y Universidad — Primaria llega pronto.",
      estatisticaHeading: "Estadística",
      estatisticaSubtitle: "Una ruta independiente, organizada en tres niveles — de lo descriptivo a lo inferencial.",
      programacaoHeading: "Programación & Machine Learning",
      programacaoSubtitle: "De primaria a la universidad — lógica de programación, algoritmos y los conceptos detrás del machine learning.",
      econometriaHeading: "Econometría",
      econometriaSubtitle: "Regresión y modelos predictivos, con requisito previo de Estadística y Cálculo.",
      financasHeading: "Matemática Financiera",
      financasSubtitle: "Interés simple y compuesto, descuentos y financiamientos — para entender el dinero del día a día.",
      emBreve: "Próximamente",
      comecarTrilha: "Empezar ruta",
      sobreHeading: "Sobre Meridiano Matemática",
      sobreBody:
        "Una app web instalable (PWA) que funciona en cualquier dispositivo — computadora, celular o tableta — y se puede agregar a la pantalla de inicio en iOS y Android como una app nativa. Cada ruta combina teoría clara con ejercicios corregidos al instante para consolidar el aprendizaje.",
      footer: "Meridiano Matemática.",
      privacyLink: "Política de Privacidad",
    },
    auth: {
      entrarTitle: "Iniciar sesión",
      entrarSubtitle: "Accede a tu cuenta para sincronizar tu progreso entre dispositivos.",
      cadastroTitle: "Crear cuenta",
      cadastroSubtitle: "Tu progreso, XP y logros se guardarán en la nube.",
      contasIndisponiveis: "Las cuentas todavía no están disponibles en esta app — vuelve pronto.",
      naoTemConta: "¿No tienes cuenta?",
      jaTemConta: "¿Ya tienes cuenta?",
      criarConta: "Crear cuenta",
      entrarLink: "Iniciar sesión",
      nome: "Nombre",
      email: "Correo electrónico",
      senha: "Contraseña",
      entrarButton: "Iniciar sesión",
      criarContaButton: "Crear cuenta",
      enviando: "Enviando...",
      continuarComGoogle: "Continuar con Google",
      continuarComMicrosoft: "Continuar con Microsoft",
      ouContinueComEmail: "o continúa con correo electrónico",
      oauthErro: "No pudimos completar el inicio de sesión. Inténtalo de nuevo.",
    },
    foto: {
      title: "Resolver por foto",
      subtitle: "Toma una foto de un problema de matemáticas y recibe la solución paso a paso.",
      exclusivo: "Esta función es exclusiva para quienes tienen cuenta.",
      fazerLogin: "Iniciar sesión",
      ou: "o",
      criarUmaConta: "crear una cuenta",
      tirarFoto: "Tomar foto o elegir de la galería",
      formatoInfo: "JPEG, PNG, GIF o WEBP — hasta 8MB",
      resolver: "Resolver",
      analisando: "Analizando...",
      trocarFoto: "Cambiar foto",
    },
    quadro: {
      title: "Pizarra de borrador",
      subtitle:
        "Un espacio para escribir y hacer cuentas, como una pizarra digital. Dibuja con el mouse, el dedo o un lápiz — y pide la solución por IA cuando quieras.",
      desfazer: "Deshacer",
      limpar: "Limpiar",
      baixarPng: "Descargar PNG",
      resolverIA: "Resolver con IA",
      analisando: "Analizando...",
      autoAnalisar: "Analizar automáticamente al pausar",
      facaLogin: "Inicia sesión",
      paraResolver: "para pedir la solución de lo que dibujaste.",
      borracha: "Borrador",
      fina: "Fina",
      media: "Media",
      grossa: "Gruesa",
      corPreto: "Color negro",
      corAzul: "Color azul",
      corVermelho: "Color rojo",
      corVerde: "Color verde",
    },
    solution: {
      enunciado: "Enunciado",
      passoAPasso: "Paso a paso",
      resposta: "Respuesta",
    },
    errors: {
      unsupportedType: "Formato de imagen no compatible. Usa JPEG, PNG, GIF o WEBP.",
      imageTooLarge: "La imagen es demasiado grande (máximo 8MB).",
      missingImage: "Selecciona o dibuja algo antes de enviar.",
      dailyLimitExceeded: "Alcanzaste el límite diario de fotos resueltas. Intenta de nuevo mañana.",
      unauthorized: "Tu sesión expiró. Inicia sesión de nuevo para continuar.",
      anthropicNotConfigured: "Esta función todavía no está disponible.",
      aiError: "No se pudo analizar la imagen ahora. Intenta de nuevo en un momento.",
      generic: "Algo salió mal al procesar la imagen. Intenta de nuevo.",
    },
    theme: {
      ativarClaro: "Activar tema claro",
      ativarEscuro: "Activar tema oscuro",
    },
    language: {
      label: "Idioma",
    },
    premium: {
      navBadge: "Premium",
      pageTitle: "Suscripción Premium",
      pageSubtitle: "Desbloquea todas las rutas y una cuota mucho mayor de resolución por IA.",
      benefit1: "Todas las rutas, incluyendo Estadística Intermedio/Avanzado y futuras rutas avanzadas",
      benefit2: "Una cuota mucho mayor para resolver por foto y por la pizarra",
      benefit3: "Apoya directamente el desarrollo de nuevo contenido",
      paymentMethods: "Acepta tarjeta de crédito/débito, boleto y Pix (en Brasil).",
      subscribeButton: "Suscribirse a Premium",
      manageButton: "Administrar suscripción",
      activeStatus: "Ya eres Premium — ¡gracias por el apoyo!",
      notConfigured: "Las suscripciones todavía no están disponibles en esta app — vuelve pronto.",
      requiresLogin: "Inicia sesión para suscribirte a Premium.",
      paywallHeading: "Contenido Premium",
      paywallBody: "Este tema es parte del plan Premium.",
      actionError: "No se pudo continuar. Intenta de nuevo.",
    },
    turmas: {
      title: "Clases",
      notConfigured: "Las clases todavía no están disponibles en esta app — vuelve pronto.",
      requiresLogin: "Inicia sesión para crear o unirte a una clase.",
      teachingHeading: "Clases que enseñas",
      memberHeading: "Clases en las que estás inscrito",
      noTurmasTeaching: "Todavía no has creado ninguna clase.",
      noTurmasMember: "Todavía no te has unido a ninguna clase.",
      createHeading: "Crear clase",
      nameLabel: "Nombre de la clase",
      createButton: "Crear clase",
      joinHeading: "Unirse con un código",
      codeLabel: "Código de la clase",
      joinButton: "Unirse",
      joinCodePrefix: "Código",
      viewButton: "Ver clase",
      notFoundOrNoAccess: "Clase no encontrada, o no tienes acceso a ella.",
      backToTurmas: "← Volver a clases",
      rosterHeading: "Estudiantes",
      noStudents: "Todavía no hay estudiantes en esta clase. Comparte el código de acceso.",
      xpLabel: "XP",
      streakLabel: "Racha",
      assignmentsHeading: "Tareas asignadas",
      noAssignments: "Ninguna tarea asignada todavía.",
      createAssignmentHeading: "Asignar tarea",
      levelLabel: "Nivel",
      topicLabel: "Tema",
      difficultyLabel: "Dificultad",
      assignButton: "Asignar",
      studentAssignmentsHeading: "Tareas de la clase",
      practiceLink: "Practicar",
      shareCodeHint: "Comparte este código con tus estudiantes para que se unan a la clase.",
    },
    pwa: {
      installTitle: "Instalar la app",
      installBody: "Agrega Meridiano Matemática a tu pantalla de inicio para acceso rápido, a pantalla completa y sin conexión.",
      installButton: "Instalar",
      dismissButton: "Ahora no",
      notificationsOnBody: "Recordatorios de racha activados — te avisamos cuando tu racha esté en riesgo.",
      notificationsOffBody: "Activa los recordatorios para no perder tu racha de días practicando.",
      notificationsEnableButton: "Activar recordatorios",
      notificationsDisableButton: "Desactivar recordatorios",
      notificationsDenied: "Permiso de notificaciones denegado — actívalo en la configuración del navegador para habilitar los recordatorios.",
      notificationsError: "No pudimos activar los recordatorios ahora. Inténtalo de nuevo.",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
