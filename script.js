// Lista inicial de gastos
let gastos = [
    { descricao: "Condomínio", valor: 686.00 },
    { descricao: "IPTU", valor: 139.00 },
    { descricao: "NET", valor: 361.00 },
    { descricao: "Celular", valor: 153.00 },
    { descricao: "Gás", valor: 80.00 }
];

let chart = null;

// Listar gastos
function listarGastos() {
    const output = document.getElementById("output");
    output.innerHTML = "<h2>Lista de Gastos</h2>";
    gastos.forEach(gasto => {
        output.innerHTML += `<p>${gasto.descricao}: R$ ${gasto.valor.toFixed(2)}</p>`;
    });
}

// Atualizar gráfico
function atualizarGrafico() {
    const canvas = document.getElementById("gastosChart").getContext("2d");
    const labels = gastos.map(gasto => gasto.descricao);
    const valores = gastos.map(gasto => gasto.valor);

    if (chart) chart.destroy(); // Destroi o gráfico anterior

    chart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: "Gastos (R$)",
                data: valores,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#C9CBCF', '#FF5C58', '#84A59D'
                ],
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const valor = tooltipItem.raw;
                            const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
                            const percentual = ((valor / total) * 100).toFixed(2);
                            return `Valor: R$ ${valor.toFixed(2)} (${percentual}%)`;
                        }
                    }
                }
            }
        }
    });

    calcularTotal();
}

// Calcular e exibir total
function calcularTotal() {
    const total = gastos.reduce((acc, gasto) => acc + gasto.valor, 0);
    document.getElementById("total-gastos").innerHTML = `Total de Gastos: R$ ${total.toFixed(2)}`;
}

// Exibir formulário
function exibirFormulario() {
    document.getElementById("form-container").classList.remove("hidden");
}

// Fechar formulário
function fecharFormulario() {
    document.getElementById("form-container").classList.add("hidden");
}

// Adicionar ou atualizar gasto
function adicionarOuAtualizarGasto(event) {
    event.preventDefault();
    const descricao = document.getElementById("descricao").value.trim();
    const valor = parseFloat(document.getElementById("valor").value);

    if (!descricao || isNaN(valor)) {
        alert("Preencha os campos corretamente.");
        return;
    }

    const gastoExistente = gastos.find(gasto => gasto.descricao.toLowerCase() === descricao.toLowerCase());
    if (gastoExistente) {
        gastoExistente.valor = valor;
        exibirMensagem(`Gasto "${descricao}" atualizado com sucesso!`);
    } else {
        gastos.push({ descricao: descricao, valor: valor });
        exibirMensagem(`Gasto "${descricao}" adicionado com sucesso!`);
    }

    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    fecharFormulario();
    listarGastos();
    atualizarGrafico();
}

// Alterar tipo de gráfico
function alterarTipo(tipo) {
    if (chart) {
        chart.config.type = tipo;
        chart.update();
    }
}

// Exibir mensagem de sucesso
function exibirMensagem(mensagem) {
    const msg = document.createElement("div");
    msg.className = "mensagem-sucesso";
    msg.textContent = mensagem;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// Importar CSV
function importarCSV(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        const linhas = reader.result.split("\n").filter(linha => linha.trim() !== "");
        linhas.forEach(linha => {
            const [descricao, valor] = linha.split(",");
            if (descricao && !isNaN(parseFloat(valor))) {
                gastos.push({ descricao: descricao.trim(), valor: parseFloat(valor) });
            }
        });
        listarGastos();
        atualizarGrafico();
    };
    reader.readAsText(file);
}

// Inicializa o gráfico ao carregar a página
window.onload = function () {
    atualizarGrafico();
    listarGastos();
};
