const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const db = require('./config/db');

require('./models/Usuario')
const Usuario = mongoose.model('usuarios')


const app = express();

//configs

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')

mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(suc => console.log('conectado ao banco de dados com sucesso!'))
    .catch(err => console.error('Erro ao tentar conectar ao mongoDB ' + err))

//avisa para o express que todas os arquivos estaticos (como arquivos css/js) estao na pasta public
app.use(express.static(path.join(__dirname, 'public')));

///

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/cadastrar', (req, res) => {
    let erros = [];
    if (!req.body.nome) {
        erros.push({ aviso: 'Verifique o nome digitado' })
    }
    if (!req.body.senha) {
        erros.push({ aviso: 'Verifique a senha digitada' })
    }
    if (!req.body.idade) {
        erros.push({ aviso: 'Verifique a idade digitada' })
    }
    if (!req.body.cidade) {
        erros.push({ aviso: 'Verifique a cidade digitada' })
    }

    if (erros.length > 0) {
        res.render('index', { erros })
    } else {
        const novoUsuario = {
            nome: req.body.nome,
            senha: req.body.senha,
            idade: req.body.idade,
            cidade: req.body.cidade
        }

        new Usuario(novoUsuario).save()
            .then(suc => {
                const sucesso = { mensagem: 'Cadastrado com sucesso' }
                res.render('index', { sucesso })
            }).catch(err => {
                console.error('Houve um erro ao tentar registrar o usuario, teste novamente!');
                res.redirect('/')
            })
    }

})

app.get('/visualizar-usuarios', (req, res) => {
    Usuario.find().sort({ nome: 'desc' })
        .then(usuarios => {
            res.render('usuarios/usuarios', { usuarios })
        }).catch(err => {
            const erro = { aviso: 'Não foi possível visualizar os usuarios cadastrados' }
            res.render('usuarios/usuarios', { erro })
        })
})

app.get('/remover/:id', (req, res) => {
    Usuario.deleteOne({ _id: req.params.id })
        .then(suc => {
            res.redirect('/')
        }).catch(err => {
            res.send('Houve um erro ao tentar remover o usuario, tente novamente')
        })
})

app.get('/editar/:id', (req, res) => {
    Usuario.findOne({ _id: req.params.id })
        .then(usuario => {
            res.render('usuarios/editar', { usuario })
        }).catch(err => {
            console.error('Erro ao tentar editar usuario')
        })
})

app.post('/editar', (req, res) => {
    let erros = [];
    if (!req.body.nome) {
        erros.push({ aviso: 'Verifique o nome digitado' })
    }
    if (!req.body.senha) {
        erros.push({ aviso: 'Verifique a senha digitada' })
    }
    if (!req.body.idade) {
        erros.push({ aviso: 'Verifique a idade digitada' })
    }
    if (!req.body.cidade) {
        erros.push({ aviso: 'Verifique a cidade digitada' })
    }

    if (erros.length > 0) {
        res.render('index', { erros })
    } else {

        Usuario.findOne({_id : req.body.id})
            .then(usuario => {
                usuario.nome = req.body.nome,
                usuario.senha = req.body.senha,
                usuario.idade = req.body.idade,
                usuario.cidade = req.body.cidade
               
                usuario.save()
                    .then( suc => {
                        res.redirect('/visualizar-usuarios')
                    }).catch(err => {
                        console.error('Houve um erro ao tentar editar o usuario 2' + err);
                        res.redirect('/visualizar-usuarios')
                    })

            }).catch(err => {
                console.error('Houve um erro ao tentar editar o usuario' + err);
                res.redirect('/visualizar-usuarios')
            })
  
    }
})



const port = 8080;
app.listen(port, _ => console.log('Servidor iniciado na porta' + port))