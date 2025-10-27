// SISTEMA DE MÚLTIPLAS CALCULADORAS
let calculators = [];
let currentCalculatorId = null;
let calculatorIdCounter = 1;

// Elementos do Sidebar
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const newCalculatorBtn = document.getElementById('new-calculator-btn');
const calculatorList = document.getElementById('calculator-list');

// Elementos DOM
const initialScreen = document.getElementById('initial-screen');
const discountScreen = document.getElementById('discount-screen');
const installmentScreen = document.getElementById('installment-screen');
const actionScreen = document.getElementById('action-screen');
const debitValueInput = document.getElementById('debit-value');
const daysOverdueInput = document.getElementById('days-overdue');
const cashButton = document.getElementById('cash-button');
const installmentButton = document.getElementById('installment-button');
const backButton = document.getElementById('back-button');
const actionButton = document.getElementById('action-button');
const backToDiscountBtn = document.getElementById('back-to-discount-btn');
const copyActionBtn = document.getElementById('copy-action-btn');

// Elementos da tela de desconto
const displayDebitValue = document.getElementById('display-debit-value');
const displayDaysOverdue = document.getElementById('display-days-overdue');
const discountSlider = document.getElementById('discount-slider');
const discountPercentage = document.getElementById('discount-percentage');
const finalValue = document.getElementById('final-value');
const discountValue = document.getElementById('discount-value');

// Elementos da tela de acionamento
const summaryOriginalValue = document.getElementById('summary-original-value');
const summaryProposedValue = document.getElementById('summary-proposed-value');
const summaryDiscountValue = document.getElementById('summary-discount-value');
const matriculationStatus = document.getElementById('matriculation-status');
const matriculationNumber = document.getElementById('matriculation-number');
const documentTypeRadios = document.querySelectorAll('input[name="document-type"]');
const documentLabel = document.getElementById('document-label');
const documentNumber = document.getElementById('document-number');
const holderName = document.getElementById('holder-name');
const updatedValue = document.getElementById('updated-value');
const dueDate = document.getElementById('due-date');
const selectDateBtn = document.getElementById('select-date-btn');
const contactMethod = document.getElementById('contact-method');

// Elementos da tela de parcelamento
const installmentDebitValue = document.getElementById('installment-debit-value');
const installmentDaysOverdue = document.getElementById('installment-days-overdue');
const installmentDiscountPercentage = document.getElementById('installment-discount-percentage');
const installmentDiscountSlider = document.getElementById('installment-discount-slider');
const installmentDiscountText = document.getElementById('installment-discount-text');
const installmentFinalValue = document.getElementById('installment-final-value');
const installmentDiscountValue = document.getElementById('installment-discount-value');
const installmentMinEntry = document.getElementById('installment-min-entry');
const installmentSuggestedEntry = document.getElementById('installment-suggested-entry');
const installmentMatriculationStatus = document.getElementById('installment-matriculation-status');
const installmentMatriculationNumber = document.getElementById('installment-matriculation-number');
const installmentDocumentTypeRadios = document.querySelectorAll('input[name="installment-document-type"]');
const installmentDocumentLabel = document.getElementById('installment-document-label');
const installmentDocumentNumber = document.getElementById('installment-document-number');
const installmentHolderName = document.getElementById('installment-holder-name');
const entryValue = document.getElementById('entry-value');
const installmentNumber = document.getElementById('installment-number');
const installmentSelect = document.getElementById('installment-select');
const installmentAmount = document.getElementById('installment-amount');
const installmentDueDate = document.getElementById('installment-due-date');
const installmentSelectDateBtn = document.getElementById('installment-select-date-btn');
const installmentContactMethod = document.getElementById('installment-contact-method');
const installmentActionButton = document.getElementById('installment-action-button');
const installmentBackButton = document.getElementById('installment-back-button');

// Variáveis globais
let currentDebitValue = 0;
let currentDaysOverdue = 0;
let currentDiscount = 0;
let currentInstallmentDiscount = 0;
let currentFinalValue = 0;

// Função para formatar valores monetários
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

        // Função para calcular desconto À VISTA baseado nos dias de atraso
        function calculateDiscountPercentage(days) {
            if (days <= 120) return 0;
            if (days <= 180) return 15;
            if (days <= 365) return 30;
            if (days <= 730) return 50;
            if (days <= 1095) return 60;
            if (days <= 1460) return 70;
            if (days <= 1825) return 80;
            return 95;
        }

        // Função para calcular desconto PARCELADO baseado nos dias de atraso
        function calculateInstallmentDiscountPercentage(days) {
            if (days <= 180) return 0;
            if (days <= 365) return 10;
            if (days <= 730) return 25;
            if (days <= 1095) return 35;
            if (days <= 1460) return 45;
            if (days <= 1825) return 55;
            return 75;
        }

        // Função para obter o limite máximo de desconto À VISTA baseado nos dias
        function getMaxDiscount(days) {
            if (days <= 120) return 0;
            if (days <= 180) return 15;
            if (days <= 365) return 30;
            if (days <= 730) return 50;
            if (days <= 1095) return 60;
            if (days <= 1460) return 70;
            if (days <= 1825) return 80;
            return 95;
        }

        // Função para obter o limite máximo de desconto PARCELADO baseado nos dias
        function getMaxInstallmentDiscount(days) {
            if (days <= 180) return 0;
            if (days <= 365) return 10;
            if (days <= 730) return 25;
            if (days <= 1095) return 35;
            if (days <= 1460) return 45;
            if (days <= 1825) return 55;
            return 75;
        }

        // Função para obter número máximo de parcelas baseado nos dias
        function getMaxInstallments(days) {
            if (days <= 90) return 24;
            if (days <= 180) return 36;
            if (days <= 365) return 48;
            return 60;
        }

