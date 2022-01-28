<h1 align="center">TinDin-Teste Desenvolvedor: Backend Fase 2</h1>

## Informações de contato
Nome: Roberto Costa Tupinambá <br>
Email: robertotupinamba@gmail.com <br>
Telefone: (34) 9 9824-2757 <br>
Linkedin: https://www.linkedin.com/in/robertotupi/

## Implementação
Utilizei o express, pois ele possibilita a criação rápida de aplicações utilizando um conjunto pequeno de arquivos e pastas; E por acreditar que ele deixa o código muito mais limpo. E utilizei o axios para realizar as requisições para a api de foto. E com isso precisei só mockar as chamadas dele para que nos testes eu conseguisse testar sem acabar com o limite de requisições da API.

## Coverage
![image](https://user-images.githubusercontent.com/41094007/150650285-1769a27f-46a6-4b56-8005-85c06a47eb19.png)


## Endpoints da API:

|  Method | Path  |  Headers | Payload | Responde |
|------------|--------------|-----------------------|----------------------------------------|----------------------------------------------|
|   POST     | /login       |  {}                   | { email: "example.com", password: "123" }                 | { token: "xyz123", user: { _id: "123", name: "user name" } } |
|   POST     | /places      |  { token: "xyz123" }  | { name: "Maringá" }                                       | { _id: "x1", name: "Maringá", photo: "https://example.com" } |
|   GET   | /places|{ token: "xyz123" }| { search: "maringá", order: "name", page: 1, limit: 50 } | [{ _id: "x1", name: "Maringá", photo: "https://example.com" },{...}] |
|   GET      | /places/:id  |  { token: "xyz123" }  |                                                           |	{ _id: "x1", name: "Maringá", photo: "https://example.com" } |
|   PUT      | /places      |  { token: "xyz123" }  | { _id: "x1", name: "Maringá 2" }               | { _id: "x1", name: "Maringá 2", photo: "https://example2.com" }|
|   DELETE   | /places/:id  |  { token: "xyz123" }  |                                                           | { _id: "x1", name: "Maringá", photo: "https://example.com" }|

