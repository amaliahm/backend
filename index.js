import express from "express";
import cors from 'cors';
import mariadb from 'mariadb'
import EventEmitter from 'events'
import {Server as SocketIOServer} from 'socket.io'
import { createServer } from "http";

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
        const rows = await connection.query('SELECT * FROM clients');
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
        const rows = await connection.query('SELECT * FROM fournisseurs');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getVentes() {
    try {
        const rows = await connection.query('SELECT * FROM ventes');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getArticltes() {
    try {
        const rows = await connection.query('SELECT * FROM articles');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getAchats() {
    try {
        const rows = await connection.query('SELECT * FROM achats');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getVersementF() {
    try {
        const rows = await connection.query('SELECT * FROM versement_f');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getVersementC() {
    try {
        const rows = await connection.query('SELECT * FROM versement_c');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* main function */


async function index () {
    try {
        const clients = await getClients();
        const fournisseurs = await getFournisseurs();
        const ventes = await getVentes();
        const articles = await getArticltes();
        const achats = await getAchats();
        const versement_f = await getVersementF();
        const versement_c = await getVersementC();
        getData = {
            clients: clients,
            fournisseurs: fournisseurs,
            ventes: ventes,
            articles: articles,
            achats: achats,
            versement_f: versement_f,
            versement_c: versement_c,
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
    res.json('heyyy backend')
})

app.get('/home', (req, res) => {
    res.json(getData)
})

/* add */

let command = ''

app.post('/home', async (req, res) => {
    const {table, data} = req.body;
    switch(table) {
        case 'clients': 
            command = `INSERT INTO clients (nom, ville, wilaya, telephone) VALUES ('${data.nom}', '${data.ville}', '${data.wilaya}', '${data.telephone}');`;
            break;
        case 'fournisseurs': 
            command = `INSERT INTO fournisseurs (nom, ville, wilaya, telephone) VALUES ('${data.valeur}', '${data.valeur}', '${data.valeur}', '${data.valeur}');`;
            break;
        case 'articles': 
            command = `INSERT INTO articles (\`designation d'article\`, article, \`prix unitaire\`, \`stock min\`, \`qte stock\`) VALUES ('${data["designation d'article"]}', '${data.article}', '${data['prix unitaire']}', '${data['stock min']}', 150);`;
            break;
        case 'ventes': 
            command = `INSERT INTO ventes (\`designation d'article\`, client , article, pu, qte, \`vente n=°\`, date) VALUES ('${data["designation d'article"]}', '${data.client}', 'LN', '${data['prix unitaire']}', 1, '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');`;
            break;
        case 'achats':
            command = `INSERT INTO achats (\`designation d'article\`, fournisseur , pu, qte, \`achat n=°\`, date) VALUES ('${data["designation d'article"]}', '${data.fournisseur}', '${data.pu}', '${data.qte}', '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');`;
            break;
        case 'versement_c' :
            command = `INSERT INTO versement_c (\`versement or\`, \`versement argent\`, \`retour or\`, \`retour argent\`, \`or v\`, client , fonte, titre, \`versement n=°\`, date) VALUES ('${data["versement or"]}', '${data["versement argent"]}', '${data["retour or"]}', '${data["retour argent"]}', '${data["or v"]}', '${data.person}', '${data.fonte}', '${data.titre}', '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');`;
            break;
        case 'versement_f' :
            command = `INSERT INTO versement_f (\`versement or\`, \`versement argent\`, \`retour or\`, \`retour argent\`, \`or v\`, fournisseur , fonte, titre, \`versement n=°\`, date) VALUES ('${data["versement or"]}', '${data["versement argent"]}', '${data["retour or"]}', '${data["retour argent"]}', '${data["or v"]}', '${data.person}', '${data.fonte}', '${data.titre}', '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');`;
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

app.put('/home', (req, res) => {
    const {table, data} = req.body
    switch(table) {
        case 'clients': 
            forUpdate = `UPDATE clients SET nom = '${data.nom}', ville = '${data.ville}', wilaya = '${data.wilaya}', telephone = '${data.telephone}' WHERE id = '${data.id}';`;
            break;
        case 'fournisseurs': 
            forUpdate = `UPDATE fournisseurs SET nom = '${data.nom}', ville = '${data.ville}', wilaya = '${data.wilaya}', telephone = '${data.telephone}' WHERE id = '${data.id}';`;
        case 'articles': 
            forUpdate = `UPDATE articles SET \`designation d'article\` = '${data["designation d'article"]}', article = '${data.article}', \`prix unitaire\` = '${data["prix unitaire"]}', \`stock min\` = '${data["stock min"]}' WHERE id = '${data.id}';`;
            break;
        case 'ventes': 
            forUpdate = `UPDATE ventes SET \`designation d'article\` = '${data["designation d'article"]}', client = '${data.client}', qte = '${data.qte}', pu = '${data.pu}' WHERE id = '${data.id}';`;
            break;
        case 'achats': 
            forUpdate = `UPDATE achats SET \`designation d'article\` = '${data["designation d'article"]}', fournisseur = '${data.fournisseur}', qte = '${data.qte}', pu = '${data.pu}' WHERE id = '${data.id}';`;
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