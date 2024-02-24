import express from "express";
import cors from 'cors';
import mariadb from 'mariadb'
import EventEmitter from 'events'
import {Server as SocketIOServer} from 'socket.io'
import { createServer } from "http";
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
    password: "bouzian",
    database: "bouzian",
    waitForConnections: true,
})

/* get connection */

try {
    connection = await pool.getConnection();
} catch(error) {
    console.log(error)
}

/* get view fournisseur */

async function get_view_fournisseur() {
    try {
        const rows = await connection.query('SELECT * FROM view_fournisseur ORDER BY id_fournisseur DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    } finally {
        if (connection) connection.end()
    }
}
/* get view client */

async function get_view_client() {
    try {
        const rows = await connection.query('SELECT * FROM view_client ORDER BY id_client DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    } finally {
        if (connection) connection.end()
    }
}

/* get achat et article d'un fournisseur */

async function get_view_achat_articles_fournisseur() {
    try {
        const rows = await connection.query('SELECT * FROM total_view_achats ORDER BY id_achat DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get vente et article d'un client */

async function get_view_vente_articles_client() {
    try {
        const rows = await connection.query('SELECT * FROM view_vente_articles_client ORDER BY id_vente DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get versement des fournisseurs */

async function get_view_versement_fournisseur() {
    try {
        const rows = await connection.query('SELECT * FROM view_versement_fournisseur ORDER BY id_versement_fournisseur DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get versement des client */

async function get_view_versement_client() {
    try {
        const rows = await connection.query('SELECT * FROM view_versement_client ORDER BY id_versement_client DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get view importations */

async function get_view_importation() {
    try {
        const rows = await connection.query('SELECT * FROM view_importation ORDER BY id_achat_importation DESC;;');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get importations */

async function get_importation() {
    try {
        const rows = await connection.query('SELECT * FROM importation ORDER BY id_importation DESC;');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get magasin */

async function get_magasin() {
    try {
        const rows = await connection.query('SELECT * FROM magasin ORDER BY id_magasin DESC;');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get retour client */

async function get_view_retour_client() {
    try {
        const rows = await connection.query('SELECT * FROM view_retour_client ORDER BY id_retour_client DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get retour fournisseur */

async function get_view_retour_fournisseur() {
    try {
        const rows = await connection.query('SELECT * FROM view_retour_fournisseur ORDER BY id_retour_fournisseur DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get reparation */

async function get_view_reparation() {
    try {
        const rows = await connection.query('SELECT * FROM view_reparation ORDER BY id_reparation DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get charge */

async function get_view_charge() {
    try {
        const rows = await connection.query('SELECT * FROM view_charge ORDER BY id_charge DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get titre */

async function getTitres() {
    try {
        const rows = await connection.query('SELECT id_titre, is_deleted, valeur AS titre FROM titres ORDER BY id_titre DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get view produits */

async function get_view_produits() {
    try {
        const rows = await connection.query('SELECT * FROM view_produits ORDER BY id_famille');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get view command */

async function get_view_command() {
    try {
        const rows = await connection.query('SELECT * FROM view_command ORDER BY id_command DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get view command */

async function get_view_reception() {
    try {
        const rows = await connection.query('SELECT * FROM view_reception ORDER BY id_reception DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* get casse */

async function get_casse() {
    try {
        const rows = await connection.query('SELECT casse.*, fournisseur.nom_fournisseur, client.nom_client FROM casse LEFT JOIN fournisseur ON fournisseur.id_fournisseur = casse.id_fournisseur LEFT JOIN client ON client.id_client = casse.id_client ORDER BY id_casse DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}


//li mazal 
/* get bourse */

async function getBourse() {
    try {
        const rows = await connection.query('SELECT * FROM bourse ORDER BY id DESC');
        return rows
    } catch (err) {
        console.log(err)
        throw err
    }
}

/* main function */

async function index () {
    try {
        const client = await get_view_client()
        const fournisseur = await get_view_fournisseur()
        const view_achat_articles_fournisseur = await get_view_achat_articles_fournisseur();
        const view_vente_articles_client = await get_view_vente_articles_client();
        const view_versement_client = await get_view_versement_client();
        const view_versement_fournisseur = await get_view_versement_fournisseur();
        const view_importation = await get_view_importation();
        const view_retour_client = await get_view_retour_client();
        const view_retour_fournisseur = await get_view_retour_fournisseur();
        const view_reparation = await get_view_reparation();
        const view_charge = await get_view_charge();
        const titres = await getTitres();
        const importation = await get_importation();
        const magasin = await get_magasin();
        const view_produits = await get_view_produits()
        const view_command = await get_view_command()
        const view_reception = await get_view_reception()
        const casse = await get_casse()
        // const bourse = await getBourse();
        getData = {
            client: client,
            fournisseur: fournisseur,
            view_achat_articles_fournisseur: view_achat_articles_fournisseur,
            view_vente_articles_client: view_vente_articles_client,
            view_versement_client: view_versement_client,
            view_versement_fournisseur: view_versement_fournisseur,
            view_importation: view_importation,
            view_retour_client: view_retour_client,
            view_retour_fournisseur: view_retour_fournisseur,
            view_reparation: view_reparation,
            view_charge: view_charge,
            importation: importation,
            magasin: magasin,
            view_produits: view_produits,
            titres: titres,
            view_command: view_command,
            view_reception: view_reception,
            casse: casse,
        //     bourse: bourse,
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
                return
            }
            eventEmitter.emit('dataInserted');
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
       `INSERT INTO client
       (nom_client, ville, wilaya, id_titre, telephone, email, adresse, NRC, NIF, NIS, N_art) 
       VALUES 
       ('${client.nom.toUpperCase()}',
        '${client.ville}', 
        '${client.wilaya}', 
        '${client.id_titre}', 
        '${client.telephone}',
        '${client.email}',
        '${client.adresse}',
        '${client.NRC}',
        '${client.NIF}',
        '${client.NIS}',
        '${client.N_art}');`;
        runCommand(insert, res)
})

/* add fournisseur */

app.post('/fournisseurs/add-fournisseur', async (req, res) => {
    const fournisseur = req.body;
    const insert = 
       `INSERT INTO fournisseur
       (nom_fournisseur, ville, wilaya, id_titre, telephone, email, adresse, NRC, NIF, NIS, N_art) 
       VALUES 
       ('${fournisseur.nom.toUpperCase()}',
        '${fournisseur.ville}', 
        '${fournisseur.wilaya}', 
        '${fournisseur.id_titre}', 
        '${fournisseur.telephone}',
        '${fournisseur.email}',
        '${fournisseur.adresse}',
        '${fournisseur.NRC}',
        '${fournisseur.NIF}',
        '${fournisseur.NIS}',
        '${fournisseur.N_art}');`;
        runCommand(insert, res)
})

/* add achats */

app.post('/achats/add-achat', async (req, res) => {
    const achats = req.body;
    const total_achat = achats.shift()
    const command = `INSERT INTO total_achats (quantite_achats, valeur_achats, id_fournisseur , ancien_solde, nombre_piece,\`achat total n=°\`,date) VALUES (${total_achat.total_quantite},${total_achat.total_argent},${achats[0].id_fournisseur},${total_achat.ancien_solde},${total_achat.nombre_piece},'${total_achat.annee}','${total_achat.annee}-${total_achat.mois}-${total_achat.jour}');`
    runCommand(command, res)
    let id 
    try {
        id = await connection.query('SELECT MAX(id_total_achat) AS id FROM total_achats;');
    } catch (err) {
        console.log(err)
    }
    const currentDate = new Date();
    Object.keys(achats).map((achat) => {
        const insert = 
        `INSERT INTO achats (id_total_achat, id_article, prix_unitaire , quantite,\`achat n=°\`) VALUES (${id[0].id},${achats[achat].id_article},${achats[achat].prix_unitaire},${achats[achat].quantite},'${String(currentDate.getFullYear())}');`;
        runCommand(insert, res)
    })
})

/* add vente */

app.post('/ventes/add-vente', async (req, res) => {
    const ventes = req.body;
    const total_vente = ventes.shift()
    const command = `INSERT INTO total_ventes (quantite_ventes, valeur_ventes, id_client , ancien_solde, nombre_piece,\`vente total n=°\`,date) VALUES (${total_vente.total_quantite},${total_vente.total_argent},${ventes[0].id_client},${total_vente.ancien_solde},${total_vente.nombre_piece},'${total_vente.annee}','${total_vente.annee}-${total_vente.mois}-${total_vente.jour}');`
    runCommand(command, res)
    let id 
    try {
        id = await connection.query('SELECT MAX(id_total_vente) AS id FROM total_ventes;');
    } catch (err) {
        console.log(err)
    }
    const currentDate = new Date();
    Object.keys(ventes).map((vente) => {
        const insert = 
        `INSERT INTO ventes (id_total_vente, id_article, prix_unitaire , quantite,\`vente n=°\`) VALUES (${id[0].id},${ventes[vente].id_article},${ventes[vente].prix_unitaire},${ventes[vente].quantite},'${String(currentDate.getFullYear())}');`;
        runCommand(insert, res)
    })
})

/* add versement client */

app.post('/versements/add-versement-client', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO versement_client (versement_or, versement_casse, ancien_solde, ancien_solde_casse, versement_argent, or_v , id_client, net_750, fonte, id_titre, \`versement client n=°\`, date) VALUES (${data["versement or"]}, ${data["versement casse"]}, ${data.solde}, ${0}, ${data["versement argent"]}, ${data["or v"]}, ${data.id_client}, ${data['net 750']}, ${data.fonte}, ${data.id_titre}, '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');`;
    runCommand(command, res)
})

/* add versement fournisseur */

app.post('/versements/add-versement-fournisseur', async (req, res) => {
    const data = req.body;
    const currentDate = new Date();
    const command = `INSERT INTO versement_fournisseur (versement_or, ancien_solde, versement_argent, id_fournisseur, id_titre, \`versement fournisseur n=°\`, date, id_total_achat) VALUES (${data.total_quantite_achats}, ${data.solde}, ${data.valeur_achats}, ${data.id_fournisseur}, ${data.id_titre}, '${String(currentDate.getFullYear())}', '${String(currentDate.getFullYear())}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}', ${data.id_total_achat});`;
    runCommand(command, res)
})

/* add retour */

app.post('/retours/add-retour', async (req, res) => {
    const data = req.body;
    const command = data.person === 'client' ?
    `INSERT INTO retour_client (retour_or, ancien_solde, retour_argent, id_client, \`retour client n=°\`, date) VALUES (${data['retour or']}, ${data.solde}, ${data['retour argent']}, ${data.id_client}, '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');` :
    `INSERT INTO retour_fournisseur (retour_or, ancien_solde, retour_argent, id_fournisseur, \`retour fournisseur n=°\`, date) VALUES (${data['retour or']}, ${data.solde}, ${data['retour argent']}, ${data.id_fournisseur}, '${data.annee}', '${data.annee}-${data.mois}-${data.jour}');`;
    runCommand(command, res)
})

/* add importation */

app.post('/importations', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO importation (nom_importateur) VALUES ('${data.nom_importateur}');`;
    runCommand(command, res)
})

/* add magasin */

app.post('/magasins', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO magasin (nom_magasin) VALUES ('${data.nom_magasin}');`;
    runCommand(command, res)
})

/* add reparation */

app.post('/magasins/:id/add-reparation', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO reparation (id_magasin, id_client, id_fournisseur, \`reparation n=°\`, observation, date, prix_client, prix_fournisseur, titre_client, titre_fournisseur, poids) VALUES (${data.id}, ${data.id_client}, ${data.id_fournisseur}, '${data.annee}', '${data.observation}','${data.annee}-${data.mois}-${data.jour}',${data['prix client']},${data['prix fournisseur']},${data['titre client']},${data['titre fournisseur']},${data.poids});`;
    runCommand(command, res)
})

/* add achat d'importateur */

app.post('/importations/achat_importation/add', async (req, res) => {
    const achats = req.body;
    Object.keys(achats).map((achat) => {
        const insert = `INSERT INTO achat_importation (poid_18, prix_unitaire, id_importation, \`achat importation n=°\`, date) VALUES (${achats[achat]['poid 18k']},${achats[achat]['prix unitaire']},${achats[achat].id_importation}, '${achats[achat].annee}', '${achats[achat].annee}-${achats[achat].mois}-${achats[achat].jour}');`;
        runCommand(insert, res)
    })
})

/* add versement d'importateur */

app.post('/importations/versement_importation/add', async (req, res) => {
    const versement = req.body;
    const command = versement.type === '€'  
    ? `INSERT INTO versement_importation (id_importation, poid_18, poid_24, id_titre, change_dollar_euro, versement_euro, \`versement importation n=°\`, date, versement) VALUES (${versement.id_importation},${versement['poid 18k']},${versement['poid 24k']},${versement.id_titre}, ${versement['change €/$']}, ${versement['versement €']}, '${versement.annee}', '${versement.annee}-${versement.mois}-${versement.jour}', ${versement.versement});`
    : `INSERT INTO versement_importation (id_importation, poid_18, poid_24, id_titre, versement_dollar, \`versement importation n=°\`, date, versement) VALUES (${versement.id_importation},${versement['poid 18k']},${versement['poid 24k']},${versement.id_titre}, ${versement['versement $']}, '${versement.annee}', '${versement.annee}-${versement.mois}-${versement.jour}', ${versement.versement});`;
    runCommand(command, res)
})

/* add famille */

app.post('/produits', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO familles (nom_famille) VALUES ('${data.famille}');`;
    runCommand(command, res)
})

/* add article */

app.post('/produits/:id/add', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO articles (nom_article, id_famille, id_fournisseur, prix_achat, prix_vente, valeur_stock, stock_min, mode_de_gestion) VALUES ('${data.article}', ${data.id_famille}, ${data.id_fournisseur}, ${data['prix achat']}, ${data['prix vente']}, ${data['valeur de stock']}, ${data['stock min']}, '${data['mode de gestion']}');`;
    runCommand(command, res)
})

/* add mouvement */

app.post('/bourse/add', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO bourse (date, mouvement, quantite, \`prix unitaire\`) VALUES ('${data.jour}-${data.mois}-${data.annee}', '${data.mouvement}', ${data.quantite}, ${data['prix unitaire']});`
    runCommand(command, res)
})

/* add titre */

app.post('/titres', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO titres (valeur) VALUES (${parseFloat(data.titre)});`;
    runCommand(command, res)
})

/* add sous type */

app.post('/charges/types/:id', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO sous_type_charge (id_type, nom_sous_type) VALUES (${data.id}, '${data.nom}');`;
    runCommand(command, res)
})

/* add type */

app.post('/charges/types', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO type_charge (nom_type) VALUES ('${data.nom}');`;
    runCommand(command, res)
})

/* add charge */

app.post('/charges/add-charge', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO charge (date, designation, id_sous_type, montant, utilisateur, \`charge n=°\`) VALUES ('${data.annee}-${data.mois}-${data.jour}', '${data.designation}', ${parseInt(data.id_sous_type)}, ${parseFloat(data.montant)}, '${data.utilisateur}', '${(data.annee)}');`;
    runCommand(command, res)
})

/* add command */

app.post('/commands/add-command', async (req, res) => {
    const data = req.body;
    const command = `INSERT INTO command (date, observation, id_magasin, id_client, id_fournisseur, id_article, \`command n=°\`) VALUES ('${data.annee}-${data.mois}-${data.jour}', '${data.observation}', ${parseInt(data.id_magasin)}, ${parseInt(data.id_client)}, ${parseInt(data.id_fournisseur)}, ${parseInt(data.id_article)}, '${(data.annee)}');`;
    runCommand(command, res)
})

/* add receptions */

app.post('/receptions/add-reception', async (req, res) => {
    const receptions = req.body;
    console.log(receptions)
    const total_reception = receptions.shift()
    const command = `INSERT INTO total_reception (poid, monatnt, id_fournisseur , ancien_solde, nombre_piece,\`bon n=°\`,date) VALUES (${total_reception.total_quantite},${total_reception.montant},${receptions[0].id_fournisseur},${total_reception.ancien_solde},${total_reception.nombre_piece},'${total_reception.annee}','${total_reception.annee}-${total_reception.mois}-${total_reception.jour}');`
    runCommand(command, res)
    let id 
    try {
        id = await connection.query('SELECT MAX(id_total_reception) AS id FROM total_reception;');
    } catch (err) {
        console.log(err)
    }
    const currentDate = new Date();
    Object.keys(receptions).map((rec) => {
        const insert = 
        `INSERT INTO receptions (id_total_reception, id_article, titre , quantite, chutte, prix_achat, prix_vente, prix_achat_facon, prix_vente_facon, montant_achat, montant_vente) VALUES (${id[0].id},${receptions[rec].id_article},${receptions[rec].titre},${receptions[rec].quantite},${receptions[rec].chutte},${receptions[rec]['prix achat']},${receptions[rec]['prix vente']},${receptions[rec]['prix achat facon']},${receptions[rec]['prix vente facon']},${receptions[rec]['montant achat']},${receptions[rec]['montant vente']});`;
        runCommand(insert, res)
    })
})

/* add casse */

app.post('/casse/add-casse', async (req, res) => {
    const data = req.body;
    console.log(data)
    const command = data.operation === 'achat' ?
     `INSERT INTO casse (date, observation, operation, id_fournisseur, person, prix, poid, total, ancien_solde,nouveau_solde, niveau_stock, \`casse n=°\`) VALUES ('${data.annee}-${data.mois}-${data.jour}', '${data.observation}', 'achat', ${parseInt(data.id_fournisseur)}, 'fournisseur',${parseInt(data.prix)},${parseInt(data.poid)},${parseInt(data.total)},${parseInt(data.solde)},${parseInt(data.solde) + parseInt(data.total)}, '${data.niveau_de_stock}', '${(data.annee)}');` :
     data.operation === 'vente' ?
     `INSERT INTO casse (date, observation, operation, id_client, person, prix, poid, total, ancien_solde,nouveau_solde, niveau_stock, \`casse n=°\`) VALUES ('${data.annee}-${data.mois}-${data.jour}', '${data.observation}', 'vente', ${parseInt(data.id_client)}, 'client',${parseInt(data.prix)},${parseInt(data.poid)}, ${parseInt(data.total)},${parseInt(data.solde)},${parseInt(data.solde) + parseInt(data.total)}, '${data.niveau_de_stock}','${(data.annee)}');` :
     data.operation === 'versement client' ?
     `INSERT INTO casse (date, observation, operation, id_client, person, prix, poid, total, ancien_solde,nouveau_solde, niveau_stock, \`casse n=°\`) VALUES ('${data.annee}-${data.mois}-${data.jour}', '${data.observation}', 'versement client', ${parseInt(data.id_client)}, 'client',${parseInt(data.argent)},${parseInt(data.poid)},${parseInt(data.argent)},${parseInt(data.solde)},${parseInt(data.solde) - parseInt(data.argent)}, '${data.niveau_de_stock}', '${(data.annee)}');` :
     `INSERT INTO casse (date, observation, operation, id_fournisseur, person, prix, poid,total, ancien_solde,nouveau_solde, niveau_stock, \`casse n=°\`) VALUES ('${data.annee}-${data.mois}-${data.jour}', '${data.observation}', 'versement fournisseur', ${parseInt(data.id_fournisseur)}, 'fournisseur',${parseInt(data.argent)},${parseInt(data.poid)}, ${parseInt(data.argent)},${parseInt(data.solde)}, ${parseInt(data.solde) - parseInt(data.argent)}, '${data.niveau_de_stock}', '${(data.annee)}');`;
    runCommand(command, res)
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

/* update clients */

app.put('/clients/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE client SET nom_client = '${data.nom.toUpperCase()}', ville = '${data.ville}', wilaya = '${data.wilaya}', telephone = '${data.telephone}', adresse = '${data.adresse}', email = '${data.email}' WHERE id_client = '${data.id_client}';`;
    runCommand(command, res)
})

/* update fournisseurs */

app.put('/fournisseurs/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE fournisseur SET nom_fournisseur = '${data.nom.toUpperCase()}', ville = '${data.ville}', wilaya = '${data.wilaya}', telephone = '${data.telephone}', adresse = '${data.adresse}', email = '${data.email}' WHERE id_fournisseur = '${data.id_fournisseur}';`;
    runCommand(command, res)
})

/* update achats */

app.put('/achats/:id/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE achats SET prix_unitaire = ${data.prix_unitaire}, quantite = ${data.quantite} WHERE id_achat = '${data.id_achat}';`;
    runCommand(command, res)
})

/* update ventes */

app.put('/ventes/:id/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE ventes SET prix_unitaire = ${data.prix_unitaire}, quantite = ${data.quantite} WHERE id_vente = '${data.id_vente}';`;
    runCommand(command, res)
})

/* update versements */

app.put('/versements/:id', (req, res) => {
    const data = req.body
    let command =  data.type === 'client' ?
    `UPDATE versement_client SET versement_or = ${data["versement or"]}, versement_argent = ${data["versement argent"]}, or_v = ${data["or v"]}, fonte = '${data.fonte}', versement_casse = ${data['versement casse']} WHERE id_versement_client = '${data.id}';` :
    `UPDATE versement_fournisseur SET versement_or = ${data["versement or"]}, versement_argent = ${data["versement argent"]}, or_v = ${data["or v"]}, fonte = '${data.fonte}', versement_casse = ${data['versement casse']} WHERE id_versement_fournisseur = '${data.id}';`;
    runCommand(command, res)
})

/* update retours */

app.put('/retours/:id', (req, res) => {
    const data = req.body
    let command =  data.type === 'client' ?
    `UPDATE retour_client SET retour_or = ${data.retour_or}, retour_argent = ${data.retour_argent} WHERE id_retour_client = '${data.id}';` :
    `UPDATE retour_fournisseur SET retour_or = ${data.retour_or}, retour_argent = ${data.retour_argent} WHERE id_retour_fournisseur = '${data.id}';`;
    runCommand(command, res)
})

/* update importation */

app.put('/importations/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE importation SET nom_importateur = '${data.nom_importateur}' WHERE id_importation = '${data.id_importation}';`;
    runCommand(command, res)
})

/* update magasin */

app.put('/magasins', (req, res) => {
    const data = req.body
    let command = `UPDATE magasin SET nom_magasin = '${data.nom_magasin}' WHERE id_magasin = '${data.id_magasin}';`;
    runCommand(command, res)
})

/* update reparation */

app.put('/magasins/:id/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE reparation SET titre_client = ${data.client_titre}, prix_client = ${data.prix_client}, poids = ${data.poids}, prix_fournisseur = ${data.prix_fournisseur}, titre_fournisseur = ${data.fournisseur_titre}, observation = '${data.observation}' WHERE id_reparation = ${data.id_reparation};`;
    runCommand(command, res)
})

/* update achat d'importation */

app.put('/importations/achat_importation/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE achat_importation SET poid_18 = ${data['poid 18k']}, prix_unitaire = ${data['prix unitaire']} WHERE id_achat_importation = '${data.id_achat_importation}';`;
    runCommand(command, res)
})

/* update versement d'importation */

app.put('/importations/versement_importation/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE versement_importation SET poid_18 = ${data['poid 18k']}, poid_24 = ${data['poid 24k']}, versement_dollar = ${data['versement $']}, change_dollar_euro = ${data['change €/$']}, versement_euro = ${data['versement €']}, id_titre = ${data.id_titre}, versement = ${data.versement} WHERE id_versement_importation = ${data.id_versement_importation};`;
    runCommand(command, res)
})

/* update famille */

app.put('/produits/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE familles SET nom_famille = '${data.nom}' WHERE id_famille = ${data.id};`;
    runCommand(command, res)
})

/* update article */

app.put('/produits/:id/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE articles SET id_fournisseur = ${data.id_fournisseur}, prix_achat = ${data["prix achat"]}, prix_vente = ${data['prix vente']}, valeur_stock = ${data["valeur de stock"]}, stock_min = ${data["stock min"]}, mode_de_gestion = '${data["mode de gestion"]}', nom_article = '${data.nom_article}' WHERE id_article = ${data.id_article};`;
    runCommand(command, res)
})

/* update titre */

app.put('/titres/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE titres SET valeur = ${parseFloat(data.titre)} WHERE id_titre = ${data.id_titre};`;
    runCommand(command, res)
})

/* update type */

app.put('/charges/types/:id', (req, res) => {
    const data = req.body
    let command =  data.type === 'type' ?
    `UPDATE type_charge SET nom_type = '${data.nom}' WHERE id_type = ${data.id};` :
    `UPDATE sous_type_charge SET nom_sous_type = '${data.nom}' WHERE id_sous_type = ${data.id};`;
    runCommand(command, res)
})

/* update charge */

app.put('/charges/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE charge SET montant = ${data.montant}, designation = '${data.designation}' WHERE id_charge = ${data.id_charge};`;
    runCommand(command, res)
})

/* update command */

app.put('/commands/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE command SET observation = '${data.observation}', id_article = ${data.id_article}, id_client = ${data.id_client}, id_fournisseur = ${data.id_fournisseur} WHERE id_command = ${data.id_command};`;
    runCommand(command, res)
})

/* delete */

app.delete('/clients/:id', (req, res) => {
    const data = parseInt(req.url.split('/')[2])
    let command = `UPDATE client SET is_deleted = ${true} WHERE id_client = '${data}';`;
    runCommand(command, res)
})

app.delete('/fournisseurs/:id_fournisseur', (req, res) => {
    const data = parseInt(req.url.split('/')[2])
    let command = `UPDATE fournisseur SET is_deleted = ${true} WHERE id_fournisseur = '${data}';`;
    runCommand(command, res)
})

app.delete('/achats/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE total_achats SET is_deleted = ${true} WHERE id_total_achat = ${data['0'].id_total_achat}`;
    runCommand(command, res)
})

app.delete('/achats/:id/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE achats SET is_deleted = ${true} WHERE id_achat = ${data.id_achat}`;
    runCommand(command, res)
})

app.delete('/ventes/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE total_ventes SET is_deleted = ${true} WHERE id_total_vente = ${data['0'].id_total_vente}`;
    runCommand(command, res)
})

app.delete('/ventes/:id/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE ventes SET is_deleted = ${true} WHERE id_vente = ${data.id_vente}`;
    runCommand(command, res)
})

app.delete('/versements/:id', (req, res) => {
    const data = req.body
        let command = data.type === 'fournisseur' ? `UPDATE versement_fournisseur SET is_deleted = ${true} WHERE id_versement_fournisseur = '${data.id}';` : `UPDATE versement_client SET is_deleted = ${true} WHERE id_versement_client = '${data.id}';`;
            runCommand(command, res)
})

app.delete('/retours/:id', (req, res) => {
    const data = req.body
        let command = data.type === 'fournisseur' ? `UPDATE retour_fournisseur SET is_deleted = ${true} WHERE id_retour_fournisseur = '${data.id}';` : `UPDATE retour_client SET is_deleted = ${true} WHERE id_retour_client = '${data.id}';`;
            runCommand(command, res)
})

app.delete('/importations/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE importation SET is_delete = ${true} WHERE id_importation = '${data.id}';`;
    runCommand(command, res)
})

app.delete('/importations/achat_importation/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE achat_importation SET is_delete = ${true} WHERE id_achat_importation = '${data.id_achat_importation}';`;
    runCommand(command, res)
})

app.delete('/importations/versement_importation/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE versement_importation SET is_delete = ${true} WHERE id_versement_importation = '${data.id_versement_importation}';`;
    runCommand(command, res)
})

app.delete('/magasins', (req, res) => {
    const data = req.body
    let command = `UPDATE magasin SET is_deleted = ${true} WHERE id_magasin = '${data.id}';`;
    runCommand(command, res)
})

app.delete('/magasins/:id/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE reparation SET is_deleted = ${true} WHERE id_reparation = '${data.id_reparation}';`;
    runCommand(command, res)
})

app.delete('/produits/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE familles SET is_deleted = ${true} WHERE id_famille = '${data.id}';`;
    runCommand(command, res)
})

app.delete('/produits/:id/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE articles SET is_deleted = ${true} WHERE id_article = '${data.id_article}';`;
    runCommand(command, res)
})

app.delete('/titres/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE titres SET is_deleted = ${true} WHERE id_titre = ${data.id_titre};`;
    runCommand(command, res)
})

app.delete('/charges/types/:id', (req, res) => {
    const data = req.body
    let command =  data.type === 'type' ? `UPDATE type_charge SET is_deleted = ${true} WHERE id_type = ${data.id};` : `UPDATE sous_type_charge SET is_deleted = ${true} WHERE id_sous_type = ${data.id};`;
    runCommand(command, res)
})

app.delete('/charges/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE charge SET is_deleted = ${true} WHERE id_charge = ${data.id_charge};`;
    runCommand(command, res)
})

app.delete('/commands/:id', (req, res) => {
    const data = req.body
    let command = `UPDATE command SET is_deleted = ${true} WHERE id_command = ${data.id_command};`;
    runCommand(command, res)
})

connection.end();

export default pool;


//ALTER TABLE table AUTO_INCREMENT = 1; ==> to account from 1