// Função para atualizar os cálculos
function updateCalculations() {
    const discountAmount = (currentDebitValue * currentDiscount) / 100;
    const finalAmount = currentDebitValue - discountAmount;
    
    finalValue.textContent = formatCurrency(finalAmount);
    discountValue.textContent = formatCurrency(discountAmount);
}

// Função para mostrar tela de desconto
function showDiscountScreen() {
    // Salvar estado atual antes de navegar
    saveCurrentCalculator();
    
    // Converter valor formatado de volta para número
    let debitValueStr = debitValueInput.value.replace(/\./g, '').replace(',', '.');
    const debitValue = parseFloat(debitValueStr) || 0;
    const daysOverdue = parseInt(daysOverdueInput.value) || 0;
    
    if (debitValue <= 0) {
        alert('Por favor, insira um valor de débito válido.');
        return;
    }
    
    // Armazenar valores
    currentDebitValue = debitValue;
    currentDaysOverdue = daysOverdue;
    
    // Obter limite máximo de desconto baseado nos dias
    const maxDiscount = getMaxDiscount(daysOverdue);
    
    // Calcular desconto sugerido baseado nos dias de atraso
    const suggestedDiscount = calculateDiscountPercentage(daysOverdue);
    currentDiscount = suggestedDiscount;
    
    // Atualizar slider com os limites corretos
    discountSlider.min = 0;
    discountSlider.max = maxDiscount;
    discountSlider.value = suggestedDiscount;
    
    // Atualizar exibição
    displayDebitValue.textContent = formatCurrency(debitValue);
    displayDaysOverdue.textContent = `${daysOverdue} dias`;
    discountPercentage.textContent = `${suggestedDiscount}%`;
    
    // Atualizar cálculos
    updateCalculations();
    
    // Trocar telas
    initialScreen.classList.remove('active');
    discountScreen.classList.add('active');
}

// Função para voltar à tela inicial
function showInitialScreen() {
    // Salvar estado atual antes de navegar
    saveCurrentCalculator();
    
    initialScreen.classList.add('active');
    discountScreen.classList.remove('active');
}

// Event Listeners
cashButton.addEventListener('click', showDiscountScreen);

installmentButton.addEventListener('click', () => {
    showInstallmentScreen();
});

backButton.addEventListener('click', showInitialScreen);

// Slider de desconto
discountSlider.addEventListener('input', (e) => {
    currentDiscount = parseInt(e.target.value);
    discountPercentage.textContent = `${currentDiscount}%`;
    updateCalculations();
});

// Botão de acionamento
actionButton.addEventListener('click', () => {
    showActionScreen();
});

// Função para mostrar tela de acionamento
function showActionScreen() {
    // Salvar estado atual antes de navegar
    saveCurrentCalculator();
    
    const finalAmount = currentDebitValue - (currentDebitValue * currentDiscount / 100);
    const discountAmount = currentDebitValue - finalAmount;
    
    // Atualizar informações do resumo
    summaryOriginalValue.textContent = formatCurrency(currentDebitValue);
    summaryProposedValue.textContent = formatCurrency(finalAmount);
    summaryDiscountValue.textContent = formatCurrency(discountAmount);
    
    // Preencher automaticamente o campo de valor negociado com o valor após desconto
    updatedValue.value = finalAmount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Trocar telas
    discountScreen.classList.remove('active');
    actionScreen.classList.add('active');
}

// Botão voltar da tela de acionamento
backToDiscountBtn.addEventListener('click', () => {
    // Salvar estado atual antes de navegar
    saveCurrentCalculator();
    
    actionScreen.classList.remove('active');
    discountScreen.classList.add('active');
});

// FUNÇÕES DA TELA DE PARCELAMENTO

        // Função para mostrar tela de parcelamento
        function showInstallmentScreen() {
            // Salvar estado atual antes de navegar
            saveCurrentCalculator();
            
            // Converter valor formatado de volta para número
            let debitValueStr = debitValueInput.value.replace(/\./g, '').replace(',', '.');
            const debitValue = parseFloat(debitValueStr) || 0;
            const daysOverdue = parseInt(daysOverdueInput.value) || 0;
            
            if (debitValue <= 0) {
                alert('Por favor, insira um valor de débito válido.');
                return;
            }
            
            // Armazenar valores
            currentDebitValue = debitValue;
            currentDaysOverdue = daysOverdue;
            
            // Obter limite máximo de desconto PARCELADO baseado nos dias
            const maxInstallmentDiscount = getMaxInstallmentDiscount(daysOverdue);
            const suggestedInstallmentDiscount = calculateInstallmentDiscountPercentage(daysOverdue);
            currentInstallmentDiscount = suggestedInstallmentDiscount;
            
            // Obter número máximo de parcelas baseado nos dias
            const maxInstallments = getMaxInstallments(daysOverdue);
            
            // Atualizar slider com os limites corretos
            installmentDiscountSlider.min = 0;
            installmentDiscountSlider.max = maxInstallmentDiscount;
            installmentDiscountSlider.value = suggestedInstallmentDiscount;
            
            // Atualizar exibição
            installmentDebitValue.textContent = formatCurrency(debitValue);
            installmentDaysOverdue.textContent = `${daysOverdue} dias`;
            installmentDiscountPercentage.textContent = `${suggestedInstallmentDiscount}%`;
            installmentDiscountText.textContent = `${suggestedInstallmentDiscount}%`;
            
            // Popular o select de parcelas baseado no máximo permitido
            installmentSelect.innerHTML = '<option value="">Ou selecione...</option>';
            for (let i = 2; i <= maxInstallments; i += 2) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `${i}x`;
                installmentSelect.appendChild(option);
            }
            
            // Atualizar cálculos
            updateInstallmentCalculations();
            
            // Trocar telas
            initialScreen.classList.remove('active');
            installmentScreen.classList.add('active');
        }

