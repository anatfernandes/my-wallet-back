# :moneybag: My Wallet API

# Índice

- [Sobre](#Sobre)
- [Rotas](#Rotas)
  - [Rotas não autenticadas:](#Rotas-não-autenticadas)
    - [Cadastro](#Cadastro)
    - [Login](#Login)
  - [*Rotas autenticadas*:](#Rotas-autenticadas)
    - [Listar registros](#Listar-registros)
    - [Criar registro](#Criar-registro)
    - [Editar registro](#Editar-registro)
    - [Apagar registro](#Apagar-registro)
    - [Logout](#Logout)
- [Como rodar em desenvolvimento](#Como-rodar-em-desenvolvimento)

<br/>

# Sobre
API do [My Wallet](https://github.com/AnaLTFernandes/my-wallet-front).

<br/>

# Rotas

URL base: `https://my-wallet.herokuapp.com`

<br/>

## Rotas não autenticadas

## Cadastro
- Rota: `/signup`
- Método: `POST`
- Exemplo de Body:

  ```json
  {
    "name": "andreia",
    "email": "andreia@mail.com",
    "password": "andrr"
  }
  ```

- Possíveis erros:
	- Campos ausentes, vazios ou com tipos diferentes de string
	- Campo *email* com email em formato inválido
	- Já existe um usuário com os dados informados

## Login
- Rota: `/signin`
- Método: `POST`
- Exemplo de Body:

  ```json
  {
    "email": "andreia@mail.com",
    "password": "andrr"
  }
  ```
- Exemplo de Resposta:

  ```json
  {
    "name": "andreia",
    "email": "andreia@mail.com",
    "token": "pwoehfcnmçksh.dflkjskbckjl.jfoakspfoiwujknfcç"
  }
  ```
- Possíveis erros:
	- Campos ausentes, vazios ou com tipos diferentes de string
	- Campo *email* com email em formato inválido
	- Não existe um usuário com os dados informados

## Rotas autenticadas
- Enviar Header Authorization no formato: `Bearer {token}`
- Possíveis erros:
	- Header Authorization ausente
	- Token inválido

## Listar registros
- Rota: `/records`
- Método: `GET`
- Exemplo de Resposta:

  ```json
  [
    {
      "id": 1669671296410,
      "date": "28/11/2022",
      "details": "Almoço",
      "price": "24.90",
      "type": "saída"
    }
  ]
  ```

## Criar registro
- Rota: `/record`
- Método: `POST`
- Exemplo de Body:

  ```ruby
  {
    "details": "Almoço",
    "price": "24.90",
    "type": "saída" // "entrada"
  }
  ```
- Possíveis erros:
	- Campos do body vazios ou com tipos diferentes de string

## Editar registro
- Rota: `/record/edit/{id}`
- Método: `PUT`
- Exemplo de Body:

  ```ruby
  {
    "details": "Almoço",
    "price": "24.75",
    "type": "saída" // "entrada"
  }
  ```
- Possíveis erros:
	- Campos do body ausentes, vazios ou com tipos diferentes de string

## Apagar registro
- Rota: `/records/delete/{id}`
- Método: `DELETE`

## Logout
- Rota: `/logout`
- Método: `POST`

<br/>

# Como rodar em desenvolvimento

**Atenção:** para rodar o projeto é preciso ter o [MongoDB](https://www.mongodb.com/docs/manual/installation/) instalado em sua máquina.

1. Clone esse repositório:
>```ruby
> git clone https://github.com/AnaLTFernandes/my-wallet-back.git
>```

2. Instale as dependências:
>```ruby
> npm install
>```

3. Configure o arquivo .env com base no arquivo .env.example

4. Inicie o projeto:
>```ruby
> npm run dev
>```

5. Instale e configure o frontend em https://github.com/AnaLTFernandes/my-wallet-front

6. Divirta-se nas rotas usando de URL base: http://localhost:5000
