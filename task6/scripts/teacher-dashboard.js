var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Hamburger Functionality
function handleMobileMenu() {
    const menuIcon = document.querySelector("#menu-button");
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const items = document.querySelectorAll(".item");
    if (!(header instanceof HTMLElement)) {
        throw new Error("Incorrect Header Or Null");
    }
    if (!(nav instanceof HTMLElement)) {
        throw new Error("Incoored Nav or Null");
    }
    if (!items) {
        throw new Error("Incorrect Items or Null");
    }
    if (!(menuIcon instanceof HTMLElement)) {
        throw new Error("Incorrect Header Or Null");
    }
    menuIcon.classList.toggle('open');
    header.classList.toggle('mobile');
    items.forEach(item => item.classList.toggle('mobile'));
    nav.classList.toggle('mobile');
}
const menu = document.getElementById("menu-button");
if (menu) {
    menu.addEventListener('click', handleMobileMenu);
}
// Active Link
const links = document.querySelectorAll('.item');
if (!links) {
    throw new Error("Incorrect nav links or Null");
}
links.forEach(link => {
    link.addEventListener('click', () => {
        links.forEach(l => {
            l.classList.remove('active');
        });
        link.classList.add('active');
    });
});
const items = document.querySelectorAll('.item');
if (!items) {
    throw new Error("Incorrect nav items or Null");
}
items.forEach(item => {
    item.addEventListener('click', () => {
        // Remove 'active' and 'show' from all items
        items.forEach(i => {
            i.classList.remove('active');
            const dropdown = i.querySelector('.dropdown');
            if (dropdown)
                dropdown.classList.remove('show');
        });
        // Add 'active' to clicked item
        item.classList.add('active');
        // Add 'show' to the dropdown of the clicked item, if it exists
        const dropdown = item.querySelector('.dropdown');
        if (dropdown)
            dropdown.classList.add('show');
    });
});
// Active Class or Courses
const headItem = document.querySelectorAll(".head-item ");
if (!headItem) {
    throw new Error("Incorrect nav links or Null");
}
headItem.forEach(item => {
    item.addEventListener('click', () => {
        headItem.forEach(i => i.classList.remove("is-active"));
        item.classList.add("is-active");
    });
});
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
function toggleFav(event) {
    const target = event.target;
    target.classList.toggle('gray');
}
const dynamicLoad = () => __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch("courses.json");
    const classData = yield response.json();
    const dashboardGrid = document.querySelector("#courses-grid");
    if (!dashboardGrid) {
        throw new Error("Dashboard Grid Not Found or Null");
    }
    dashboardGrid.innerHTML = "";
    for (let card of classData) {
        let { imgSrc, topic, subject, grade, point, stats, footerIcons, className, info, isSelectDisabled, isGray } = card;
        console.log(classData);
        let cardImg = createElement("div", "card-img");
        cardImg.innerHTML = `<img src="${imgSrc}" alt="Image 1">`;
        let cardDetails = createElement('div', "card-details");
        let cardHead = createElement("div", "card-head");
        cardHead.innerHTML =
            `
        <div class="topic">${topic}</div>
        <img class="star-icon ${isGray ? "gray" : ""}" src="assets/icons/favourite.svg" alt="Star Icon">
        `;
        const starIcon = cardHead.querySelector(".star-icon");
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
                <p><span>${stats === null || stats === void 0 ? void 0 : stats.units}</span> Units</p>
                <p><span>${stats === null || stats === void 0 ? void 0 : stats.lessons}</span> Lessons</p>
                <p><span>${stats === null || stats === void 0 ? void 0 : stats.chapters}</span> Topics</p>
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
            <span class="students">${info === null || info === void 0 ? void 0 : info.noOfStudents}</span>
            <span class="vr"></span>
            <span class="dates">${info === null || info === void 0 ? void 0 : info.dates}</span>
            `;
            cardDetails.appendChild(classInfo);
        }
        const cardFooter = document.createElement("div");
        if (footerIcons) {
            cardFooter.className = "card-footer";
            cardFooter.innerHTML = `
            <img src="assets/icons/preview.svg" alt="Eye Icon" class=${footerIcons === null || footerIcons === void 0 ? void 0 : footerIcons.eye}>
            <img src="assets/icons/manage course.svg" alt="Schedule Icon" class=${footerIcons === null || footerIcons === void 0 ? void 0 : footerIcons.schedule}>
            <img src="assets/icons/grade submissions.svg" alt="Submission Icon" class=${footerIcons === null || footerIcons === void 0 ? void 0 : footerIcons.submission}>
            <img src="assets/icons/reports.svg" alt="Chart Icon" class=${footerIcons === null || footerIcons === void 0 ? void 0 : footerIcons.chart}>
        `;
        }
        else {
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
});
function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}
document.addEventListener("DOMContentLoaded", dynamicLoad);
// Toggle Favourite (star icon)
document.addEventListener("DOMContentLoaded", () => {
    const allStars = document.querySelectorAll(".star-icon");
    allStars.forEach(el => el.addEventListener('click', toggleFav));
});
