# Tutanota Mail API!!


**API NÃO OFICIAL PARA O SITE: [Tutanota](https://www.tutanota.com)**

Com essa api, você poderá controlar **Emails** do Site Tutanota. Ou seja: **Caixa de Entrada e Rascunhos**



# Instalando...

```
npm install tutanota

//ou use yarn

yarn add tutanota

```


# Referências da Documentação:

* [Client](https://www.github.com/renato425/tutanota#client)
* *    [waitForLogin](https://www.github.com/renato425/tutanota#waitforlogin)
* *    [email](https://www.github.com/renato425/tutanota#emails)
* * *   [sendMail](https://www.github.com/renato425/tutanota#sendmail)
* * *   [getMailsName](https://www.github.com/renato425/tutanota#getmailsname)
* * *   [getMailsByName](https://www.github.com/renato425/tutanota#getmailsbyname)
* *    [drafts](https://www.github.com/renato425/tutanota#drafts)
* * *  [sendMail](https://www.github.com/renato425/tutanota#sendmaildraft)
* * *  [getMails](https://www.github.com/renato425/tutanota#getmails)
* * *  [getMailByName](https://www.github.com/renato425/tutanota#getmailbyname)







# Exemplos


```js
const Tutanota = require('tutanota')
const Client = new Tutanota.Client({email: 'yourtutanotamail@tutanota.com', password: 'yourtutanotapassword'})


Client.waitForLogin(async info => {
    console.log(info) // { dateLogged: timestamp(number), useOfTheApi: boolean }
    await Client.email().getMailsName(true, mail => {
        console.log(mail) //object
    })
    await Client.drafts().getMails(mail => {
        console.log(mail) //object
    })
})
```




# Client


*Cria um novo cliente no Tutanota, parte necessária para uso do **Tutanota Mail API***


```js
const Tutanota = require('tutanota')
const Client = new Tutanota.Client({yourobjecthere})
```

Informações que **devem** ser passadas no objeto.

Nome | Descrição | Tipo
-----|-----------|------
email | Informa o email para fazer o login | String
password | Informa a senha para fazer o login | String

## waitForLogin

```js


Client.waitForLogin(//function)


```

*Usando esse método, a função será executada quando o **puppeteer** iniciar certamente as bibliotecas, apis e arquivos necessários.*




## email

```js

Client.email()

```

*Usando esse método, a compatibilidade com o email é ativada.*



### sendMail

```js

Client.email().sendMail()

```

*Usando esse método, você vai poder enviar emails para outras pessoas.*

***Obs: todos os parametros abaixo são obrigatórios***


Parametro | Descrição | Tipo
----------|-----------|-------
destinatario | Email para qual a mensagem será enviada! | String
assunto | O assunto ou até o nome do email. | String
senha | A senha do email 
corpo | A mensagem que conterá no email. | String




### getMailsByName

```js

Client.email().getMailsByName()

```

*Usando esse método. A biblioteca irá ler todos os emails e retornar como um **ArrayObject** os emails encontrados com esse nome*


***Obs: todos esses parametros abaixo são obrigatórios***



Parametro | Descrição | Tipo
----------|-----------|------
name | O nome do email. | String
viewed | Informa pra biblioteca retornar emails lidos ou não | Boolean
callback | Função onde será retornada as informações. O famoso callback | callbackFunction





### getMailsName

```js

Client.email().getMailsName()

```

*Usando esse método, a biblioteca irá retornar como um **ArrayObject** todos os emails encontrados como lidos ou não*


***Obs: todos os parametros abaixo são obrigatórios***


Parametro | Descrição | Tipo
----------|-----------|--------
viewed | Informa para a biblioteca se os emails que serão retornados já foram lidos por você ou não. | boolean
callback | Função onde será retornada a informação. O famoso callback | callbackFunction



## drafts


```js
Client.drafts()
```

Usando esse método, a compatibilidade com **Rascunhos** é ativada.


### sendMailDraft

```js

Client.drafts().sendMail()

```

Envia um email já pronto para o destinatário no rascunho.

Obs: o parametro abaixo é obrigatório

Parametro | Descrição | Tipo
----------|-----------|------
name | O nome do email que está salvo no rascunho | String




### getMails

```js
Client.drafts().getMails()

```

Retorna todos os emails salvo no rascunho, não sendo necessário informar nenhum parametro. Somente a **callbackFuncion** dentro dos parametros do método.




### getMailByName()

```js
Client.drafts().getMailByName()

```

Retorna o(s) emails que vai tem o mesmo nome do parametro *name*

Obs: todos os parametros abaixo são obrigatórios

Parametro | Descrição | Tipo
----------|-----------|-------
name | O nome do email que será retornado | String
call | a função onde será retornada as informações. A famosa callbackFunction | callbackFunction





# Aviso Importante!


Por favor! Se acontecer algo com sua conta em decorrência ao uso dessa api. Primeiro passe essa informação para mim em meu [GitHub](https://github.com/renato425/tutanota).

Mesmo assim, se o seu caso não for corrigido. Não exite em entrar em contato com a equipe de suporte do **Tutanota**

Link do [suporte Tutanota](https://tutanota.com/pt_br/contact)
