/** *************** *
* Global Variables
* ***************** */
const dataAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';
const header = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
let employees = [];

/** ************* *
* Fetch Function
* ***************  */

fetch(dataAPI)
    .then(checkStatus) //check for status before continue
    .then((res) => res.json())
    .then((res) => res.results)
    .then((data) => {
        employees = data;
        return data;
    })
    .then(displayEmployees)
    .catch(((error) => console.log('Uh oh, something has gone wrong. Please tweet us @randomapi about the issue. Thank you.', error)));


/** ************** *
* Helper Functions
* ***************  */

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(response.statusText)
    }
}

/** ************** *
* Search Function
* ***************  */

//Search Input in html
const searchBar = ` 
            <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
            </form>
            `
header.insertAdjacentHTML('beforeend', searchBar);

function search() {
    const input = document.querySelector('input');
    const cards = document.querySelectorAll('.card');
    const filter = input.value.toUpperCase();

    for (let i = 0; i < cards.length; i++) {
        const textH2 = cards[i].querySelector('h3');
        const nameCard = textH2.textContent;

        if (nameCard.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = ""; //show the results
        } else {
            cards[i].style.display = 'none';
        }
    }
}

//Display Employers cards
function displayEmployees(data) {
   
    employees = data;
  
    let employeeHTML = '';
    // loop through each employee and create HTML markup
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let state = employee.location.state;
        let picture = employee.picture;

        employeeHTML += `   
            <div class="card" data-index="${index}">
            <div class="card-img-container">
                <img class="card-img" src="${picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${city}, ${state}</p>
            </div>
        </div>
        `;
    });
gallery.insertAdjacentHTML('beforeend', employeeHTML);
} 
/** ************** *
* MODAL Window
* ***************  */   

    function displayModal(index) {

    let { name, dob, phone, email, location, picture } = employees[index];
    
    //REgex format phone adpated from here: https://learnersbucket.com/examples/javascript/how-to-format-phone-number-in-javascrip
    function formatPhoneNumber(number) {
        //Filter only numbers from the input
        let cleaned = ('' + number).replace(/\D/g, '');
        
        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };
      
        return null
      };
    
    //Date format
    let newDay = new Date(dob.date).getDay();
    let newMonth = new Date(dob.date).getMonth()+1; //because January is number 0 on the array of the months
    let newYear = new Date(dob.date).getFullYear();

        const modalHTML = `
                        <div class="modal-container">
                        <div class="modal">
                            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                            <div class="modal-info-container">
                                <img class="modal-img" src=${picture.large} alt="profile picture">
                                <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
                                <p class="modal-text">${email}</p>
                                <p class="modal-text cap">${location.city}</p>
                                <hr>
                                <p class="modal-text">${formatPhoneNumber(phone)}</p>
                                <p class="modal-text">${location.street.number} ${location.street.name}, ${location.city}, ${location.state},  ${location.postcode}</p>
                                <p class="modal-text">Birthday: ${newMonth}/${newDay}/${newYear} </p>
                            </div>
                           
                        </div>
                        `;
    
       
        body.insertAdjacentHTML("beforeend", modalHTML)


        //Close Btn
        const closeModal = document.getElementById('modal-close-btn');

        closeModal.addEventListener('click', () => {
            document.querySelector('.modal-container').remove()
        })
    }
    

/** ************** *
* EVENT LISTENERS
* ***************  */

//testing event
// body.addEventListener('click', e => { 
//    const test = e.target;
//    console.log(test.parentNode)
// })

//Search
header.addEventListener('keyup', search)

//Modal event
gallery.addEventListener('click', (e) => {
    if (e.target !== gallery){
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');
        displayModal(index);
    }
})
