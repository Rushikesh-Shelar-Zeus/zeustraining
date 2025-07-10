document.getElementById('form').addEventListener('submit',handleSubmit);

function handleSubmit(event){
    const name = document.getElementById('name');
    const comments = document.getElementById('comments');
    const genders = document.getElementsByName('gender');
    const radioMale = document.getElementById('male');

    if(!name.value) {
        event.preventDefault();
        alert("Name cannot be empty.")
        name.focus();
        return;
    }

    if(!comments.value){
        event.preventDefault();
        alert("Comments cannot be empty")
        comments.focus();
        return;
    }

    if(!genders[0].checked && !genders[1].checked){
        event.preventDefault();
        alert("Please select your Gender")
        radioMale.focus();
        return;
    }
}