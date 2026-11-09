# EcoWeb Web

Interface web do EcoWeb para cadastro e gerenciamento de materiais reutilizáveis, perfil institucional, mensagens demonstrativas e indicadores de impacto.

## Tecnologias

- Next.js 16 e React 18
- TypeScript
- Tailwind CSS
- Axios
- Recharts

## Requisitos

Escolha uma das formas de execução:

- Node.js 22 e npm; ou
- Docker Engine com Docker Compose v2.

A API EcoWeb deve estar acessível pelo navegador. Em desenvolvimento local, o endereço padrão considerado é `http://localhost:3333`.

## Variáveis de ambiente

Crie o arquivo local a partir do exemplo:

```bash
cp .env.example .env
```

Variável disponível:

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API` | Sim | `http://localhost:3333` | URL pública da API usada pelo navegador. |

Por ser uma variável `NEXT_PUBLIC_*`, seu valor é incorporado ao bundle durante o build. Ao alterar a URL da API, reconstrua a aplicação ou a imagem Docker.

## Executar com Docker Compose

Com a API disponível em `http://localhost:3333`:

```bash
docker compose up --build
```

Acesse [http://localhost:3000](http://localhost:3000).

Para executar em segundo plano:

```bash
docker compose up --build -d
```

Para acompanhar os logs:

```bash
docker compose logs -f web
```

Para encerrar e remover o container:

```bash
docker compose down
```

### Personalizar portas e API

As variáveis podem ser informadas no comando:

```bash
NEXT_PUBLIC_API=https://api.exemplo.com WEB_PORT=8080 docker compose up --build
```

Nesse exemplo, o site fica disponível em `http://localhost:8080`.

> `NEXT_PUBLIC_API` precisa ser uma URL acessível pelo navegador do usuário. Não use um nome interno do Compose, como `http://api:3333`, para uma aplicação acessada fora da rede Docker.

## Executar diretamente com Docker

Construir a imagem:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API=http://localhost:3333 \
  -t ecoweb-web .
```

Executar o container:

```bash
docker run --rm -p 3000:3000 --name ecoweb-web ecoweb-web
```

A imagem usa build multi-stage, executa o servidor standalone do Next.js e roda com um usuário sem privilégios de root.

## Executar sem Docker

Instale as dependências:

```bash
npm ci
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). As alterações no código são recarregadas automaticamente.

Para simular a execução de produção:

```bash
npm run build
npm start
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o Next.js em modo de desenvolvimento. |
| `npm run build` | Gera o build otimizado de produção. |
| `npm start` | Executa um build de produção existente. |

## Estrutura principal

```text
app/
├── context/        # Autenticação e estado compartilhado
├── dashboard/      # Painel empresarial
├── services/       # Integração HTTP com a API
└── page.tsx        # Página inicial
components/
└── ui/             # Componentes visuais reutilizáveis
public/             # Arquivos estáticos
Dockerfile          # Build da imagem de produção
docker-compose.yml  # Execução local do frontend
```

## Integração com a API

O frontend envia o token de autenticação no header `Authorization: Bearer <token>`. Rotas sob `/dashboard` também são protegidas pelo middleware do Next.js e redirecionam sessões não autenticadas para `/login`.

O arquivo Compose deste repositório executa somente o frontend. A API e o MongoDB devem ser iniciados pelo repositório da API ou por uma infraestrutura externa.

## Verificação

Antes de enviar alterações:

```bash
npx tsc --noEmit
npm run build
```
