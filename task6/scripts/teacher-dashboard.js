var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Hamburger Functionality
function handleMobileMenu() {
    var menuIcon = document.querySelector("#menu-button");
    var header = document.querySelector('header');
    var nav = document.querySelector('nav');
    var items = document.querySelectorAll(".item");
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
    items.forEach(function (item) { return item.classList.toggle('mobile'); });
    nav.classList.toggle('mobile');
}
var menu = document.getElementById("menu-button");
if (menu) {
    menu.addEventListener('click', handleMobileMenu);
}
// Active Link
// const links: NodeListOf<HTMLElement> = document.querySelectorAll('.item');
// if (!links) {
//     throw new Error("Incorrect nav links or Null");
// }
// links.forEach(link => {
//     link.addEventListener('click', () => {
//         links.forEach(l => {
//             l.classList.remove('active');
//         });
//         link.classList.add('active');
//     });
// });
var items = document.querySelectorAll('.item');
if (!items) {
    throw new Error("Incorrect nav items or Null");
}
items.forEach(function (item) {
    item.addEventListener('click', function () {
        // Remove 'active' and 'show' from all items
        items.forEach(function (i) {
            i.classList.remove('active');
            var dropdown = i.querySelector('.dropdown');
            if (dropdown)
                dropdown.classList.remove('show');
        });
        // Add 'active' to clicked item
        item.classList.toggle('active');
        // Add 'show' to the dropdown of the clicked item, if it exists
        var dropdown = item.querySelector('.dropdown');
        if (dropdown)
            dropdown.classList.toggle('show');
    });
});
// Notifications
var alertIcon = document.getElementById('alert');
var alertPreview = document.getElementById("alert-preview");
var announcementIcon = document.getElementById('announcement');
var announcementPreview = document.getElementById('announcement-preview');
var alertCount = document.querySelector(".alert-count");
var announcementCount = document.querySelector(".announcement-count");
var alertImg = document.getElementById("alert-img");
var announceImg = document.getElementById("announce-img");
function invertAndHide(element) {
    element.classList.remove('open');
}
function showPreview(previewElement) {
    previewElement.classList.add("show");
    previewElement.classList.add("open");
}
function hideAll() {
    alertPreview.classList.remove("show");
    announcementPreview.classList.remove("show");
    invertAndHide(alertCount);
    invertAndHide(announcementCount);
    invertAndHide(alertImg);
    invertAndHide(announceImg);
}
// Show the Previews
alertIcon.addEventListener("mouseenter", function () {
    showPreview(alertPreview);
    alertCount.classList.add('open');
    alertImg.classList.add("open");
});
announcementIcon.addEventListener("mouseenter", function () {
    showPreview(announcementPreview);
    announcementCount.classList.add('open');
    announceImg.classList.add("open");
});
// Hide on mouse Leave
alertIcon.addEventListener("mouseleave", function () {
    setTimeout(function () { return hideAll(); }, 200);
});
announcementIcon.addEventListener("mouseleave", function () {
    setTimeout(function () { return hideAll(); }, 200);
});
// Active Class or Courses
var headItem = document.querySelectorAll(".head-item ");
if (!headItem) {
    throw new Error("Incorrect nav links or Null");
}
headItem.forEach(function (item) {
    item.addEventListener('click', function () {
        headItem.forEach(function (i) { return i.classList.remove("is-active"); });
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
    var target = event.target;
    target.classList.toggle('gray');
}
var dynamicLoad = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, classData, dashboardGrid, _i, classData_1, card, imgSrc, topic, subject, grade, point, stats, footerIcons, className, info, isSelectDisabled, isGray, cardImg, cardDetails, cardHead, starIcon, cardSubject, classStats, classSelect, classInfo, cardFooter, cardMain, cardContent, newCard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("courses.json")];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                classData = _a.sent();
                dashboardGrid = document.querySelector("#courses-grid");
                if (!dashboardGrid) {
                    throw new Error("Dashboard Grid Not Found or Null");
                }
                dashboardGrid.innerHTML = "";
                for (_i = 0, classData_1 = classData; _i < classData_1.length; _i++) {
                    card = classData_1[_i];
                    imgSrc = card.imgSrc, topic = card.topic, subject = card.subject, grade = card.grade, point = card.point, stats = card.stats, footerIcons = card.footerIcons, className = card.className, info = card.info, isSelectDisabled = card.isSelectDisabled, isGray = card.isGray;
                    cardImg = createElement("div", "card-img");
                    cardImg.innerHTML = "<img src=\"".concat(imgSrc, "\" alt=\"Image 1\">");
                    cardDetails = createElement('div', "card-details");
                    cardHead = createElement("div", "card-head");
                    cardHead.innerHTML =
                        "\n        <div class=\"topic\">".concat(topic, "</div>\n        <img class=\"star-icon ").concat(isGray ? "gray" : "", "\" src=\"assets/icons/favourite.svg\" alt=\"Star Icon\">\n        ");
                    starIcon = cardHead.querySelector(".star-icon");
                    if (starIcon) {
                        starIcon.addEventListener("click", toggleFav);
                    }
                    cardDetails.appendChild(cardHead);
                    cardSubject = createElement("div", "card-subject");
                    cardSubject.innerHTML =
                        "\n        <span class=\"subject\">".concat(subject, "</span>\n        <span class=\"vr\"></span>\n        <span class=\"grade\">").concat(grade, "</span>\n        <span class=\"point\">").concat(point, "</span>\n        ");
                    cardDetails.appendChild(cardSubject);
                    if (stats) {
                        classStats = createElement("div", "class-stats");
                        classStats.innerHTML =
                            "\n                <p><span>".concat(stats === null || stats === void 0 ? void 0 : stats.units, "</span> Units</p>\n                <p><span>").concat(stats === null || stats === void 0 ? void 0 : stats.lessons, "</span> Lessons</p>\n                <p><span>").concat(stats === null || stats === void 0 ? void 0 : stats.chapters, "</span> Topics</p>\n            ");
                        cardDetails.appendChild(classStats);
                    }
                    classSelect = createElement("div", "class-select");
                    classSelect.innerHTML = "\n            <select name=\"class-name\" id=\"teacher\" ".concat(isSelectDisabled ? "disabled" : "", " class=").concat(isSelectDisabled ? "disabled" : "", ">\n                    <option value=\"1\">").concat(className, "</option>\n            </select>\n        ");
                    cardDetails.appendChild(classSelect);
                    if (info) {
                        classInfo = createElement("div", "class-info");
                        classInfo.innerHTML = "\n            <span class=\"students\">".concat(info === null || info === void 0 ? void 0 : info.noOfStudents, "</span>\n            <span class=\"vr\"></span>\n            <span class=\"dates\">").concat(info === null || info === void 0 ? void 0 : info.dates, "</span>\n            ");
                        cardDetails.appendChild(classInfo);
                    }
                    cardFooter = document.createElement("div");
                    if (footerIcons) {
                        cardFooter.className = "card-footer";
                        cardFooter.innerHTML = "\n            <img src=\"assets/icons/preview.svg\" alt=\"Eye Icon\" class=".concat(footerIcons === null || footerIcons === void 0 ? void 0 : footerIcons.eye, ">\n            <img src=\"assets/icons/manage course.svg\" alt=\"Schedule Icon\" class=").concat(footerIcons === null || footerIcons === void 0 ? void 0 : footerIcons.schedule, ">\n            <img src=\"assets/icons/grade submissions.svg\" alt=\"Submission Icon\" class=").concat(footerIcons === null || footerIcons === void 0 ? void 0 : footerIcons.submission, ">\n            <img src=\"assets/icons/reports.svg\" alt=\"Chart Icon\" class=").concat(footerIcons === null || footerIcons === void 0 ? void 0 : footerIcons.chart, ">\n        ");
                    }
                    else {
                        cardFooter.className = "card-footer";
                        cardFooter.innerHTML = "\n            <img src=\"assets/icons/preview.svg\" alt=\"Eye Icon\" >\n            <img src=\"assets/icons/manage course.svg\" alt=\"Schedule Icon\" >\n            <img src=\"assets/icons/grade submissions.svg\" alt=\"Submission Icon\" >\n            <img src=\"assets/icons/reports.svg\" alt=\"Chart Icon\">\n        ";
                    }
                    cardMain = createElement("div", "card-main");
                    cardMain.appendChild(cardImg);
                    cardMain.appendChild(cardDetails);
                    cardContent = createElement("div", "card-content");
                    cardContent.appendChild(cardMain);
                    cardContent.appendChild(cardFooter);
                    newCard = createElement("div", "course-card");
                    newCard.appendChild(cardContent);
                    dashboardGrid.appendChild(newCard);
                }
                return [2 /*return*/];
        }
    });
}); };
function createElement(tag, className) {
    var element = document.createElement(tag);
    element.className = className;
    return element;
}
document.addEventListener("DOMContentLoaded", dynamicLoad);
// Toggle Favourite (star icon)
document.addEventListener("DOMContentLoaded", function () {
    var allStars = document.querySelectorAll(".star-icon");
    allStars.forEach(function (el) { return el.addEventListener('click', toggleFav); });
});
