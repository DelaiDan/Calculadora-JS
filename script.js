//Criação de classe
class Calculadora{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    //Operações

    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }
    
    delete(){
        //"Corta" a string, tirando o último caracter
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number){
        //Impede repetição de pontos
        if(number === '.' && this.currentOperand.includes('.')) return; 
        this.currentOperand = this.currentOperand.toString() + number.toString();
        //Concatena os numeros

    }

    chooseOperation(operation){
        if (this.currentOperand === '') return;
        if(this.previousOperand !== ''){
            this.compute();
        }
        //Passa para cima, atribui o operador e limpa o atual
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }


    compute(){
        //Converter uma string concatenada em float para realizar operações
        let computation;
        const prev = parseFloat(this.previousOperand); //Retorna um float do valor determinado
        const current = parseFloat(this.currentOperand); //Retorna um float do valor determinado
        console.log(prev);
        console.log(current);
        if(isNaN(prev) || isNaN(current)) return;
        //Para cada operador
        switch (this.operation){
            case '+':
                computation = prev + current
                break;
            case '-':
                computation = prev - current
                break;
            case '*':
                computation = prev * current
                break
            case '/':
                computation = prev / current
                break
            default:
                return
        }

        //Storage
        this.currentStorage = current;
        this.previousStorage = prev;
        this.operationStorage = this.operation;
        this.computationStorage = computation;
        this.calcHistory();
        //
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    //Ajeitar Display para vírgulas e pontos nas casas de milhar
    getDisplayNumber(number){
        const stringNumber = number.toString();
        //Separar entre inteiros e decimais
        const intergerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        console.log(intergerDigits);
        console.log(decimalDigits);
        let intergerDisplay;
        if (isNaN(intergerDigits)){
            intergerDisplay = '';
        } else {
            intergerDisplay = intergerDigits.toLocaleString('en', {
            maximumFractionDigits: 0})
        }
        if(decimalDigits != null){
            return `${intergerDisplay}.${decimalDigits}`;
        } else {
            return intergerDisplay;
        }
    }

    updateDisplay(){
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if(this.operation != null){
            this.previousOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else{
            this.previousOperandTextElement.innerText = '';
        }
    }

    calcHistory(){
        this.stringStorage = this.previousStorage.toString() + " " + this.operationStorage.toString() + " " +
            this.currentStorage.toString() + " = " + this.computationStorage.toString();

        //Criar uma Div, itens Li e atrelar o valor da string para eles
        const histDiv = document.createElement("div");
        histDiv.classList.add("historico");

        const histLi = document.createElement('li');
        histLi.innerText = this.stringStorage;
        histDiv.appendChild(histLi);

        stringStorageTextElement.appendChild(histDiv);
        //

        this.saveStorageString(this.stringStorage);
    }

    saveStorageString(){
        let contentStorage;
        if(localStorage.getItem('contentStorage') === null){
            contentStorage = [];
        } else {
            contentStorage = JSON.parse(localStorage.getItem('contentStorage'));
        }
        contentStorage.push(this.stringStorage);
        localStorage.setItem('contentStorage', JSON.stringify(contentStorage));
    }

    getStorageString(){
        let contentStorage;
        let contentString = stringStorageTextElement;
        if(localStorage.getItem('contentStorage') === null){
            contentStorage = [];
        } else {
            contentStorage = JSON.parse(localStorage.getItem('contentStorage'));
        }
        contentStorage.forEach(function(contentString){
            const histDiv = document.createElement("div");
            histDiv.classList.add("historico");

            const histLi = document.createElement('li');
            histLi.innerText = contentString;
            histDiv.appendChild(histLi);

            stringStorageTextElement.appendChild(histDiv);
        })
    }

    limparStorage(event){
        if(window.confirm("Você deseja APAGAR TODO o seu HISTÓRICO?")){
            localStorage.clear();
            location.reload();
        }
    }
}

//Variáveis
//querySelector retorna o elemento que está dentro do documento
//querySelectorAll retorna todos os elementos
const numberBtn = document.querySelectorAll('[data-number]');
const operationBtn = document.querySelectorAll('[data-operation]');
const equalsBtn = document.querySelector('[data-equals]');
const deleteBtn = document.querySelector('[data-delete]');
const allClearBtn = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-operador-ant]');
const currentOperandTextElement = document.querySelector('[data-operador-atual]');
const stringStorageTextElement = document.querySelector('.historico');
const limparBtn = document.querySelector('.limpar-historico');
const escolherBtn = document.querySelector('#escolherBtn');


//Funções que ocorrem quando os botões forem pressionados
const calculadora = new Calculadora(previousOperandTextElement, currentOperandTextElement)


//EventListener registra um elemento determinado. Ex: esperar por um click
document.addEventListener('DOMContentLoaded', calculadora.getStorageString);
limparBtn.addEventListener('click', calculadora.limparStorage);


numberBtn.forEach(button => {
    button.addEventListener('click', () =>{
        calculadora.appendNumber(button.innerText);
        calculadora.updateDisplay();
    })
})

operationBtn.forEach(button => {
    button.addEventListener('click', () =>{
        calculadora.chooseOperation(button.innerText);
        calculadora.updateDisplay();
    })
})

equalsBtn.addEventListener('click', button => {
    calculadora.compute();
    calculadora.updateDisplay();
})

allClearBtn.addEventListener('click', button => {
    calculadora.clear();
    calculadora.updateDisplay();
})

deleteBtn.addEventListener('click', button => {
    calculadora.delete();
    calculadora.updateDisplay();
})

//Ler comandos do teclado
window.addEventListener('keydown', function(e){
    var my_key = keyCodesListNumber[e.keyCode];
    if(typeof my_key !== 'undefined'){
        if(typeof my_key == 'number' || my_key == "."){
            calculadora.appendNumber(my_key);
            calculadora.updateDisplay();
        }

        if(typeof my_key == 'string' && my_key != "=" && my_key != "."){
            calculadora.chooseOperation(my_key);
            calculadora.updateDisplay();
        }

        if(my_key == "="){
            calculadora.compute();
            calculadora.updateDisplay();
        }
    }
     
    if(e.keyCode == 8 || e.keyCode == 46){
        calculadora.delete();
        calculadora.updateDisplay();
    }

    if(e.keyCode == 27){
        calculadora.clear();
        calculadora.updateDisplay();
    }
})

const keyCodesListNumber = {
    48: 0,
    49: 1,
    50: 2,
    51: 3,
    52: 4,
    53: 5,
    54: 6,
    55: 7,
    56: 8,
    57: 9,
    111: "/",
    106: "*",
    109: "-",
    107: "+",
    110: ".",
    188: ".",
    190: ".",
    13: "=",
};
