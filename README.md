# Aplicativo Ponto Fácil

## Visão Geral

O aplicativo é voltado para empresas de pequeno porte que precisam de uma solução prática e eficiente para o controle de horas trabalhadas por seus funcionários. Ele permite a marcação de pontos de entrada, intervalos, fim de intervalos e saída, oferecendo uma interface simples e amigável para registro de jornadas. Ideal para empresas que desejam otimizar o acompanhamento de horas trabalhadas e a gestão de tempo dos colaboradores, o app oferece facilidade no monitoramento e na geração de relatórios de ponto.

O aplicativo foi desenvolvido em React Native com funcionalidades de login, home, perfil, relatórios e atualização de dados. Ele utiliza navegação com react-navigation, integração com uma API REST para autenticação e armazenamento de tokens usando AsyncStorage. A estrutura do projeto foi organizada em diferentes componentes e telas, permitindo fácil escalabilidade e manutenção.

## Estrutura de Pastas

```plaintext
.
├── .expo
├── assets
│   └── images
│       ├── icon.png
│       ├── img-login.png
│       ├── inicio.png
│       ├── logi.png
│       ├── login.png
│       ├── perfil.jpg
│       ├── ponto.png
│       ├── signin.png
│       └── splash.png
├── node_modules
├── src
│   ├── components
│   │   ├── CheckAuth.js
│   │   └── Logout.js
│   └── screens
│       ├── Atualizar.js
│       ├── Home.js
│       ├── Login.js
│       ├── Perfil.js
│       ├── Relatorio.js
│       └── UsuarioAvatar.js
├── .gitignore
├── App.js
├── app.json
├── babel.config.cjs
├── gesture-handler.js
├── gesture-handler.native.js
├── package-lock.json
├── package.json
└── README.md

```
