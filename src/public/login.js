let form = document.getElementById('loginForm')
let username = document.getElementById('loginName')

const handleSubmit = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target)
    
    fetch('/login',{
        method:'POST',
        body:formData
    })

    form.reset()

    setTimeout(()=>{
        location.reload()
    },500)
}

form.addEventListener('submit',(e)=>handleSubmit(e))