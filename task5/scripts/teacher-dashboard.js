function handleMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const items = document.querySelectorAll(".item");

    header.classList.toggle('mobile');
    items.forEach(item => item.classList.toggle('mobile'))

    nav.classList.toggle('mobile')

}


const links = document.querySelectorAll('.item');

links.forEach(link => {
    link.addEventListener('click', () => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});