// Função para atualizar os cálculos de parcelamento
function updateInstallmentCalculations() {
    const discountAmount = (currentDebitValue * currentInstallmentDiscount) / 100;
    const finalAmount = currentDebitValue - discountAmount;
    const minEntry = finalAmount * 0.10;
    const suggestedEntry = finalAmount * 0.30;
    
    currentFinalValue = finalAmount;
    
    installmentFinalValue.textContent = formatCurrency(finalAmount);
    installmentDiscountValue.textContent = formatCurrency(discountAmount);
    installmentMinEntry.textContent = formatCurrency(minEntry);
    installmentSuggestedEntry.textContent = formatCurrency(suggestedEntry);
    
    // Atualizar valor da parcela se houver entrada e número de parcelas
    calculateInstallmentAmount();
}

// Função para calcular valor da parcela
function calculateInstallmentAmount() {
    let entryValueNum = 0;
    if (entryValue.value) {
        entryValueNum = parseFloat(entryValue.value.replace(/\./g, '').replace(',', '.'));
    }
    
    const numParcelas = parseInt(installmentNumber.value) || 0;
    
    if (entryValueNum > 0 && numParcelas > 0) {
        const remainingValue = currentFinalValue - entryValueNum;
        if (remainingValue > 0) {
            const parcelaValue = remainingValue / numParcelas;
            installmentAmount.textContent = formatCurrency(parcelaValue);
        } else {
            installmentAmount.textContent = 'R$ 0,00';
        }
    } else {
        installmentAmount.textContent = 'R$ 0,00';
    }
}

// Event listeners da tela de parcelamento
installmentDiscountSlider.addEventListener('input', (e) => {
    currentInstallmentDiscount = parseInt(e.target.value);
    installmentDiscountText.textContent = `${currentInstallmentDiscount}%`;
    installmentDiscountPercentage.textContent = `${currentInstallmentDiscount}%`;
    updateInstallmentCalculations();
});

// Formatação do valor da entrada
entryValue.addEventListener('keyup', function(e) {
    let value = e.target.value;
    
    // Remover tudo que não for número
    value = value.replace(/\D/g, '');
    
    // Se estiver vazio, limpar o campo
    if (!value) {
        e.target.value = '';
        calculateInstallmentAmount();
        return;
    }
    
    // Converter para número (dividir por 100 para ter centavos)
    let numericValue = parseFloat(value) / 100;
    
    // Formatar com separadores de milhar
    e.target.value = numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    calculateInstallmentAmount();
});

// Sincronizar input e select de parcelas
installmentNumber.addEventListener('input', (e) => {
    installmentSelect.value = '';
    calculateInstallmentAmount();
});

installmentSelect.addEventListener('change', (e) => {
    if (e.target.value) {
        installmentNumber.value = e.target.value;
        calculateInstallmentAmount();
    }
});

// Botão voltar da tela de parcelamento
installmentBackButton.addEventListener('click', () => {
    // Salvar estado atual antes de navegar
    saveCurrentCalculator();
    
    installmentScreen.classList.remove('active');
    initialScreen.classList.add('active');
});

// Event listeners para CPF/CNPJ na tela de parcelamento
installmentDocumentTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'cpf') {
            installmentDocumentLabel.textContent = 'CPF';
            installmentDocumentNumber.placeholder = '000.000.000-00';
            installmentDocumentNumber.maxLength = 14;
        } else {
            installmentDocumentLabel.textContent = 'CNPJ';
            installmentDocumentNumber.placeholder = '00.000.000/0000-00';
            installmentDocumentNumber.maxLength = 18;
        }
        installmentDocumentNumber.value = '';
    });
});

// Formatação de CPF/CNPJ na tela de parcelamento
installmentDocumentNumber.addEventListener('input', (e) => {
    const documentType = document.querySelector('input[name="installment-document-type"]:checked').value;
    if (documentType === 'cpf') {
        e.target.value = formatCPF(e.target.value);
    } else {
        e.target.value = formatCNPJ(e.target.value);
    }
});

installmentDocumentNumber.addEventListener('blur', (e) => {
    const documentType = document.querySelector('input[name="installment-document-type"]:checked').value;
    const value = e.target.value;
    
    if (value.trim() === '') {
        e.target.classList.remove('invalid', 'valid');
        return;
    }
    
    let isValid = false;
    if (documentType === 'cpf') {
        isValid = isValidCPF(value);
    } else {
        isValid = isValidCNPJ(value);
    }
    
    if (isValid) {
        e.target.classList.remove('invalid');
        e.target.classList.add('valid');
    } else {
        e.target.classList.remove('valid');
        e.target.classList.add('invalid');
    }
});

