import { el, mount} from 'redom'
import { authUser } from '../../api/Users'
import { checkAuth } from '../comps/checkAuth'

export function LoginCard( text: string, btnGroup: HTMLDivElement) {
    const titleModal = el('h2.auth__title', `${text}`) as HTMLTitleElement

    const inpNameLabel = el('label.auth__label', el(
        'input.auth__input#inp-name', 
        { type: 'text', placeholder: 'Введите логин', name: 'logName'})) as HTMLInputElement

    const inpPasswordLabel = el('label.auth__label', el(
        'input.auth__input#inp-password', 
        { type: 'password', placeholder: 'Введите пароль', name: 'logPassword'})) as HTMLInputElement

    const inputs = el('.auth-inpGroup', [inpNameLabel, inpPasswordLabel])

    const errMessage = el('p.auth__err.auth__err-none');

    const formAuth = el('form.auth__form#form-auth', [inputs, btnGroup], {name: 'logForm'}) as HTMLFormElement
    const previewModal = el('#auth', [titleModal, errMessage, formAuth])

    mount(document.body, previewModal)

    formAuth.addEventListener('submit', async (e) => {
        e.preventDefault();
        const result = await authUser('/login', formAuth.logName.value, formAuth.logPassword.value);

        if('token' in result) {
            if(!errMessage.classList.contains('auth__err-none')) {
                errMessage.classList.add('auth__err-none')
            }
            document.getElementById('auth')!.remove()
            checkAuth()
        } else {
            errMessage.classList.remove('auth__err-none')
            previewModal.classList.add('error')
            errMessage.textContent = `${result.message} 🤫`;
            document.getElementById('submit-button')?.setAttribute('disabled', 'true')
        } 
         
    })

    document.getElementById('inp-name')!.oninput = () => checkValues()
    document.getElementById('inp-password')!.oninput = () => checkValues()

    function checkValues() {
        if(formAuth.logName.value && formAuth.logPassword.value) {
            if(previewModal.classList.contains('error')) {
                errMessage.textContent = '';
                errMessage.classList.add('auth__err-none')
                previewModal.classList.remove('error')
                document.getElementById('submit-button')?.removeAttribute('disabled')
            } else {
                document.getElementById('submit-button')?.removeAttribute('disabled')
            }
        } else {
            document.getElementById('submit-button')?.setAttribute('disabled', 'true')
        }
    }

    
}