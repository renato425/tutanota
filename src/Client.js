const puppeteer = require('puppeteer')
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
const events = require('events')
const ee = new events.EventEmitter()
var pagev = {}
class main {
    constructor(object = {}) {
        (async () => {
            const browser = await puppeteer.launch({
                headless: false
            })
            const page = await browser.newPage()
            pagev['page'] = page
            await page.goto('https://mail.tutanota.com/login', {timeout: 0})
            await page.type('input[type="email"]', object.email)
            await page.type('input[type="password"]', object.password)
            await page.keyboard.press('Enter')
            await sleep(15000)
            if (!page.url().startsWith('https://mail.tutanota.com/mail')) {
                await browser.close()
                throw new Error('Login mal-sucedido')
            } else {
                await page.waitForSelector('button[class="limit-width noselect bg-transparent button-width-fixed button-height"]')
                ee.emit('podeRodar', true)
            }
        })()
    }
    waitForLogin(call) {
        ee.on('podeRodar', (l) => {
            return call({dateLogged: Date.now(), useOfTheApi: l})
        })
    }
    email() {
        return {
            async sendMail(destinatario, assunto, senha, corpo) {
                await pagev.page.click('button[class="limit-width noselect bg-transparent button-width-fixed button-height"]')
                await pagev.page.waitForSelector('input[aria-label="Para"]')
                await pagev.page.type('input[aria-label="Para"]', destinatario)
                await pagev.page.type('input[aria-label="Assunto"]', assunto)
                await pagev.page.click(`input[aria-label="Senha para ${destinatario}"]`)
                await pagev.page.keyboard.type(senha)
                // for (let i = 0; i < senha.length; i++) {
                    // await pagev.page.keyboard.press('Backspace')
                // }
                await pagev.page.click('div[role="textbox"]')
                for (let i = 0; i < 88; i++) {
                    await pagev.page.keyboard.press('Backspace')
                }
                await pagev.page.keyboard.type('\n' + corpo)
                await pagev.page.click('button[title="Enviar"]')
            },
            async getMailsName(viewed, callback) {
                if (viewed == false) {
                await pagev.page.waitForSelector('div[class="text-ellipsis flex-grow b"]')
                let divs = await pagev.page.$$('div[class="text-ellipsis flex-grow b"]')
                let arrayReturn = []
                for (const i in divs) {
                    const element_inner = await divs[i].getProperty('innerText')
                    if (element_inner._remoteObject.value !== '') {
                        arrayReturn.push(element_inner._remoteObject.value)
                    }
                }
                return callback(arrayReturn)
            } else if (viewed == true) {
                await pagev.page.waitForSelector('div[class="text-ellipsis flex-grow"]')
                let divs = await pagev.page.$$('div[class="text-ellipsis flex-grow"]')
                let arrayReturn = []
                // console.log(divs)
                for (const i in divs) {
                    const element = await divs[i].getProperty('innerText')
                    if (element._remoteObject.value !== '') {
                        arrayReturn.push(element._remoteObject.value)
                    }
                }
                return callback(arrayReturn)
            }
            },
            async getMailsByName(name, viewed, callback) {
                if (typeof viewed !== 'boolean' || typeof name !== 'string') throw new Error('Parece que tem algo errado com o `getMaislByName`')
                let arrayReturn = []
                if (viewed == true) {
                    await pagev.page.waitForSelector('div[class="text-ellipsis flex-grow"]')
                    let divs = await pagev.page.$$('div[class="text-ellipsis flex-grow"]')
                for (const i in divs) {
                    const element = await divs[i].getProperty('innerText')
                    if (element._remoteObject.value !== '' && element._remoteObject.value == name) {
                        await pagev.page.click(divs[i]._remoteObject.description)
                        await sleep(5000)
                        let sender1 = await pagev.page.$eval('div[class="small flex text-break selectable badge-line-height flex-wrap pt-s"]', el => el.innerText)
                        sender1 = {
                            name: sender1.split(' <')[0],
                            mail: sender1.split(' <')[1].replace('>', '')
                        }
                        let assunto = await pagev.page.$eval('div[class="subject text-break selectable"]', el => el.innerText)
                        let date = await pagev.page.$eval('small[class="date mt-xs content-fg"]', el => el.innerText)
                        date = {
                            day: date.split('. ')[0].split(' de ')[0].replace('• ', '').split(', ')[1],
                            monthly: date.split(' de ')[1].split(' • ')[0].replace('.', ''),
                            minute: date.split(' • ')[1], 
                        }
                        let body = await pagev.page.$eval('div[dir="ltr"]', el => el.innerText)
                        await arrayReturn.push({sender: sender1, date: date, subjectMatter: assunto, body: body})
                        await pagev.page.click('a[title="Entrada"]')
                    }
                }
                } else if (viewed == false) {
                    await pagev.page.waitForSelector('div[class="text-ellipsis flex-grow b"]')
                    let divs = await pagev.page.$$('div[class="text-ellipsis flex-grow b"]')
                    for (const i in divs) {
                        const element = await divs[i].getProperty('innerText')
                        if (element._remoteObject.value !== '' && element._remoteObject.value == name) {
                            await pagev.page.click(divs[i]._remoteObject.description)
                            await sleep(5000)
                        let sender1 = await pagev.page.$eval('div[class="small flex text-break selectable badge-line-height flex-wrap pt-s"]', el => el.innerText)
                        sender1 = {
                            name: sender1.split(' <')[0],
                            mail: sender1.split(' <')[1].replace('>', '')
                        }
                        let assunto = await pagev.page.$eval('div[class="subject text-break selectable"]', el => el.innerText)
                        let date = await pagev.page.$eval('small[class="date mt-xs content-fg"]', el => el.innerText)
                        date = {
                            day: date.split('. ')[0].split(' de ')[0].replace('• ', '').split(', ')[1],
                            monthly: date.split(' de ')[1].split(' • ')[0].replace('.', ''),
                            minute: date.split(' • ')[1], 
                        }
                        let body = await pagev.page.$eval('div[dir="ltr"]', el => el.innerText)
                        arrayReturn.push({sender: sender1, date: date, subjectMatter: assunto, body: body})
                        }
                    }
                }
                return callback(arrayReturn)
            }
        }
    }
    drafts() {
            return {
                async sendMail(name) {
                    await pagev.page.click('[class="nav-button noselect flex-no-shrink items-center click plr-button no-text-decoration button-height flex-start"]')
                    await sleep(3000)
                    await pagev.page.click('a[title="Rascunhos"]')
                    await sleep(3000)
                    let names = await pagev.page.$$('div[class="text-ellipsis flex-grow"]')
                    for (const i in names) {
                        if (await pagev.page.$eval(names[i]._remoteObject.description, el => el.innerText) == name) {
                            await pagev.page.click(nems[i]._remoteObject.description)
                            await sleep(5000)
                            await pagev.page.click('span[class="icon flex-center items-center button-icon"]')
                            await pagev.page.click('div[class="button-content flex items-center primary plr-button justify-center"]')
                            await pagev.page.click('a[title="Rascunhos"]')
                            await pagev.page.waitForSelector('a[title="Pastas"]')
                            await pagev.page.click('a[title="Pastas"]')
                            await pagev.page.waitForSelector('a[title="Entrada"]')
                            // await sleep(5000)
                            await pagev.page.click('a[title="Entrada"]')
                            await sleep(3000)
                        }
                    }
                },
                async getMails(callback) {
                    await pagev.page.click('[class="nav-button noselect flex-no-shrink items-center click plr-button no-text-decoration button-height flex-start"]')
                    await sleep(3000)
                    await pagev.page.click('a[title="Rascunhos"]')
                    await sleep(3000)
                    let divs = await pagev.page.$$('div[class="text-ellipsis flex-grow"]')
                    let arrayReturn = []
                    for (const i in divs) {
                        let name = await pagev.page.$eval(divs[i]._remoteObject.description, el => el.innerText)
                        if (name !== '' && !arrayReturn.some(id => id == name)) {
                            arrayReturn.push(name)
                        }
                    }
                    await pagev.page.waitForSelector('a[title="Pastas"]')
                    await pagev.page.click('a[title="Pastas"]')
                    await pagev.page.waitForSelector('a[title="Entrada"]')
                    // await sleep(5000)
                    await pagev.page.click('a[title="Entrada"]')
                    return callback(arrayReturn)
                },
                async getMailByName(name, call) {
                await pagev.page.click('[class="nav-button noselect flex-no-shrink items-center click plr-button no-text-decoration button-height flex-start"]')
                await sleep(3000)
                await pagev.page.click('a[title="Rascunhos"]')
            await sleep(3000)
            let arrayForReturn = []
            let names = await pagev.page.$$('div[class="text-ellipsis flex-grow"]')
            let jaVerificado = false
            for (const i in names) {
                if (await pagev.page.$eval(names[i]._remoteObject.description, el => el.innerText) == name && jaVerificado == false) {
                    await pagev.page.click(names[i]._remoteObject.description)
                    await sleep(5000)
                    let emailToSend = await pagev.page.$eval('[class="small flex text-break selectable badge-line-height flex-wrap pt-s"]', el => el.innerText)
                    // emailToSend: emailToSend
                    let assunto = await pagev.page.$eval('div[class="subject text-break selectable"]', el => el.innerText)
                    let date = await pagev.page.$eval('small[class="date mt-xs content-fg"]', el => el.innerText)
                    date = {
                        day: date.split('. ')[0].split(' de ')[0].replace('• ', '').split(', ')[1],
                        monthly: date.split(' de ')[1].split(' • ')[0].replace('.', ''),
                        minute: date.split(' • ')[1]
                    }
                    let body = await pagev.page.$eval('div[id="mail-body"]', el => el.innerText)
                    // console.log(body)
                    await arrayForReturn.push({emailToSender: emailToSend, date: date, subjectMatter: assunto, body: body})
                    await pagev.page.click('a[title="Rascunhos"]')
                    // await pagev.page.waitForSelector('[class="nav-button noselect flex-no-shrink items-center click plr-button no-text-decoration button-height flex-start"]', {timeout: 0})
                    // await pagev.page.click('[class="nav-button noselect flex-no-shrink items-center click plr-button no-text-decoration button-height flex-start"]')
                    await pagev.page.waitForSelector('a[title="Pastas"]')
                    await pagev.page.click('a[title="Pastas"]')
                    await pagev.page.waitForSelector('a[title="Entrada"]')
                    // await sleep(5000)
                    await pagev.page.click('a[title="Entrada"]')
                    await sleep(3000)
                    jaVerificado = true
                }
            }
            return call(arrayForReturn)
            }
            // return call(arrayForReturn)
        }
    }
}



module.exports = main