// Formatação de data na tela de parcelamento
installmentDueDate.addEventListener('input', (e) => {
    e.target.value = formatDate(e.target.value);
});

installmentDueDate.addEventListener('blur', (e) => {
    if (e.target.value && !isValidDate(e.target.value)) {
        alert('Data inválida! Por favor, insira uma data válida no formato DD/MM/AAAA dentro dos próximos 60 dias.');
        e.target.value = '';
    }
});

// Calendário para tela de parcelamento
installmentSelectDateBtn.addEventListener('click', () => {
    createCalendarForInstallment();
});

// Função para criar calendário para parcelamento
function createCalendarForInstallment() {
    const modal = document.createElement('div');
    modal.className = 'calendar-modal';
    modal.innerHTML = `
        <div class="calendar-container">
            <div class="calendar-header">
                <h3 class="calendar-title">Selecionar Data</h3>
                <button class="calendar-close">&times;</button>
            </div>
            <div class="calendar-navigation">
                <button id="prev-month-inst" class="calendar-nav-btn">&lt;</button>
                <span id="current-month-year-inst" class="calendar-month-year"></span>
                <button id="next-month-inst" class="calendar-nav-btn">&gt;</button>
            </div>
            <div class="calendar-grid" id="calendar-grid-inst">
                <div class="calendar-day-header">Dom</div>
                <div class="calendar-day-header">Seg</div>
                <div class="calendar-day-header">Ter</div>
                <div class="calendar-day-header">Qua</div>
                <div class="calendar-day-header">Qui</div>
                <div class="calendar-day-header">Sex</div>
                <div class="calendar-day-header">Sáb</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    function updateCalendar() {
        const grid = modal.querySelector('#calendar-grid-inst');
        const monthYear = modal.querySelector('#current-month-year-inst');
        
        const headers = grid.querySelectorAll('.calendar-day-header');
        grid.innerHTML = '';
        headers.forEach(header => grid.appendChild(header));
        
        monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
        
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            grid.appendChild(emptyDay);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const dayDate = new Date(currentYear, currentMonth, day);
            
            // Permitir apenas dias do mês atual que não estejam no passado
            const isBeforeToday = dayDate < todayDate;
            const isDisabled = !isCurrentMonth || isBeforeToday;
            
            if (isDisabled) {
                dayElement.className = 'calendar-day disabled';
            } else {
                dayElement.className = 'calendar-day';
                dayElement.addEventListener('click', () => {
                    const selectedDate = `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
                    installmentDueDate.value = selectedDate;
                    document.body.removeChild(modal);
                });
            }
            
            dayElement.textContent = day;
            grid.appendChild(dayElement);
        }
    }
    
    modal.querySelector('#prev-month-inst').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    modal.querySelector('#next-month-inst').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
    
    modal.querySelector('.calendar-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    updateCalendar();
    modal.style.display = 'flex';
}

// Função para gerar texto do acionamento de parcelamento
function generateInstallmentActionText() {
    const originalValue = formatCurrency(currentDebitValue);
    const discountPercentage = currentInstallmentDiscount;
    const negotiatedValue = formatCurrency(currentFinalValue);
    
    let entryValueNum = 0;
    if (entryValue.value) {
        entryValueNum = parseFloat(entryValue.value.replace(/\./g, '').replace(',', '.'));
    }
    const entryValueFormatted = formatCurrency(entryValueNum);
    
    const numParcelas = parseInt(installmentNumber.value) || 0;
    
    let parcelaValue = 0;
    if (entryValueNum > 0 && numParcelas > 0) {
        const remainingValue = currentFinalValue - entryValueNum;
        if (remainingValue > 0) {
            parcelaValue = remainingValue / numParcelas;
        }
    }
    const parcelaValueFormatted = formatCurrency(parcelaValue);
    
    const matriculation = installmentMatriculationStatus.value;
    const matriculationNum = installmentMatriculationNumber.value;
    const documentType = document.querySelector('input[name="installment-document-type"]:checked').value;
    const documentNum = installmentDocumentNumber.value;
    const holder = installmentHolderName.value;
    const due = installmentDueDate.value;
    const contact = installmentContactMethod.value;
    
    const matriculationText = matriculation === 'ativa' ? 'MATRICULA ATIVA' : 'MATRICULA INATIVA';
    
    return `PORTES ADV. ASSESSORIA DE COBRANCA
UNIDADE: AGUAS GUARIROBA
TITULAR: ${holder.toUpperCase()}
${documentType.toUpperCase()}: ${documentNum}
${matriculationText}: ${matriculationNum}
VALOR ORIGINAL: ${originalValue}
DESCONTO: ${discountPercentage}%
VALOR NEGOCIADO: ${negotiatedValue}
ENTRADA: ${entryValueFormatted}
NUMERO DE PARCELAS: ${numParcelas}x
VALOR DA PARCELA: ${parcelaValueFormatted}
VENCIMENTO: ${due}
ENVIAR PELO WHATS/E-MAIL: ${contact}

---
Gerado por Urania - Calculadora e Acionador da Aguas Guariroba`;
}

