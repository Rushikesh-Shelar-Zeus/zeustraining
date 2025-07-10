// Hamburger Functionality
function handleMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const items = document.querySelectorAll(".item");

    header.classList.toggle('mobile');
    items.forEach(item => item.classList.toggle('mobile'))

    nav.classList.toggle('mobile')
}

// Active Link
const links = document.querySelectorAll('.item');

links.forEach(link => {
    link.addEventListener('click', () => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});


// Active Class or Courses
const headItem = document.querySelectorAll(".head-item ");

headItem.forEach(item => {
    item.addEventListener('click', () => {
        headItem.forEach( i =>  i.classList.toggle('is-active'));
    })
});

// Toggle Favourite (star icon)
function toggleFav(event){
    event.target.classList.toggle('gray');
}

const allStars = document.querySelectorAll(".star-icon");
allStars.forEach(el => el.addEventListener('click', toggleFav))