// variables
let bookmarks = [];

let bookmarkSiteName = document.getElementById("bookmark-site-name");
let bookmarkSiteUrl = document.getElementById("bookmark-site-url");
let submitButton = document.getElementById("submit-button");

let bookmarkTableContent = document.getElementById("bookmark-table");
let deleteButtons;
let visitButtons;

let closeAlert = document.getElementById("close-alert");
let alertModal = document.querySelector(".alert-box");

// check if there is bookmarks in localstorage
if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  for (var x = 0; x < bookmarks.length; x++) {
    displayBookmark(x);
  }
}

// display bookmark function
function displayBookmark(index) {
  // regex for website url
  const urlRegex = /^https?:\/\//g;

  let userURL = bookmarks[index].bookmarkSiteUrl;
  if (urlRegex.test(userURL)) {
    validURL = userURL;
    fixedURL = validURL
      .split("")
      .splice(validURL.match(urlRegex)[0].length)
      .join("");
  } else {
    let fixedURL = userURL;
    validURL = `https://${userURL}`;
  }
  let newBookmark = `
              <tr>
                <td>${index + 1}</td>
                <td>${bookmarks[index].bookmarkSiteName}</td>              
                <td>
                  <button class="btn btn-visit" data-index="${index}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit
                  </button>
                </td>
                <td>
                  <button class="btn btn-delete pe-2" data-index="${index}">
                    <i class="fa-solid fa-trash-can"></i>
                    Delete
                  </button>
                </td>
            </tr>
            `;
  bookmarkTableContent.innerHTML += newBookmark;

  deleteButtons = document.querySelectorAll(".btn-delete");
  if (deleteButtons) {
    for (let d = 0; d < deleteButtons.length; d++) {
      deleteButtons[d].addEventListener("click", function (e) {
        deleteBookmark(e);
      });
    }
  }

  visitButtons = document.querySelectorAll(".btn-visit");
  if (visitButtons) {
    for (var l = 0; l < visitButtons.length; l++) {
      visitButtons[l].addEventListener("click", function (e) {
        visitWebsite(e);
      });
    }
  }
}

// clear inputs after create new bookmark
function clearInput() {
  bookmarkSiteName.value = "";
  bookmarkSiteUrl.value = "";
}

// capitalize first letter of website name
function capitalize(str) {
  let strArr = str.split("");
  strArr[0] = strArr[0].toUpperCase();
  return strArr.join("");
}

// delete bookmark
function deleteBookmark(e) {
  bookmarkTableContent.innerHTML = "";
  var deletedIndex = e.target.dataset.index;
  bookmarks.splice(deletedIndex, 1);
  for (var k = 0; k < bookmarks.length; k++) {
    displayBookmark(k);
  }
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
}

// visit website
function visitWebsite(e) {
  var websiteIndex = e.target.dataset.index;
  var httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(bookmarks[websiteIndex].bookmarkSiteUrl)) {
    open(bookmarks[websiteIndex].bookmarkSiteUrl);
  } else {
    open(`https://${bookmarks[websiteIndex].bookmarkSiteUrl}`);
  }
}

// validate function
function validate(element, regex) {
  var testRegex = regex;
  if (testRegex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

// Close alert modal
function closeModal() {
  alertModal.classList.add("d-none");
}

// add new bookmark
submitButton.addEventListener("click", function () {
  if (
    bookmarkSiteName.classList.contains("is-valid") &&
    bookmarkSiteUrl.classList.contains("is-valid")
  ) {
    var bookmark = {
      bookmarkSiteName: capitalize(bookmarkSiteName.value),
      bookmarkSiteUrl: bookmarkSiteUrl.value,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmark(bookmarks.length - 1);
    clearInput();
    bookmarkSiteName.classList.remove("is-valid");
    bookmarkSiteUrl.classList.remove("is-valid");
  } else {
    alertModal.classList.remove("d-none");
  }
});

// regex for site name and site url
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

// validate site name
bookmarkSiteName.addEventListener("input", function () {
  validate(bookmarkSiteName, nameRegex);
});

// validate site url
bookmarkSiteUrl.addEventListener("input", function () {
  validate(bookmarkSiteUrl, urlRegex);
});

// trigger close modal event when user clicks on the close icon
closeAlert.addEventListener("click", closeModal);

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("alert-box")) {
    closeModal();
  }
});

// trigger close modal event when user clicks on Escape button
document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    closeModal();
  }
});