// Botão de copiar acionamento de parcelamento
installmentActionButton.addEventListener('click', () => {
    try {
        // Validar todos os campos obrigatórios
        if (!validateInstallmentFields()) {
            alert('❌ Por favor, preencha todos os campos obrigatórios destacados em vermelho!');
            return;
        }
        
        // Validar CPF/CNPJ
        const documentType = document.querySelector('input[name="installment-document-type"]:checked').value;
        const docValue = installmentDocumentNumber.value.trim();
        
        let isDocValid = false;
        if (documentType === 'cpf') {
            isDocValid = isValidCPF(docValue);
        } else {
            isDocValid = isValidCNPJ(docValue);
        }
        
        if (!isDocValid) {
            alert('❌ ' + documentType.toUpperCase() + ' inválido! Por favor, verifique.');
            installmentDocumentNumber.classList.add('invalid');
            installmentDocumentNumber.focus();
            return;
        }
        
        // Validar data
        if (!isValidDate(installmentDueDate.value)) {
            alert('❌ Data de vencimento inválida!');
            installmentDueDate.classList.add('invalid');
            installmentDueDate.focus();
            return;
        }
        
        const actionText = generateInstallmentActionText();
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(actionText).then(() => {
                alert('✅ Acionamento copiado para a área de transferência!');
            }).catch((err) => {
                console.error('Erro ao copiar:', err);
                fallbackCopy(actionText);
            });
        } else {
            fallbackCopy(actionText);
        }
    } catch (error) {
        console.error('Erro ao gerar acionamento:', error);
        alert('❌ Erro ao gerar acionamento. Verifique se todos os campos estão preenchidos.');
    }
});

// Formatação automática do valor do débito
debitValueInput.addEventListener('keyup', function(e) {
    let value = e.target.value;
    
    // Remover tudo que não for número
    value = value.replace(/\D/g, '');
    
    // Se estiver vazio, limpar o campo
    if (!value) {
        e.target.value = '';
        return;
    }
    
    // Converter para número (dividir por 100 para ter centavos)
    let numericValue = parseFloat(value) / 100;
    
    // Formatar com separadores de milhar
    e.target.value = numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
});

// Validação dos inputs
debitValueInput.addEventListener('blur', (e) => {
    if (e.target.value && parseFloat(e.target.value) < 0) {
        e.target.value = '0.00';
    }
});

daysOverdueInput.addEventListener('blur', (e) => {
    if (e.target.value && parseInt(e.target.value) < 0) {
        e.target.value = '0';
    }
});

// Enter para confirmar na tela inicial
debitValueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        showDiscountScreen();
    }
});

daysOverdueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        showDiscountScreen();
    }
});

// Funções de formatação de CPF/CNPJ
function formatCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

// Função para validar CPF
function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false; // Todos os dígitos iguais
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// Função para validar CNPJ
function isValidCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false; // Todos os dígitos iguais
    
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(0)) return false;
    
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(1)) return false;
    
    return true;
}

// Função para validar campos obrigatórios da tela à vista
function validateActionFields() {
    let isValid = true;
    const fields = [
        { element: matriculationNumber, name: 'Número da Matrícula' },
        { element: documentNumber, name: 'CPF/CNPJ' },
        { element: holderName, name: 'Titular' },
        { element: updatedValue, name: 'Valor Atualizado' },
        { element: dueDate, name: 'Vencimento' },
        { element: contactMethod, name: 'WhatsApp/E-mail' }
    ];
    
    fields.forEach(field => {
        if (!field.element.value.trim()) {
            field.element.classList.add('invalid');
            isValid = false;
        } else {
            field.element.classList.remove('invalid');
        }
    });
    
    return isValid;
}

// Função para validar campos obrigatórios da tela de parcelamento
function validateInstallmentFields() {
    let isValid = true;
    const fields = [
        { element: installmentMatriculationNumber, name: 'Número da Matrícula' },
        { element: installmentDocumentNumber, name: 'CPF/CNPJ' },
        { element: installmentHolderName, name: 'Titular' },
        { element: entryValue, name: 'Valor da Entrada' },
        { element: installmentNumber, name: 'Número de Parcelas' },
        { element: installmentDueDate, name: 'Vencimento' },
        { element: installmentContactMethod, name: 'WhatsApp/E-mail' }
    ];
    
    fields.forEach(field => {
        if (!field.element.value.trim()) {
            field.element.classList.add('invalid');
            isValid = false;
        } else {
            field.element.classList.remove('invalid');
        }
    });
    
    return isValid;
}

// Função para formatar data
function formatDate(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
}

// Função para validar data (manual permite até 60 dias)
function isValidDate(dateString) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    
    if (!match) return false;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calcular limite de 60 dias para digitação manual
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 60);
    
    // Verificar se a data está no passado
    if (date < today) return false;
    
    // Verificar se a data está além de 60 dias
    if (date > maxDate) return false;
    
    // Verificar se a data é válida
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) return false;
    
    return true;
}

