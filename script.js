// Hwange Community Tourism Portal - shared scripts

// Highlight the current page in the navigation
(function () {
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
})();

// Booking form validation
var bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  // Prevent past dates
  var dateInput = document.getElementById("date");
  dateInput.min = new Date().toISOString().split("T")[0];

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    function check(id, test, msg) {
      var el = document.getElementById(id);
      var err = document.getElementById(id + "Err");
      if (!test(el.value.trim())) { err.textContent = msg; ok = false; }
      else { err.textContent = ""; }
    }
    check("name", function (v) { return v.length >= 3; }, "Please enter your full name.");
    check("email", function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }, "Enter a valid email address.");
    check("phone", function (v) { return /^[+0-9\s-]{7,}$/.test(v); }, "Enter a valid phone number.");
    check("date", function (v) { return v !== ""; }, "Choose a date.");
    check("guests", function (v) { return v >= 1 && v <= 20; }, "Guests must be between 1 and 20.");

    if (ok) {
      var bookings = JSON.parse(localStorage.getItem("hwangeBookings") || "[]");
      bookings.push({
        name: document.getElementById("name").value,
        experience: document.getElementById("experience").value,
        date: document.getElementById("date").value,
        guests: document.getElementById("guests").value
      });
      localStorage.setItem("hwangeBookings", JSON.stringify(bookings));
      document.getElementById("bookingSuccess").style.display = "block";
      bookingForm.reset();
    }
  });
}

// Preselect experience from URL (?exp=Homestay)
var expSelect = document.getElementById("experience");
if (expSelect) {
  var q = new URLSearchParams(location.search).get("exp");
  if (q) expSelect.value = q;
}

// Reviews: add and store visitor reviews
var reviewForm = document.getElementById("reviewForm");
var reviewList = document.getElementById("reviewList");
function renderReview(r, prepend) {
  var div = document.createElement("div");
  div.className = "review";
  var stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
  var s = document.createElement("div");
  s.className = "stars"; s.textContent = stars;
  var p = document.createElement("p");
  p.textContent = "“" + r.text + "”";
  var b = document.createElement("strong");
  b.textContent = "— " + r.name;
  div.appendChild(s); div.appendChild(p); div.appendChild(b);
  if (prepend) reviewList.insertBefore(div, reviewList.firstChild);
  else reviewList.appendChild(div);
}
if (reviewForm && reviewList) {
  JSON.parse(localStorage.getItem("hwangeReviews") || "[]").forEach(function (r) { renderReview(r, true); });
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var r = {
      name: document.getElementById("rname").value.trim(),
      rating: parseInt(document.getElementById("rating").value, 10),
      text: document.getElementById("rtext").value.trim()
    };
    if (!r.name || !r.text) return;
    var all = JSON.parse(localStorage.getItem("hwangeReviews") || "[]");
    all.push(r);
    localStorage.setItem("hwangeReviews", JSON.stringify(all));
    renderReview(r, true);
    reviewForm.reset();
  });
}

// Gallery: simple click-to-enlarge caption
document.querySelectorAll(".gallery .tile").forEach(function (t) {
  t.addEventListener("click", function () {
    alert(t.getAttribute("data-caption"));
  });
});
