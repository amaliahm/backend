import express from "express";
import cors from 'cors';
import mariadb from 'mariadb'
import EventEmitter from 'events'
import {Server as SocketIOServer} from 'socket.io'
import { createServer } from "http";
import { Console, log } from "console";
import { exit } from "process";

let getData
let connection

const app = express()

const httpsServer = createServer(app)

const io = new SocketIOServer(httpsServer, {
    cors: {
        origin: '*'
    }
})

const eventEmitter = new EventEmitter();

/* create pool */

const pool = mariadb.createPool({
    host: "localhost",
    user: "bouzian",
    password: "jewellery",
    database: "jewellery",
    waitForConnections: true,
})

/* get connection */

try {
    connection = await pool.getConnection();
} catch(error) {
    console.log(error)
}

/* get data */

async function getClients() {
    try {
        const rows = await connection.query('SELECT * FROM clients ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    } finally {
        if (connection) connection.end()
    }
}

async function getFournisseurs() {
    try {
        const rows = await connection.query('SELECT * FROM fournisseurs ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getVentes() {
    try {
        const rows = await connection.query('SELECT * FROM ventes ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getArticltes() {
    try {
        const rows = await connection.query('SELECT * FROM articles ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getAchats() {
    try {
        const rows = await connection.query('SELECT * FROM achats ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getVersementF() {
    try {
        const rows = await connection.query('SELECT * FROM versement_f ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getVersementC() {
    try {
        const rows = await connection.query('SELECT * FROM versement_c ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getImportation() {
    try {
        const rows = await connection.query('SELECT * FROM importation ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getAchatImportation() {
    try {
        const rows = await connection.query('SELECT * FROM achat_importation ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getVersementImportation() {
    try {
        const rows = await connection.query('SELECT * FROM versement_importation ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* main function */


async function index () {
    try {
        const clients = await getClients()
        const fournisseurs = await getFournisseurs();
        const ventes = await getVentes();
        const articles = await getArticltes();
        const achats = await getAchats();
        const versement_f = await getVersementF();
        const versement_c = await getVersementC();
        const importation = await getImportation();
        const achat_importation = await getAchatImportation();
        const versement_importation = await getVersementImportation();
        getData = {
            clients: clients,
            fournisseurs: fournisseurs,
            ventes: ventes,
            articles: articles,
            achats: achats,
            versement_f: versement_f,
            versement_c: versement_c,
            importation: importation,
            achat_importation: achat_importation,
            versement_importation: versement_importation,
        }
    } catch(error) {
        console.log(error)
    }
}

/* call main function */

index()


/* app */

app.use(express.json())

app.use(cors())

app.listen(8800, () => {
    
})

app.get('/', (req, res) => {
    res.json(getData)
})


/* add */

function runCommand (command, res ) {
    try {
        connection.query(command, (err, valeur) => {
            if (err) {
                console.log(err)
                console.log('2')
                return
            }
            eventEmitter.emit('dataInserted');
            console.log('4')
            console.log(data)
        })
    } catch(error) {
        console.log(error)
        exit(1)
        return
    }
    io.emit('datInserted', getData)
    index()
}

/* add client */

app.post('/clients/add-client', async (req, res) => {
    const client = req.body;
    const insert = 
       `INSERT INTO clients 
       (nom, ville, wilaya, telephone, titre, email) 
       VALUES 
       ('${client.nom}',
        '${client.ville}', 
        '${client.wilaya}', 
        '${client.telephone}', 
        '${client.titre}', 
        '${client.email}');`;
        runCommand(insert, res)
})

/* add fournisseur */

app.post('/fournisseurs/add-fournisseur', async (req, res) => {
    const fournisseur = req.body;
    const insert = 
       `INSERT INTO fournisseurs 
       (nom, ville, wilaya, telephone, titre, email) 
       VALUES 
       ('${fournisseur.nom}',
        '${fournisseur.ville}', 
        '${fournisseur.wilaya}', 
        '${fournisseur.telephone}', 
        '${fournisseur.titre}', 
        '${fournisseur.email}');`;
        runCommand(insert, res)
})

/* add achats */

app.post('/achats/add-achat', async (req, res) => {
    const achats = req.body;
    Object.keys(achats).map((achat) => {
        const insert = 
        `INSERT INTO achats (\`designation d'article\`, famille, fournisseur , pu,qte,\`achat n=°\`,date) VALUES ('${achats[achat].article}','${achats[achat].famille}','${achats[achat].fournisseur}',${achats[achat]['prix unitaire']},${achats[achat].quantite},'${achats[achat].annee}','${achats[achat].annee}-${achats[achat].mois}-${achats[achat].jour}');`;
        runCommand(insert, res)
    })
})

/* add vente */

app.post('/ventes/add-vente', async (req, res) => {
    const ventes = req.body;
    Object.keys(ventes).map((vente) => {
        const insert = 
        `INSERT INTO ventes (\`designation d'article\`, famille, client , article, pu, qte, \`vente n=°\`, date) VALUES ('${ventes[vente].article}', '${ventes[vente].famille}', '${ventes[vente].client}', 'LN', '${ventes[vente]['prix unitaire']}', '${ventes[vente].quantite}', '${ventes[vente].annee}', '${ventes[vente].annee}-${ventes[vente].mois}-${ventes[vente].jour}');`;
        runCommand(insert, res)
    })
})

app.post('/versements/add-versement', async (req, res) => {
    const data = req.body;
    const table = data.person == 'fournisseur' ? 'versement_f' : data.person == 'client' ? 'versement_c' : ''
    if (table !== '') {
        const command = `INSERT INTO ${table} (\`versement or\`, \`versement argent\`, \`retour or\`, \`retour argent\`, \`or v\`, ${data.person == 'fournisseur' ? 'fournisseur' : 'client'} , fonte, titre, \`versement n=°\`, date) VALUES ('${data["versement or"]}', '${data["versement argent"]}', '${data["retour or"]}', '${data["retour argent"]}', '${data["or v"]}', '${data.nom}', '${data.fonte}', '${data.titre}', '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');`;
        runCommand(command, res)
    }
})

/* add importation */

app.post('/importations', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO importation (importateur) VALUES ('${data.importateur}');`;
    runCommand(command, res)
})


/* add achat d'importateur */

app.post('/importations/achat_importation/add', async (req, res) => {
    const achats = req.body;
    Object.keys(achats).map((achat) => {
        const insert = `INSERT INTO achat_importation (\`poid 18k\`, \`prix unitaire\`, importateur, date) VALUES (${achats[achat]['poid 18k']},${achats[achat]['prix unitaire']},'${achats[achat].importateur}','${achats[achat].annee}-${achats[achat].mois}-${achats[achat].jour}');`;
        runCommand(insert, res)
    })
})


/* add versement d'importateur */

app.post('/importations/versement_importation/add', async (req, res) => {
    const versement = req.body;
    const command = `INSERT INTO versement_importation (importateur, \`poid 18k\`, titre, \`versement €\`,\`change €/$\`,\`versement $\`, date) VALUES ('${versement.importateur}',${versement.poid},${versement.titre},${versement['versement €']},${versement['change €/$']},${versement['versement $']}, '${versement.annee}-${versement.mois}-${versement.jour}');`;
    runCommand(command, res)
})

let command = ''

app.post('/home', async (req, res) => {
    const {table, data} = req.body;
    switch(table) {
        case 'articles': 
            command = `INSERT INTO articles (\`designation d'article\`, article, \`prix unitaire\`, \`stock min\`) VALUES ('${data["designation d'article"]}', '${data.article}', '${data['prix unitaire']}', '${data['stock min']}');`;
            break;
        case 'ventes': 
            command = `INSERT INTO ventes (\`designation d'article\`, client , article, pu, qte, \`vente n=°\`, date) VALUES ('${data["designation d'article"]}', '${data.client}', 'LN', '${data.pu}', '${data.qte}', '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');`;
            break;
        default: 
            break;
    }
    try {
        connection.query(command, (err, valeur) => {
            if (err) {
                console.log(err)
                return
            }
            eventEmitter.emit('dataInserted');
            res.send('data inserted')
            console.log(data)
        })
    } catch(error) {
            console.log(error)
            exit(1)
            return
    }
    io.emit('datInserted', getData)
    res.send('data inserted')
    index()
})

io.on('connection', (socket) => {
    console.log('client connected')
    socket.emit('init', getData)
    socket.on('dataUpdated', () => {
        socket.emit('dataUpdated', getData)
    })
})

/* update */

let forUpdate = ''

app.put('/clients/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE clients SET nom = '${data.nom}', ville = '${data.ville}', wilaya = '${data.wilaya}', telephone = '${data.telephone}', email = '${data.email}' WHERE id = '${data.id}';`;
    runCommand(command, res)
})

app.put('/fournisseurs/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE fournisseurs SET nom = '${data.nom}', ville = '${data.ville}', wilaya = '${data.wilaya}', telephone = '${data.telephone}', email = '${data.email}' WHERE id = '${data.id}';`;
    runCommand(command, res)
})

app.put('/achats/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE achats SET \`designation d'article\` = '${data["designation d'article"]}', fournisseur = '${data.fournisseur}', famille = '${data.famille}', qte = '${data.qte}', pu = '${data.pu}' WHERE id = '${data.id}';`;
    runCommand(command, res)
})

app.put('/ventes/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE ventes SET \`designation d'article\` = '${data["designation d'article"]}', client = '${data.client}', famille = '${data.famille}', qte = '${data.qte}', pu = '${data.pu}' WHERE id = '${data.id}';`;
    console.log(data)
    console.log(command)
    // runCommand(command, res)
})

app.put('/versements/:id', (req, res) => {
    const data = req.body
    const person = (data['versement n=°']).split('-')[1] == 'FOURNISSEUR' ? 'fournisseur' : 'client'
    const table = (data['versement n=°']).split('-')[1] == 'FOURNISSEUR' ? 'versement_f' : 'versement_c'
    let command = `UPDATE ${table} SET \`versement or\` = '${data["versement or"]}', \`versement argent\` = '${data["versement argent"]}', \`retour or\` = '${data["retour or"]}', \`retour argent\` = '${data["retour argent"]}', \`or v\` = '${data["or v"]}', ${person} = '${person == 'fournisseur' ? data.fournisseur : data.client}', fonte = '${data.fonte}', titre = '${data.titre}' WHERE id = '${data.id}';`;
    runCommand(command, res)
})

app.put('/importations/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE importation SET importateur = '${data.importateur}' WHERE id = '${data.id}';`;
    runCommand(command, res)
})

app.put('/importations/achat_importation/:id', (req, res) => {
    const data = req.body
    console.log(data)
    let command = `UPDATE achat_importation SET \`poid 18k\` = ${data['poid 18k']}, \`prix unitaire\` = ${data['prix unitaire']} WHERE id = '${data.id}';`;
    runCommand(command, res)
})

app.put('/importations/versement_importation/:id', (req, res) => {
    const data = req.body
    console.log(data)
    let command = `UPDATE versement_importation SET \`poid 18k\` = ${data['poid 18k']}, \`versement €\` = ${data['versement €']}, \`change €/$\` = ${data['change €/$']}, \`versement $\` = ${data['versement $']}, titre = ${data.titre} WHERE id = '${data.id}';`;
    runCommand(command, res)
})

app.put('/home', (req, res) => {
    const {table, data} = req.body
    switch(table) {
        case 'articles': 
            forUpdate = `UPDATE articles SET \`designation d'article\` = '${data["designation d'article"]}', article = '${data.article}', \`prix unitaire\` = '${data["prix unitaire"]}', \`stock min\` = '${data["stock min"]}' WHERE id = '${data.id}';`;
            break;
        case 'ventes': 
            forUpdate = `UPDATE ventes SET \`designation d'article\` = '${data["designation d'article"]}', client = '${data.client}', qte = '${data.qte}', pu = '${data.pu}' WHERE id = '${data.id}';`;
            break;
        default: 
            break;
    }
    try {
        connection.query(forUpdate, (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            eventEmitter.emit('dataUpdated');
            res.send('data updated')
            console.log(data)
        })
        
    } catch(error) {
            console.log(error)
    }
    res.send('data updated')
    index()
})

/* delete */

app.delete('/clients/:id', (req, res) => {
    const data = parseInt(req.url.split('/')[2])
    let command = `DELETE FROM clients WHERE id = '${data}'`;
    runCommand(command, res)
})

app.delete('/fournisseurs/:id', (req, res) => {
    const data = parseInt(req.url.split('/')[2])
    let command = `DELETE FROM fournisseurs WHERE id = '${data}'`;
    runCommand(command, res)
})

app.delete('/achats/:id', (req, res) => {
    const data = parseInt(req.url.split('/')[2])
    let command = `DELETE FROM achats WHERE id = '${data}'`;
    runCommand(command, res)
})

app.delete('/ventes/:id', (req, res) => {
    const data = parseInt(req.url.split('/')[2])
    let command = `DELETE FROM ventes WHERE id = '${data}'`;
    runCommand(command, res)
})


app.delete('/versements/:id', (req, res) => {
    const {table, id} = req.body
    if (table != '') {
        let command = `DELETE FROM ${table} WHERE id = '${id}'`;
        runCommand(command, res)
    }
})

app.delete('/importations/:id', (req, res) => {
    const data = parseInt(req.url.split('/')[2])
    let command = `DELETE FROM importation WHERE id = '${data}'`;
    runCommand(command, res)
})

app.delete('/importations/achat_importation/:id', (req, res) => {
    const data = parseInt(req.url.split('/')[3])
    console.log(data)
    let command = `DELETE FROM achat_importation WHERE id = '${data}'`;
    runCommand(command, res)
})


app.delete('/importations/versement_importation/:id', (req, res) => {
    const data = parseInt(req.url.split('/')[3])
    console.log(data)
    let command = `DELETE FROM versement_importation WHERE id = '${data}'`;
    runCommand(command, res)
})

app.delete('/home', (req, res) => {
    const {table, data} = req.body
    const command = `DELETE FROM ${table} WHERE id = '${data.id}'`;
    try {
        connection.query(command, (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            eventEmitter.emit('dataDeleted');
            res.send('deleted')
            console.log(data)
        })
        console.log('done')
        
    } catch(error) {
            console.log(error)
    }
    res.send('deleted')
    index()
    
})




connection.end();

export default pool;


//ALTER TABLE table AUTO_INCREMENT = 1; ==> to account from 1