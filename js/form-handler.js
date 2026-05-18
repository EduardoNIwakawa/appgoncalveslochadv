/* ============================================================================
   FORM-HANDLER.JS - Manipulação e Validação do Formulário de Contato
   ============================================================================ */

class FormHandler {
    constructor(formSelector) {
        this.form = DOM.query(formSelector);
        if (!this.form) {
            const error = ErrorHandler.createError('Formulário não encontrado: ' + formSelector, 'FormInitError');
            ErrorHandler.handle(error, 'FormInitError');
            return;
        }

        this.inputs = {};
        this.errors = {};
        this.formData = {};

        this.init();
    }

    init() {
        // Coletar referências dos inputs
        this.inputs = {
            name: this.form.querySelector('#name'),
            company: this.form.querySelector('#company'),
            phone: this.form.querySelector('#phone'),
            email: this.form.querySelector('#email'),
            document: this.form.querySelector('#document'),
            creditValue: this.form.querySelector('#creditValue'),
            message: this.form.querySelector('#message'),
            file: this.form.querySelector('#file')
        };

        // Referência ao botão de submit
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.originalSubmitText = this.submitButton?.textContent || 'Enviar';
        this.isSubmitting = false;

        // Listeners com error handling
        this.form.addEventListener('submit', (e) => {
            try {
                this.handleSubmit(e);
            } catch (error) {
                ErrorHandler.handle(error, 'FormSubmitError', { formSelector: '#contactForm' });
            }
        });

        // Validação em tempo real com debounce para melhor performance
        const debouncedValidate = Debounce.debounce((input) => {
            this.validateField(input);
        }, 300);

        Object.values(this.inputs).forEach(input => {
            if (input && input.type !== 'file') {
                input.addEventListener('blur', () => this.validateField(input));
                // Validação com debounce após digitação
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                    debouncedValidate(input);
                });
            }
        });

        // Formatar telefone (sanitizar + formatar)
        if (this.inputs.phone) {
            this.inputs.phone.addEventListener('input', (e) => {
                const sanitized = e.target.value.replace(/[^\d\s\-()]/g, '');
                e.target.value = StringUtils.formatPhone(sanitized);
            });
        }

        // Formatar CPF (sanitizar + formatar)
        if (this.inputs.document) {
            this.inputs.document.addEventListener('input', (e) => {
                if (e.target.value.length <= 14) {
                    const sanitized = e.target.value.replace(/[^\d\-]/g, '');
                    e.target.value = StringUtils.formatCPF(sanitized);
                }
            });
        }

        Logger.log('Formulário inicializado');
    }

    validateField(input) {
        const name = input.name;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (name) {
            case 'name':
                if (Validation.isEmpty(value)) {
                    isValid = false;
                    errorMessage = 'Nome é obrigatório';
                } else if (!Validation.isMinLength(value, 3)) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 3 caracteres';
                }
                break;

            case 'phone':
                if (Validation.isEmpty(value)) {
                    isValid = false;
                    errorMessage = 'Telefone é obrigatório';
                } else if (value.replace(/\D/g, '').length < 10) {
                    isValid = false;
                    errorMessage = 'Telefone inválido';
                }
                break;

            case 'email':
                if (Validation.isEmpty(value)) {
                    isValid = false;
                    errorMessage = 'E-mail é obrigatório';
                } else if (!Validation.isEmail(value)) {
                    isValid = false;
                    errorMessage = 'E-mail inválido';
                }
                break;

            case 'message':
                if (Validation.isEmpty(value)) {
                    isValid = false;
                    errorMessage = 'Descrição do caso é obrigatória';
                } else if (!Validation.isMinLength(value, 10)) {
                    isValid = false;
                    errorMessage = 'Descrição deve ter pelo menos 10 caracteres';
                }
                break;

            case 'document':
                if (!Validation.isEmpty(value)) {
                    const cleaned = value.replace(/\D/g, '');
                    if (cleaned.length === 11 && !Validation.isCPF(value)) {
                        isValid = false;
                        errorMessage = 'CPF inválido';
                    }
                }
                break;

            case 'file':
                if (input.files.length > 0) {
                    const file = input.files[0];
                    if (file.type !== 'application/pdf') {
                        isValid = false;
                        errorMessage = 'Apenas arquivos PDF são permitidos';
                    } else if (file.size > 5 * 1024 * 1024) {
                        isValid = false;
                        errorMessage = 'Arquivo não pode ser maior que 5MB';
                    }
                }
                break;
        }

        if (!isValid) {
            this.setFieldError(input, errorMessage);
        } else {
            this.clearFieldError(input);
        }

        return isValid;
    }

    setFieldError(input, errorMessage) {
        DOM.addClass(input, 'error');
        const errorElement = this.form.querySelector(`#${input.id}Error`);
        if (errorElement) {
            DOM.setText(errorElement, errorMessage);
            errorElement.style.display = 'block';
        }
        this.errors[input.name] = errorMessage;
    }

    clearFieldError(input) {
        DOM.removeClass(input, 'error');
        const errorElement = this.form.querySelector(`#${input.id}Error`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        delete this.errors[input.name];
    }

    validateForm() {
        this.errors = {};
        let isValid = true;

        // Validar campos obrigatórios
        const requiredFields = ['name', 'phone', 'email', 'message'];
        requiredFields.forEach(fieldName => {
            if (this.inputs[fieldName]) {
                if (!this.validateField(this.inputs[fieldName])) {
                    isValid = false;
                }
            }
        });

        // Validar campos opcionais
        ['document', 'file'].forEach(fieldName => {
            if (this.inputs[fieldName] && this.inputs[fieldName].value) {
                if (!this.validateField(this.inputs[fieldName])) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    collectFormData() {
        this.formData = {
            name: this.inputs.name?.value || '',
            company: this.inputs.company?.value || '',
            phone: this.inputs.phone?.value || '',
            email: this.inputs.email?.value || '',
            document: this.inputs.document?.value || '',
            creditValue: this.inputs.creditValue?.value || '',
            message: this.inputs.message?.value || '',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        return this.formData;
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validar
        if (!this.validateForm()) {
            Logger.warn('Formulário inválido', this.errors);
            this.showMessage('Por favor, corrija os erros antes de enviar.', 'error');
            return;
        }

        // Coletar dados
        this.collectFormData();

        // Salvar em localStorage
        const storedForms = Storage.get('contactForms') || [];
        storedForms.push(this.formData);
        Storage.set('contactForms', storedForms);

        // Log para debug (apenas em desenvolvimento)
        if (!Logger.isProduction()) {
            Logger.log('Formulário enviado com sucesso');
        }

        // Mostrar mensagem de sucesso
        this.showMessage('✓ Formulário enviado com sucesso! Entraremos em contato em breve.', 'success');

        // Limpar formulário
        this.form.reset();

        // Limpar erros
        this.errors = {};
        Object.values(this.inputs).forEach(input => {
            if (input) {
                DOM.removeClass(input, 'error');
            }
        });
    }

    showMessage(message, type = 'info') {
        const successElement = this.form.querySelector('#formSuccess');
        if (successElement) {
            DOM.setText(successElement, message);
            successElement.className = `form-success form-${type}`;
            DOM.show(successElement);

            // Auto-hide após 5 segundos
            setTimeout(() => {
                DOM.hide(successElement);
            }, 5000);
        }
    }

    getStoredForms() {
        return Storage.get('contactForms') || [];
    }

    clearStoredForms() {
        Storage.remove('contactForms');
        Logger.log('Formulários armazenados limpos');
    }
}

/**
 * Inicializar Formulário de Contato
 */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new FormHandler('#contactForm');
    Logger.log('Formulário de contato inicializado');

    // Para debug: exibir formulários armazenados no console
    window.getStoredForms = () => {
        const forms = contactForm.getStoredForms();
        console.table(forms);
        return forms;
    };
});
