// Hamburger Functionality
function handleMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const items: NodeListOf<HTMLElement> = document.querySelectorAll(".item");

    if (!(header instanceof HTMLElement)) {
        throw new Error("Incorrect Header Or Null");
    }

    if (!(nav instanceof HTMLElement)) {
        throw new Error("Incoored Nav or Null");
    }

    if (!items) {
        throw new Error("Incorrect Items or Null");
    }

    header.classList.toggle('mobile');
    items.forEach(item => item.classList.toggle('mobile'))

    nav.classList.toggle('mobile')
}

// Active Link
const links: NodeListOf<HTMLElement> = document.querySelectorAll('.item');
if (!links) {
    throw new Error("Incorrect nav links or Null");
}

links.forEach(link => {
    link.addEventListener('click', () => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});


// Active Class or Courses
const headItem: NodeListOf<HTMLElement> = document.querySelectorAll(".head-item ");
if (!headItem) {
    throw new Error("Incorrect nav links or Null");
}

headItem.forEach(item => {
    item.addEventListener('click', () => {
        headItem.forEach(i => i.classList.remove("is-active"));
        item.classList.add("is-active")
    })
});


interface classTypes {
    imgSrc: string;
    topic: string;
    subject: string;
    grade: string;
    point: string;
    stats?: {
        units: number;
        lessons: number;
        chapters: number;
    }
    footerIcons?: {
        eye?: string;
        submission?: string;
        schedule?: string;
        chart?: string;
    },
    className: string;
    info?: {
        noOfStudents?: string;
        dates?: string;
    },
    isSelectDisabled?: boolean;
    isGray?: boolean;
}

// const loadDashboard = async () => {
//     const response = await fetch("courses.json");
//     const classData: classTypes[] = await response.json();
//     const dashboardGrid: HTMLElement | null = document.querySelector("#courses-grid");
//     if (!dashboardGrid) {
//         throw new Error("Dashboard Grid Not Found or Null");
//     }

//     dashboardGrid.innerHTML = "";
//     let i = 1;

//     for (let card of classData) {
//         let { imgSrc,
//             topic,
//             subject,
//             grade,
//             point,
//             units,
//             lessons,
//             chapters,
//             className,
//             noOfStudents,
//             dates,
//             isSelectDisabled,
//             isGray } = card;

//         dashboardGrid.innerHTML += `
//             <div class="course-card">
//                 <div class="card-content">
//                     <div class="card-main">
//                     <div class="card-img">
//                         <img src="${imgSrc}" alt="Image ${i++}">
//                     </div>
//                     <div class="card-details">
//                         <div class="card-head">
//                         <div class="topic">${topic}</div>
//                         <img class="star-icon ${isGray ? "gray" : ""}" src="assets/icons/favourite.svg" alt="Star Icon">
//                         </div>
//                         <div class="card-subject">
//                         <span class="subject">${subject}</span>
//                         <span class="vr"></span>
//                         <span class="grade">${grade}</span>
//                         <span class="point">${point}</span>
//                         </div>
//                         ${(!units) ?
//                 "" :
//                 `
//                             <div div class="class-stats" >
//                                 <p><span>${units}</span> Units</p>
//                                 <p><span>${lessons}</span> Lessons</p>
//                                 <p><span>${chapters}</span> Topics</p>
//                             </div>
//                             `}

//                         <div class="class-select">
//                         <select name="class-name" ${isSelectDisabled ? "disabled" : ""}>
//                             <option value="1">${className}</option>
//                         </select>
//                         </div>
//                         <div class="class-info">
//                         <span class="students">${noOfStudents}</span>
//                         <span class="vr"></span>
//                         <span class="dates">${dates}</span>
//                         </div>
//                     </div >
//                     </div >
//     <div class="card-footer">
//         <img src="assets/icons/preview.svg" alt="Eye Icon">
//             <img src="assets/icons/manage course.svg" alt="Schedule Icon">
//                 <img src="assets/icons/grade submissions.svg" alt="Submission Icon">
//                     <img src="assets/icons/reports.svg" alt="Chart Icon">
//                     </div>
//                 </div>
//             </div>
//             `;
//     }
// }

function toggleFav(event: MouseEvent) {
    const target = event.target as HTMLElement;
    target.classList.toggle('gray');
}


const dynamicLoad = async (): Promise<void> => {
    const response = await fetch("courses.json");
    const classData = await response.json();

    const dashboardGrid: HTMLElement | null = document.querySelector("#courses-grid");
    if (!dashboardGrid) {
        throw new Error("Dashboard Grid Not Found or Null");
    }
    dashboardGrid.innerHTML = "";

    for (let card of classData) {
        let { imgSrc,
            topic,
            subject,
            grade,
            point,
            stats,
            footerIcons,
            className,
            info,
            isSelectDisabled,
            isGray } = card;
        console.log(classData);
        let cardImg = createElement("div", "card-img");
        cardImg.innerHTML = `<img src="${imgSrc}" alt="Image 1">`

        let cardDetails = createElement('div', "card-details");

        let cardHead = createElement("div", "card-head");
        cardHead.innerHTML =
            `
        <div class="topic">${topic}</div>
        <img class="star-icon ${isGray ? "gray" : ""}" src="assets/icons/favourite.svg" alt="Star Icon">
        `;

        const starIcon: HTMLElement | null = cardHead.querySelector(".star-icon");
        if (starIcon) {
            starIcon.addEventListener("click", toggleFav);
        }
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
                <p><span>${stats?.units}</span> Units</p>
                <p><span>${stats?.lessons}</span> Lessons</p>
                <p><span>${stats?.chapters}</span> Topics</p>
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
            <span class="students">${info?.noOfStudents}</span>
            <span class="vr"></span>
            <span class="dates">${info?.dates}</span>
            `
            cardDetails.appendChild(classInfo);
        }
        const cardFooter = document.createElement("div");

        if (footerIcons) {
            cardFooter.className = "card-footer";
            cardFooter.innerHTML = `
            <img src="assets/icons/preview.svg" alt="Eye Icon" class=${footerIcons?.eye}>
            <img src="assets/icons/manage course.svg" alt="Schedule Icon" class=${footerIcons?.schedule}>
            <img src="assets/icons/grade submissions.svg" alt="Submission Icon" class=${footerIcons?.submission}>
            <img src="assets/icons/reports.svg" alt="Chart Icon" class=${footerIcons?.chart}>
        `;
        } else {
            cardFooter.className = "card-footer";
            cardFooter.innerHTML = `
            <img src="assets/icons/preview.svg" alt="Eye Icon" >
            <img src="assets/icons/manage course.svg" alt="Schedule Icon" >
            <img src="assets/icons/grade submissions.svg" alt="Submission Icon" >
            <img src="assets/icons/reports.svg" alt="Chart Icon">
        `;
        }



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

function createElement(tag: keyof HTMLElementTagNameMap, className: string) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

document.addEventListener("DOMContentLoaded", dynamicLoad);

// Toggle Favourite (star icon)

document.addEventListener("DOMContentLoaded", () => {
    const allStars = document.querySelectorAll<HTMLElement>(".star-icon");
    allStars.forEach(el => el.addEventListener('click', toggleFav))
})