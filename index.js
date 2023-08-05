const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Plugin para realizar a leitura do body
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: "*"
}));

const tarefas = [];

// req (Request): Os dados da requisição feita pelo cliente
// res (Response): Os dados que vão ser enviados do servidor para o cliente
app.get("/", (req, res) => {
    res.send("<h1>API de tarefas está funcionado!</h1>")
});

// Obter todas as tarefas
app.get("/tarefas", (req, res) => {
    res.json(tarefas);
});

// Cadastrar tarefas
app.post("/tarefas", (req, res) => {
    const { descricao } = req.body;

    // Validar se a descrição está preenchida
    if (!descricao.trim()) {
        res.status(400).json({ error: "descrição inválida" });
        return;
    }

    // Validar se a tarefa já existe
    const tarefa = tarefas.find(tarefa => tarefa.descricao === descricao);

    if (tarefa) {
        res.status(409).json({ error: "já existe uma tarefa com essa descrição" });
        return;
    }
    
    const novaTarefa = {
        id: (tarefas[tarefas.length - 1]?.id ?? 0) + 1,
        descricao,
        concluida: false
    };

    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

// Alterar uma tarefa
app.put("/tarefas/:id", (req, res) => {
    const id = req.params.id;

    const index = tarefas.map(tarefa => tarefa.id).indexOf(+id);

    if (index === -1) {
        res.status(404).json({ error: "tarefa com o ID informado não foi encontrada" });
        return;
    }

    tarefas[index] = {
        ...tarefas[index],
        ...req.body
    };

    res.json(tarefas[index]);
});

// Remover tarefa
app.delete("/tarefas/:id", (req, res) => {
    const id = req.params.id;

    const index = tarefas.map(tarefa => tarefa.id).indexOf(+id);

    if (index === -1) {
        res.status(404).json({ error: "tarefa com o ID informado não foi encontrada" });
        return;
    }

    tarefas.splice(index, 1);
    res.status(204).end()
});

app.listen(8080, () => console.log("Servidor está rodando!"))

