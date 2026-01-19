# Introdução

![Exemplo da plataforma em funcionando](./docs/platform.webp)

Está é uma plataforma que organiza emuladadores e jogos Retrô, permitindo pesquisar, filtrar e jogar em diferentes plataformas pré configuradas manualmente.

> Esse frontend não tem os jogos, imagens, descrições, emuladores ou qualquer dado proprietário, nem fornece apis para baixar automaticamente por questões legais, sendo apenas um frontend onde você pode adicionar os jogos, imagens, e realizar as configurações necessárias explicadas na seção de configurações. Este projeto se dedica a fins de BACKUP, preservação histórica e nostalgia!

As configurações podem ser automatizadas com scripts externos, mas não está no escopo desse repositório.

## Para desenvolvedores

Esse projeto é feito em  [electronjs](https://www.electronjs.org/pt/) para PC Windows e Linux, e funciona em ambas as plataformas, provavelmente deve ser possível realizar compilações para MacOs.

## Rodando e configurando o Retrostation 2.0

Abaixo um tutorial completo sobre como configurar os jogos, runners e outros detalhes.

> Runners são qualquer forma de rodar os seus arquivos, no contexto de retro emulação, a maioria dos runners serão emuladores, dos quais você irá baixar e configurar por sua conta.

1. [Baixe o retrostation.2.0.zip](https://github.com/gabrielogregorio/retrostation/releases/tag/2.0)
2. Extraia e execute o arquivo retrostation.bat
3. O Retrostation irá pedir algumas permissões e abrir já com alguns exemplos falsos de jogos.

Nesse começo, o aplicativo criará diversas pastas, ficando dessa forma

### assets

- assets/games/NOME_PASTA/ - coloque imagens de jogos aqui
- assets/platforms - coloque imagens das plataformas aqui

Exemplos

**assets/games/SWF_FLASH/pinguinsWars.webp**
**assets/platforms/adobeFlashPlayer.webp**

> Otimize suas imagens, minha sugestão é você usar webp com pelo menos 80% de perda de qualidade.

### bin

Aqui estão os binários do retrostation, não mexa nessa pasta

### config

- descriptions.json - Você pode deixar descrições dos jogos para complemento.
- plataforms.json - As plataformas que você tem disponível, com imagens na pasta `assets/plataforms`.
- runnersByFolder.json - Os runners/emuladores que irão executar dentro de cada pasta.
- user.json - Ela contém seus jogos favoritos e tempo de jogo em cada arquivo de jogo

> Otimize suas imagens, minha sugestão é você usar webp com pelo menos 80% de perda de qualidade. Capas de jogos podem ser extremamente pesadas e deixarem o seu computador lento.

#### Exemplo de mapemaento de arquivo no runnersByFolder.json

Esse é o caso mais comum, você define uma pasta onde irá hospedar seus jogos em um determinado formato, e pode ou não deixar eles em subpastas, exemplo

```json
[
  {
    "folder": "SWF_FLASH",
    "map": {
      "mode": "file",
      "extensionFile": ".swf",
      "ignoreFiles": ["bios.swf"]
    },
    "runners": [
      {
        "platform": "win32",
        "name": "Ruffle",
        "message": "",
        "command": "../content/runners/ruffle-nightly-2024_12_05-windows-x86_64/ruffle.exe \"$gamePath\""
      }
    ]
  }
]
```

> Para windows 11, 10, 8, 7, 64bit ou 32 bit USE o  platform como "win32", isso é uma coisa do Windows. Para linux é "linux"

A configuração acima buscará na pasta `/content/games/SWF_FLASH` qualquer arquivo que termine com a extensão .swf, o sistema tem a inteligência de encontrar variações da sua extensão, como `.SWF` em maiúsculo.

Você pode usar o `ignoreFiles`, no exemplo `"ignoreFiles": ["bios.swf"]` ele irá ignorar arquivos que contenham o texto `"bios.swf"``, isso é útil para ignorar dependências de jogos, em especial para formatos super antigos onde cada jogo era montado com diferentes arquivos.

Note que foi usado a string `$gamePath`, ao usa-la, o retrostation irá injetar o caminho do jogo nessa string.

Com a configuração acima, ao clicar jogar com Ruffle, exemplo:

![alt text](docs/playWithRuffleExample.png)

Ele irá converter esse comando:

**../content/runners/ruffle-nightly-2024_12_05-windows-x86_64/ruffle.exe \"$gamePath\"**

para

**../content/runners/ruffle-nightly-2024_12_05-windows-x86_64/ruffle.exe ../content/games/SWF_FLASH/flashPlayerGameExample.swf**

e irá executar isso na linha de comando do seu PC


#### Mapeamento Runner lendo Pastas

As mesmas regras se aplicam do mapeamento acima, mas com variações importantes, o exemplo:

```json
[
  {
    "folder": "EXE_MSDOS",
    "map": {
      "mode": "folder"
    },
    "runners": [
      {
        "platform": "win32",
        "name": "DOSBox-X",
        "message": "Na CLI, tente rodar o .exe ou .bat. É só digitar o nome do jogo com a extensão e pressionar Enter.",
        "command": "../content/runners/mingw-dosbox/dosbox-x.exe -conf ../content/runners/mingw-dosbox/dosbox-x.conf -c \"mount D \\\"$gameFolder\\\"\" -c \"D:\" -c \"dir\" "
      }
    ]
  }
]
```

Note que foi usado a string `$gameFolder`, ao usá-la, o retrostation irá injetar o caminho da pasta nessa string.

Esse formato transforma o caminho, disso:

**../content/runners/mingw-dosbox/dosbox-x.exe \\\"$gameFolder\\\"**

Para isso

**../content/runners/mingw-dosbox/dosbox-x.exe ../content/games/EXE_MSDOS/mygame/**

Isso é necessário para certas plataformas que não possuem ponto de entrada em um arquivo.

### cache/

Esse é o resultado do scrapper que o retrostation irá realizar sempre que você apertar o botão de refresh, ele contém o mapeamento dos jogos, com a localização, as descrições, imagens e demais informações.

![Botão de refresh do retrostation](docs/refresh.webp)

O sistema pode abrigar jogos usando alguns padrões comuns, como

- pinguinwars.swf
- pinguinwars (br).swf
- pinguinwars [v2].swf

Todos esses jogos ficarão juntos visualmente, e você poderá rodar eles separadamente, mas eles ficarão agrupados na mesma imagem e descrição

### content

São nessas pastas onde você irá deixar os `runners`, abaixo alguns exemplos de runners

- content/runners/mingw-dosbox/dosbox-x.exe
- content/runners/ruffle-nightly-2024_12_05-windows-x86_64/ruffle.exe

e exemplo de `games` em arquivos

- content/games/SWF_FLASH/pinguinsWars.swf
- content/games/SWD_FLASH/pinguinsWars.swd

e exemplo de `games` dentro de pastas

- content/games/DOS_MSDOS/NOME_DO_JOGO/unknowNameExample.exe


### retrostation.bat

Esse é o arquivo usado para iniciar o app

## Concluindo configurações

Com as configurações acima você finalmente poderá usar e expandir o retrostation. É muita configuração, mas é a intenção desse projeto, em especial a lidar com jogos bem abandonados em diferentes formatos.

## Links Úteis

- [A Importância da EMULAÇÃO no Mundo dos Games](https://www.youtube.com/watch?v=XUDbvaZBX9w)
- [Para baixar jogos em flash](https://archive.org/details/450jogos-bestgames)
- [Para baixar Abandonware](https://www.myabandonware.com)
- [Para obter núcleos do para o retro arch](https://buildbot.libretro.com/nightly/windows/x86_64/latest/)
- [Arquivo do flashplayer](https://flashpointarchive.org/)
- [Mais jogos em flash](https://archive.org/details/softwarelibrary_flash_games)
- [Emulador Ruffle](https://ruffle.rs/)

> Nos testes, e emulador https://ruffle.rs/ rodou muito bem na versão nightly de 2024-12_05 no windows-x86_64

## Como contribuir?

Você pode sugerir melhorias e até enviar pull requests, desde que não inclua descrições, arquivos, emuladores ou qualquer outro material protegido, mesmo que abandonado. Não contamine esse repositório!!!

## Algumas questões técnicas

1. Porque não tem testes automatizados

Esse era um projeto orignamente para agrupar jogos em flash, e posteriormente .exe do msdos que fiz em poucos minutos sem intenção de publicar ou crescer, mas ele acabou sendo muito útil, e os testes manuais se monstraram muito faceis de serem feitos, por isso optei por ir por esse caminho por enqunto.

2. Por que o app binário tem mais de 200 mb?

Infelizmente é o electron, alguns testes com uma versão básica dele, sozinho chegava a 190MB, sem incluir os pacotes de idiomas e licenças do chrome. É uma opção migrarmos para outra tecnologia.

3. Posso sugerir outros layouts?
Com certeza, mas é preciso ser minimalista

4. Por que tantas configurações manuais?

Foi feito assim para ser flexivel e para que ele lidasse com formatos diferentes de jogos, podemos sim criar automações, mas sem violar questões legais

5. Porque os primeiros commits já tem a aplicação praticamente toda pronta?

Porque a versão inicial foi feita rapidamente pra resolver um problema pessoal com [cds antigos com jogos flash](https://archive.org/details/maisde500jogos), e a versão original tinha os jogos flash incluso na aplicação, o que tornou necessário uma grande refatoração que entregou a aplicação bem avançada.


## Aviso legal

Esse projeto foi feito para fins de facilitar a gestão de jogos antigos, como aqueles de cd flash, msdos e outros mais antigos e apenas demonstra a forma de ser configurado, sem incluir nenhum jogo, ROM, emulador ou material protegido por direitos autorais. As imagens usadas nos exemplos são apenas para fins de demonstração e em baixa qualidade, todo o uso fica por conta do usuário final.

Os arquivos .exe e .swf na pasta static são apenas arquivos de texto, apenas com a extensão ajustada para servir como exemplo.

## Licenças de conteudo de terceiros

**Som de digitando**
PSS560_Perc1_PROCESSED.aif by Crabflag -- https://freesound.org/s/559408/ -- License: Creative Commons 0

**Som de click**
jump2.wav by LloydEvans09 -- https://freesound.org/s/187024/ -- License: Attribution 4.0
