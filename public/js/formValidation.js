document.getElementById('forminput').addEventListener('submit', formValidation());

function formValidation() {
    event.preventDefault();

    const getAllRequiredFields = document.querySelectorAll('.required-field');
    console.log(getAllRequiredFields);
    for(let i = 0; i < getAllRequiredFields.length; i++){
        if(!getAllRequiredFields[i].value){
            // console.log(getAllRequiredFields[i]);
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'Silahkan lengkapi semua field yang tersedia',
                // showConfirmButton: false,
                timer: 1500,
              })
            return;
        }
    }
    document.getElementById('input-form').submit();
}