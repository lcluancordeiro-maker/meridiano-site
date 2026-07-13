# Calculadora Judicial — App Android/iOS (Capacitor)

O conteúdo web vive em `calculo-judicial/` (também é o PWA). O Capacitor empacota
esse mesmo HTML/CSS/JS dentro de projetos nativos em `android/` e `ios/`.

## Toda vez que o conteúdo web mudar

```bash
npm install        # só na primeira vez / quando as deps mudarem
npx cap sync        # copia calculo-judicial/ para dentro de android/ e ios/
```

## Rodar/testar

- **Android**: abra a pasta `android/` no Android Studio (`npx cap open android`)
  e rode num emulador ou aparelho. Precisa do Android Studio + SDK instalados —
  não é possível compilar isso neste ambiente (sandbox Linux sem SDK).
- **iOS**: abra `ios/App/App.xcodeproj` no Xcode (`npx cap open ios`), só é
  possível num Mac com Xcode instalado. Este ambiente não tem Mac/Xcode, então
  a build e a assinatura precisam ser feitas na sua máquina.

## Publicar nas lojas

1. **Google Play**: conta de desenvolvedor (US$25, pagamento único). No Android
   Studio, gere um Android App Bundle assinado (`Build > Generate Signed Bundle`)
   e envie no [Play Console](https://play.google.com/console).
2. **Apple App Store**: conta Apple Developer (US$99/ano). No Xcode, configure
   o *Signing & Capabilities* com seu time, arquive o app (`Product > Archive`)
   e envie pelo Xcode/Transporter para o [App Store Connect](https://appstoreconnect.apple.com).

## Identidade do app

- `appId`: `br.com.meridiano.calculojudicial` (em `capacitor.config.json`) —
  troque antes de publicar se quiser outro pacote/bundle ID.
- Nome exibido: "Calculadora Judicial".
- Ícones/splash já gerados a partir da marca (petróleo `#0E4B5A` + símbolo M)
  em `android/app/src/main/res/mipmap-*` e `ios/App/App/Assets.xcassets`.
  As imagens-fonte em alta resolução ficam em `assets-src/`, caso queira
  regenerar tudo automaticamente mais tarde com `npx @capacitor/assets generate`
  (não rodou aqui porque a ferramenta depende do pacote `sharp`, que precisa
  baixar um binário nativo — bloqueado pela política de rede deste sandbox).

## Permissões

O app já tem permissão de internet no Android (necessária para a calculadora
de correção monetária buscar os índices no Banco Central). As outras três
calculadoras funcionam 100% offline, dentro do próprio app.

## E o PWA?

Continua funcionando à parte, direto do navegador (`calculo-judicial/index.html`):
instalável via "Adicionar à Tela de Início" no iOS/Android, com ícone, tela cheia
e as 3 calculadoras offline (service worker em `calculo-judicial/sw.js`). O app
nativo Capacitor é opcional, para quando você quiser distribuir pelas lojas.