// Função para criar calendário com todos os meses
function createCalendar() {
    const modal = document.createElement('div');
    modal.className = 'calendar-modal';
    modal.innerHTML = `
        <div class="calendar-container">
            <div class="calendar-header">
                <h3 class="calendar-title">Selecionar Data</h3>
                <button class="calendar-close">&times;</button>
            </div>
            <div class="calendar-navigation">
                <button id="prev-month" class="calendar-nav-btn">&lt;</button>
                <span id="current-month-year" class="calendar-month-year"></span>
                <button id="next-month" class="calendar-nav-btn">&gt;</button>
            </div>
            <div class="calendar-grid" id="calendar-grid">
                <div class="calendar-day-header">Dom</div>
                <div class="calendar-day-header">Seg</div>
                <div class="calendar-day-header">Ter</div>
                <div class="calendar-day-header">Qua</div>
                <div class="calendar-day-header">Qui</div>
                <div class="calendar-day-header">Sex</div>
                <div class="calendar-day-header">Sáb</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    function updateCalendar() {
        const grid = modal.querySelector('#calendar-grid');
        const monthYear = modal.querySelector('#current-month-year');
        
        // Limpar grid (manter apenas headers)
        const headers = grid.querySelectorAll('.calendar-day-header');
        grid.innerHTML = '';
        headers.forEach(header => grid.appendChild(header));
        
        // Atualizar título
        monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
        
        // Adicionar dias vazios no início
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            grid.appendChild(emptyDay);
        }
        
        // Adicionar dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const dayDate = new Date(currentYear, currentMonth, day);
            
            // Permitir apenas dias do mês atual que não estejam no passado
            const isBeforeToday = dayDate < todayDate;
            const isDisabled = !isCurrentMonth || isBeforeToday;
            
            if (isDisabled) {
                dayElement.className = 'calendar-day disabled';
            } else {
                dayElement.className = 'calendar-day';
                dayElement.addEventListener('click', () => {
                    const selectedDate = `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
                    dueDate.value = selectedDate;
                    document.body.removeChild(modal);
                });
            }
            
            dayElement.textContent = day;
            grid.appendChild(dayElement);
        }
    }
    
    // Event listeners de navegação
    modal.querySelector('#prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    modal.querySelector('#next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
    
    // Event listeners
    modal.querySelector('.calendar-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Inicializar calendário
    updateCalendar();
    modal.style.display = 'flex';
}

// Função para gerar texto do acionamento
function generateActionText() {
    const originalValue = formatCurrency(currentDebitValue);
    
    // Converter valor formatado de volta para número
    let proposedValueNum = 0;
    if (updatedValue.value) {
        proposedValueNum = parseFloat(updatedValue.value.replace(/\./g, '').replace(',', '.'));
    }
    
    const proposedValue = formatCurrency(proposedValueNum);
    // Usar o desconto aplicado na tela de desconto em vez de calcular baseado no valor digitado
    const discountPercentage = currentDiscount;
    const matriculation = matriculationStatus.value;
    const matriculationNum = matriculationNumber.value;
    const documentType = document.querySelector('input[name="document-type"]:checked').value;
    const documentNum = documentNumber.value;
    const holder = holderName.value;
    const due = dueDate.value;
    const contact = contactMethod.value;
    
    // Determinar o status da matrícula
    const matriculationText = matriculation === 'ativa' ? 'MATRICULA ATIVA' : 'MATRICULA INATIVA';
    
    return `PORTES ADV. ASSESSORIA DE COBRANCA
UNIDADE: AGUAS GUARIROBA
TITULAR: ${holder.toUpperCase()}
${documentType.toUpperCase()}: ${documentNum}
${matriculationText}: ${matriculationNum}
VALOR ORIGINAL: ${originalValue}
DESCONTO: ${discountPercentage}%
VALOR NEGOCIADO: ${proposedValue}
VENCIMENTO: ${due}
ENVIAR PELO WHATS/E-MAIL: ${contact}

---
Gerado por Urania - Calculadora e Acionador da Aguas Guariroba`;
}

// Event listeners da tela de acionamento
documentTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'cpf') {
            documentLabel.textContent = 'CPF';
            documentNumber.placeholder = '000.000.000-00';
            documentNumber.maxLength = 14;
        } else {
            documentLabel.textContent = 'CNPJ';
            documentNumber.placeholder = '00.000.000/0000-00';
            documentNumber.maxLength = 18;
        }
        documentNumber.value = '';
    });
});

documentNumber.addEventListener('input', (e) => {
    const documentType = document.querySelector('input[name="document-type"]:checked').value;
    if (documentType === 'cpf') {
        e.target.value = formatCPF(e.target.value);
    } else {
        e.target.value = formatCNPJ(e.target.value);
    }
});

documentNumber.addEventListener('blur', (e) => {
    const documentType = document.querySelector('input[name="document-type"]:checked').value;
    const value = e.target.value;
    
    if (value.trim() === '') {
        e.target.classList.remove('invalid', 'valid');
        return;
    }
    
    let isValid = false;
    if (documentType === 'cpf') {
        isValid = isValidCPF(value);
    } else {
        isValid = isValidCNPJ(value);
    }
    
    if (isValid) {
        e.target.classList.remove('invalid');
        e.target.classList.add('valid');
    } else {
        e.target.classList.remove('valid');
        e.target.classList.add('invalid');
    }
});

dueDate.addEventListener('input', (e) => {
    e.target.value = formatDate(e.target.value);
});

dueDate.addEventListener('blur', (e) => {
    if (e.target.value && !isValidDate(e.target.value)) {
        alert('Data inválida! Por favor, insira uma data válida no formato DD/MM/AAAA dentro dos próximos 60 dias.');
        e.target.value = '';
    }
});

selectDateBtn.addEventListener('click', createCalendar);

// Formatação do valor atualizado
updatedValue.addEventListener('keyup', function(e) {
    let value = e.target.value;
    
    // Remover tudo que não for número
    value = value.replace(/\D/g, '');
    
    // Se estiver vazio, limpar o campo
    if (!value) {
        e.target.value = '';
        return;
    }
    
    // Converter para número (dividir por 100 para ter centavos)
    let numericValue = parseFloat(value) / 100;
    
    // Formatar com separadores de milhar
    e.target.value = numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
});

