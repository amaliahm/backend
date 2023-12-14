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

/* main function */


async function index () {
    try {
        const clients = await getClients();
        const fournisseurs = await getFournisseurs();
        const ventes = await getVentes();
        const articles = await getArticltes();
        getData = {
            clients: clients,
            fournisseurs: fournisseurs,
            ventes: ventes,
            articles: articles
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

function addClient(valeur) {
    command = `INSERT INTO clients (nom, ville, wilaya, telephone) VALUES ('${valeur.nom}', '${valeur.ville}', '${valeur.wilaya}', '${valeur.telephone}');`;
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
}

function addFournisseur(valeur) {
    command = `INSERT INTO fournisseurs (nom, ville, wilaya, telephone) VALUES ('${data.valeur}', '${data.valeur}', '${data.valeur}', '${data.valeur}');`;
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
}

function addArticle (valeur) {
    console.log(valeur)
    command = `INSERT INTO articles (\`designation d'article\`, article, \`prix unitaire\`, \`stock min\`, \`qte stock\`) VALUES ('${valeur["designation d'article"]}', '${valeur.article}', '${valeur['prix unitaire']}', '${valeur['stock min']}', 150);`;
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
}

function addVente(valeur) {
    console.log(valeur)
    command = `INSERT INTO ventes (\`designation d'article\`, client , article, pu, qte, \`vente n=°\`, date) VALUES ('${valeur["designation d'article"]}', '${valeur.client}', 'LN', '${valeur['prix unitaire']}', 1, '${valeur.annee}', '${valeur.annee}-${valeur.mois}-${valeur.jour}');`;
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
}

app.post('/home', async (req, res) => {
    const {table, data} = req.body;
    switch(table) {
        case 'clients': 
            addClient(data)
            break;
        case 'fournisseurs': 
            addFournisseur(data)
            break;
        case 'articles': 
            addArticle(data)
            break;
        case 'ventes': 
            addVente(data)
            break;
        default: 
            break;
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
            break;
        case 'fournisseurs': 
            forUpdate = `UPDATE fournisseurs SET nom = '${data.nom}', ville = '${data.ville}', wilaya = '${data.wilaya}', telephone = '${data.telephone}' WHERE id = '${data.id}';`;
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
            break;
        
        case 'articles': 
            forUpdate = `UPDATE articles SET \`designation d'article\` = '${data["designation d'article"]}', article = '${data.article}', \`prix unitaire\` = '${data["prix unitaire"]}', \`stock min\` = '${data["stock min"]}' WHERE id = '${data.id}';`;
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
            break;
        default: 
            break;
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