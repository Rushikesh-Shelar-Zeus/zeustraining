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


const loadDashboard = async () => {
    const response = await fetch("courses.json");
    const classData = await response.json();

    const dashboardGrid = document.querySelector("#courses-grid");
    dashboardGrid.innerHTML = "";
    let i = 1;

    for (card of classData) {
        let { imgSrc,
            topic,
            subject,
            grade,
            point,
            units,
            lessons,
            chapters,
            className,
            noOfStudents,
            dates,
            isSelectDisabled,
            isGray } = card;

        dashboardGrid.innerHTML += `
            <div class="course-card">
                <div class="card-content">
                    <div class="card-main">
                    <div class="card-img">
                        <img src="${imgSrc}" alt="Image ${i++}">
                    </div>
                    <div class="card-details">
                        <div class="card-head">
                        <div class="topic">${topic}</div>
                        <img class="star-icon ${isGray ? "gray" : ""}" src="assets/icons/favourite.svg" alt="Star Icon">
                        </div>
                        <div class="card-subject">
                        <span class="subject">${subject}</span>
                        <span class="vr"></span>
                        <span class="grade">${grade}</span>
                        <span class="point">${point}</span>
                        </div>
                        ${(!units) ?
                "" :
                `
                            <div div class="class-stats" >
                                <p><span>${units}</span> Units</p>
                                <p><span>${lessons}</span> Lessons</p>
                                <p><span>${chapters}</span> Topics</p>
                            </div>
                            `}
                       
                        <div class="class-select">
                        <select name="class-name" ${isSelectDisabled ? "disabled" : ""}>
                            <option value="1">${className}</option>
                        </select>
                        </div>
                        <div class="class-info">
                        <span class="students">${noOfStudents}</span>
                        <span class="vr"></span>
                        <span class="dates">${dates}</span>
                        </div>
                    </div >
                    </div >
    <div class="card-footer">
        <img src="assets/icons/preview.svg" alt="Eye Icon">
            <img src="assets/icons/manage course.svg" alt="Schedule Icon">
                <img src="assets/icons/grade submissions.svg" alt="Submission Icon">
                    <img src="assets/icons/reports.svg" alt="Chart Icon">
                    </div>
                </div>
            </div>
            `;
    }
}



const dynamicLoad = async () => {
    const response = await fetch("courses.json");
    const classData = await response.json();

    const dashboardGrid = document.querySelector("#courses-grid");
    dashboardGrid.innerHTML = "";

    for (card of classData) {
        let { imgSrc,
            topic,
            subject,
            grade,
            point,
            stats,
            className,
            info,
            isSelectDisabled,
            isGray } = card;

        let cardImg = createElement("div", "card-img");
        cardImg.innerHTML = `<img src="${imgSrc}" alt="Image 1">`

        let cardDetails = createElement('div', "card-details");

        let cardHead = createElement("div", "card-head");
        cardHead.innerHTML =
            `
        <div class="topic">${topic}</div>
        <img class="star-icon ${isGray ? "gray" : ""}" src="assets/icons/favourite.svg" alt="Star Icon">
        `;

        cardDetails.appendChild(cardHead);

        let cardSubject = createElement("div", "card-subject");
        cardSubject.innerHTML =
            `
        <span class="subject">${subject}</span>
        <span class="vr"></span>
        <span class="grade">${grade}</span>
        <span class="point">${point}</span>
        `;

        cardDetails.appendChild(cardSubject);

        if (stats) {
            let classStats = createElement("div", "class-stats");
            classStats.innerHTML =
                `
                <p><span>${stats.units}</span> Units</p>
                <p><span>${stats.lessons}</span> Lessons</p>
                <p><span>${stats.chapters}</span> Topics</p>
            `;
            cardDetails.appendChild(classStats);
        }

        let classSelect = createElement("div", "class-select");
        classSelect.innerHTML = `
            <select name="class-name" id="teacher" ${isSelectDisabled ? "disabled" : ""}>
                    <option value="1">${className}</option>
            </select>
        `;
        cardDetails.appendChild(classSelect);

        if (info) {
            let classInfo = createElement("div", "class-info");
            classInfo.innerHTML = `
            <span class="students">${info.noOfStudents}</span>
            <span class="vr"></span>
            <span class="dates">${info.dates}</span>
            `
            cardDetails.appendChild(classInfo);
        }


        const cardFooter = document.createElement("div");
        cardFooter.className = "card-footer";
        cardFooter.innerHTML = `
            <img src="assets/icons/preview.svg" alt="Eye Icon">
            <img src="assets/icons/manage course.svg" alt="Schedule Icon">
            <img src="assets/icons/grade submissions.svg" alt="Submission Icon">
            <img src="assets/icons/reports.svg" alt="Chart Icon">
        `;

        let cardMain = createElement("div", "card-main");
        cardMain.appendChild(cardImg);
        cardMain.appendChild(cardDetails);



        let cardContent = createElement("div", "card-content");
        cardContent.appendChild(cardMain);
        cardContent.appendChild(cardFooter);

        let newCard = createElement("div", "course-card");
        newCard.appendChild(cardContent);
        dashboardGrid.appendChild(newCard);

    }

}

dynamicLoad();


function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}




// document.addEventListener("DOMContentLoaded", loadDashboard);