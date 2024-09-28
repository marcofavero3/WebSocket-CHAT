<h1># chat-codecentauri</h1>
<p>Este projeto é um sistema de chat em tempo real construído com Angular no frontend e Spring Boot no backend, utilizando WebSockets para a troca de mensagens entre os usuários. O sistema suporta a exibição de usuários online, mensagens em tempo real e gerenciamento de sessões de usuários.</p>

<h2>Tecnologias Utilizadas</h2>
<ul>
  <li><strong>Frontend:</strong> Angular 18</li>
  <li><strong>Backend:</strong> Spring Boot 3.3.3</li>
  <li><strong>Comunicação:</strong> WebSocket (STOMP), SockJS</li>
  <li><strong>Banco de Dados:</strong> H2</li>
  <li><strong>Linguagens:</strong> TypeScript, Java</li>
</ul>

<h2>Bibliotecas e Frameworks</h2>
<ul>
  <li>PrimeNG (UI Components)</li>
  <li>StompJS (WebSocket)</li>
  <li>SockJS (Fallback WebSocket)</li>
  <li>Maven (Gestão de dependências do backend)</li>
  <li>Node.js & NPM (Gestão de dependências do frontend)</li>
</ul>

<h2>Pré-requisitos</h2>
<p>Para executar o projeto, você precisará das seguintes ferramentas instaladas no seu ambiente de desenvolvimento:</p>
<ul>
  <li>Java 17</li>
  <li>Node.js (versão 18+)</li>
  <li>NPM ou Yarn</li>
  <li>Maven (para o gerenciamento do backend)</li>
  <li>Git (para clonar o repositório)</li>
</ul>

<h2>Funcionalidades</h2>
<ul>
  <li>Envio de mensagens em tempo real com WebSocket</li>
  <li>Exibição da lista de usuários conectados</li>
  <li>Notificações quando um usuário entra ou sai do chat</li>
  <li>Gerenciamento de sessões de usuários</li>
  <li>Banco de dados H2 em memória para armazenar logs e mensagens temporárias</li>
</ul>

<h2>Instalação</h2>
<p>Para começar, siga os passos abaixo para clonar o repositório e configurar o projeto:</p>

<h3>Clonando o repositório</h3>
<p>Clone o repositório com o comando:</p>
<pre><code>git clone https://github.com/marcofavero3/WebSocket-CHAT.git</code></pre>

<h3>Instalação do Backend</h3>
<p>Navegue até a pasta do backend:</p>
<pre><code>cd WebSocket-CHAT/backend</code></pre>

<p>Instale as dependências do backend:</p>
<pre><code>mvn clean install</code></pre>

<p>Execute o backend:</p>
<pre><code>mvn spring-boot:run</code></pre>

<p>O backend rodará por padrão em: <a href="http://localhost:8080">http://localhost:8080</a></p>

<p>Para acessar o banco de dados H2 (opcional), utilize:</p>
<pre><code>http://localhost:8080/h2-console</code></pre>

<p>Use as credenciais padrão:</p>
<ul>
  <li><strong>JDBC URL:</strong> jdbc:h2:mem:testdb</li>
  <li><strong>User:</strong> sa</li>
  <li><strong>Password:</strong> (deixe em branco)</li>
</ul>

<h2>Backend (Spring Boot)</h2>
<p>Siga as etapas abaixo para configurar e executar o backend:</p>
<ul>
  <li>Acesse o diretório do backend:
    <pre><code>cd backend</code></pre>
  </li>
  <li>Instale as dependências do backend:
    <pre><code>mvn clean install</code></pre>
  </li>
  <li>Execute a aplicação Spring Boot:
    <pre><code>mvn spring-boot:run</code></pre>
  </li>
</ul>

<h2>Frontend (Angular)</h2>
<p>Siga as etapas abaixo para configurar e executar o frontend:</p>
<ul>
  <li>Acesse o diretório do frontend:
    <pre><code>cd frontend</code></pre>
  </li>
  <li>Instale as dependências:
    <pre><code>npm install</code></pre>
  </li>
  <li>Inicie o servidor de desenvolvimento Angular:
    <pre><code>npm start</code></pre>
  </li>
  <li>O aplicativo estará disponível em: <a href="http://localhost:4200">http://localhost:4200</a></li>
</ul>

<h2>Execução</h2>
<p>Certifique-se de que o backend está em execução no <a href="http://localhost:8080">http://localhost:8080</a>.</p>
<p>Navegue até <a href="http://localhost:4200/login">http://localhost:4200/login</a> no seu navegador para acessar o frontend.</p>
<p>Insira um apelido e comece a usar o chat em tempo real.</p>