copyActionBtn.addEventListener('click', () => {
    try {
        // Validar todos os campos obrigatórios
        if (!validateActionFields()) {
            alert('❌ Por favor, preencha todos os campos obrigatórios destacados em vermelho!');
            return;
        }
        
        // Validar CPF/CNPJ
        const documentType = document.querySelector('input[name="document-type"]:checked').value;
        const docValue = documentNumber.value.trim();
        
        let isDocValid = false;
        if (documentType === 'cpf') {
            isDocValid = isValidCPF(docValue);
        } else {
            isDocValid = isValidCNPJ(docValue);
        }
        
        if (!isDocValid) {
            alert('❌ ' + documentType.toUpperCase() + ' inválido! Por favor, verifique.');
            documentNumber.classList.add('invalid');
            documentNumber.focus();
            return;
        }
        
        // Validar data
        if (!isValidDate(dueDate.value)) {
            alert('❌ Data de vencimento inválida!');
            dueDate.classList.add('invalid');
            dueDate.focus();
            return;
        }
        
        const actionText = generateActionText();
        
        // Tentar copiar usando a API moderna
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(actionText).then(() => {
                alert('✅ Acionamento copiado para a área de transferência!');
            }).catch((err) => {
                console.error('Erro ao copiar:', err);
                fallbackCopy(actionText);
            });
        } else {
            // Usar fallback
            fallbackCopy(actionText);
        }
    } catch (error) {
        console.error('Erro ao gerar acionamento:', error);
        alert('❌ Erro ao gerar acionamento. Verifique se todos os campos estão preenchidos.');
    }
});

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('✅ Acionamento copiado para a área de transferência!');
        } else {
            alert('❌ Não foi possível copiar. Por favor, copie manualmente:\n\n' + text);
        }
    } catch (err) {
        console.error('Erro no fallback:', err);
        alert('❌ Não foi possível copiar. Por favor, copie manualmente:\n\n' + text);
    }
    
    document.body.removeChild(textArea);
}

// FUNÇÕES DO SISTEMA DE MÚLTIPLAS CALCULADORAS

// Criar nova calculadora
function createNewCalculator() {
    // Salvar a calculadora atual antes de criar nova
    if (currentCalculatorId) {
        saveCurrentCalculator();
    }
    
    const calculator = {
        id: calculatorIdCounter++,
        name: `Calculadora ${calculatorIdCounter - 1}`,
        createdAt: new Date().toLocaleString('pt-BR'),
        data: {
            debitValue: '',
            daysOverdue: '',
            currentScreen: 'initial'
        }
    };
    
    calculators.push(calculator);
    currentCalculatorId = calculator.id;
    
    // Limpar campos e voltar para tela inicial
    clearAllFields();
    showScreen('initial');
    
    renderCalculatorList();
    
    return calculator;
}

// Deletar calculadora
function deleteCalculator(id) {
    if (calculators.length === 1) {
        alert('Você precisa ter pelo menos uma calculadora!');
        return;
    }
    
    const index = calculators.findIndex(c => c.id === id);
    if (index === -1) return;
    
    calculators.splice(index, 1);
    
    // Se deletou a ativa, ativa outra
    if (currentCalculatorId === id) {
        currentCalculatorId = calculators[0].id;
        loadCalculator(currentCalculatorId);
    }
    
    renderCalculatorList();
}

// Salvar estado da calculadora atual
function saveCurrentCalculator() {
    const calculator = calculators.find(c => c.id === currentCalculatorId);
    if (!calculator) return;
    
    // Salvar dados básicos
    calculator.data.debitValue = debitValueInput.value;
    calculator.data.daysOverdue = daysOverdueInput.value;
    calculator.data.currentScreen = getCurrentScreen();
    
    // Salvar dados específicos da tela atual
    if (getCurrentScreen() === 'action') {
        calculator.data.matriculationStatus = matriculationStatus.value;
        calculator.data.matriculationNumber = matriculationNumber.value;
        calculator.data.documentType = document.querySelector('input[name="document-type"]:checked')?.value || 'cpf';
        calculator.data.documentNumber = documentNumber.value;
        calculator.data.holderName = holderName.value;
        calculator.data.updatedValue = updatedValue.value;
        calculator.data.dueDate = dueDate.value;
        calculator.data.contactMethod = contactMethod.value;
    } else if (getCurrentScreen() === 'installment') {
        calculator.data.installmentMatriculationStatus = installmentMatriculationStatus.value;
        calculator.data.installmentMatriculationNumber = installmentMatriculationNumber.value;
        calculator.data.installmentDocumentType = document.querySelector('input[name="installment-document-type"]:checked')?.value || 'cpf';
        calculator.data.installmentDocumentNumber = installmentDocumentNumber.value;
        calculator.data.installmentHolderName = installmentHolderName.value;
        calculator.data.entryValue = entryValue.value;
        calculator.data.installmentNumber = installmentNumber.value;
        calculator.data.installmentDueDate = installmentDueDate.value;
        calculator.data.installmentContactMethod = installmentContactMethod.value;
    }
}

// Obter tela atual
function getCurrentScreen() {
    if (initialScreen.classList.contains('active')) return 'initial';
    if (discountScreen.classList.contains('active')) return 'discount';
    if (installmentScreen.classList.contains('active')) return 'installment';
    if (actionScreen.classList.contains('active')) return 'action';
    return 'initial';
}

// Carregar calculadora
function loadCalculator(id) {
    // Salvar a atual antes de trocar (apenas se for diferente)
    if (currentCalculatorId && currentCalculatorId !== id) {
        saveCurrentCalculator();
    }
    
    const calculator = calculators.find(c => c.id === id);
    if (!calculator) return;
    
    currentCalculatorId = id;
    
    // Limpar todos os campos
    clearAllFields();
    
    // Carregar dados básicos
    debitValueInput.value = calculator.data.debitValue || '';
    daysOverdueInput.value = calculator.data.daysOverdue || '';
    
    // Carregar dados específicos da tela de acionamento
    if (calculator.data.matriculationStatus) {
        matriculationStatus.value = calculator.data.matriculationStatus;
    }
    if (calculator.data.matriculationNumber) {
        matriculationNumber.value = calculator.data.matriculationNumber;
    }
    if (calculator.data.documentType) {
        const radio = document.querySelector(`input[name="document-type"][value="${calculator.data.documentType}"]`);
        if (radio) radio.checked = true;
    }
    if (calculator.data.documentNumber) {
        documentNumber.value = calculator.data.documentNumber;
    }
    if (calculator.data.holderName) {
        holderName.value = calculator.data.holderName;
    }
    if (calculator.data.updatedValue) {
        updatedValue.value = calculator.data.updatedValue;
    }
    if (calculator.data.dueDate) {
        dueDate.value = calculator.data.dueDate;
    }
    if (calculator.data.contactMethod) {
        contactMethod.value = calculator.data.contactMethod;
    }
    
    // Carregar dados específicos da tela de parcelamento
    if (calculator.data.installmentMatriculationStatus) {
        installmentMatriculationStatus.value = calculator.data.installmentMatriculationStatus;
    }
    if (calculator.data.installmentMatriculationNumber) {
        installmentMatriculationNumber.value = calculator.data.installmentMatriculationNumber;
    }
    if (calculator.data.installmentDocumentType) {
        const radio = document.querySelector(`input[name="installment-document-type"][value="${calculator.data.installmentDocumentType}"]`);
        if (radio) radio.checked = true;
    }
    if (calculator.data.installmentDocumentNumber) {
        installmentDocumentNumber.value = calculator.data.installmentDocumentNumber;
    }
    if (calculator.data.installmentHolderName) {
        installmentHolderName.value = calculator.data.installmentHolderName;
    }
    if (calculator.data.entryValue) {
        entryValue.value = calculator.data.entryValue;
    }
    if (calculator.data.installmentNumber) {
        installmentNumber.value = calculator.data.installmentNumber;
    }
    if (calculator.data.installmentDueDate) {
        installmentDueDate.value = calculator.data.installmentDueDate;
    }
    if (calculator.data.installmentContactMethod) {
        installmentContactMethod.value = calculator.data.installmentContactMethod;
    }
    
    // Carregar a tela correta
    showScreen(calculator.data.currentScreen || 'initial');
    
    renderCalculatorList();
}

// Limpar todos os campos
function clearAllFields() {
    // Campos básicos
    debitValueInput.value = '';
    daysOverdueInput.value = '';
    
    // Campos da tela de acionamento
    matriculationStatus.value = 'ativa';
    matriculationNumber.value = '';
    document.querySelector('input[name="document-type"][value="cpf"]').checked = true;
    documentNumber.value = '';
    holderName.value = '';
    updatedValue.value = '';
    dueDate.value = '';
    contactMethod.value = '';
    
    // Campos da tela de parcelamento
    installmentMatriculationStatus.value = 'ativa';
    installmentMatriculationNumber.value = '';
    document.querySelector('input[name="installment-document-type"][value="cpf"]').checked = true;
    installmentDocumentNumber.value = '';
    installmentHolderName.value = '';
    entryValue.value = '';
    installmentNumber.value = '';
    installmentDueDate.value = '';
    installmentContactMethod.value = '';
}

// Mostrar tela específica
function showScreen(screenName) {
    initialScreen.classList.remove('active');
    discountScreen.classList.remove('active');
    installmentScreen.classList.remove('active');
    actionScreen.classList.remove('active');
    
    switch(screenName) {
        case 'initial':
            initialScreen.classList.add('active');
            break;
        case 'discount':
            discountScreen.classList.add('active');
            break;
        case 'installment':
            installmentScreen.classList.add('active');
            break;
        case 'action':
            actionScreen.classList.add('active');
            break;
    }
}

// Renderizar lista de calculadoras
function renderCalculatorList() {
    calculatorList.innerHTML = '';
    
    calculators.forEach(calc => {
        const item = document.createElement('div');
        item.className = `calculator-item ${calc.id === currentCalculatorId ? 'active' : ''}`;
        
        item.innerHTML = `
            <div class="calculator-info">
                <div class="calculator-title">${calc.name}</div>
                <div class="calculator-subtitle">${calc.createdAt}</div>
            </div>
            <button class="btn-delete-calc" onclick="deleteCalculator(${calc.id})" title="Excluir">×</button>
        `;
        
        // Adicionar evento de clique (exceto no botão de deletar)
        item.querySelector('.calculator-info').addEventListener('click', () => {
            loadCalculator(calc.id);
        });
        
        calculatorList.appendChild(item);
    });
}

// Toggle sidebar (mobile)
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Criar nova calculadora
newCalculatorBtn.addEventListener('click', () => {
    createNewCalculator();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Criar primeira calculadora
    createNewCalculator();
    
    // Focar no primeiro input
    debitValueInput.focus();
    
    // Inicializar cálculos
    updateCalculations();
});
