document.addEventListener("DOMContentLoaded", function () {
  //load all courses
  filtercourses();

  //filter courses on click
  filtericon = document.querySelector("#filtericon");
  filtericon.addEventListener("click", () => filtercourses());
  //change to row view
  rowicon = document.querySelector("#rowview");
  rowicon.addEventListener("click", function () {
    document.querySelector(".courses_view").style.display = "none";
    document.querySelector(".courses_view_row").style.display = "block";
  });
  //change to grid view
  gridicon = document.querySelector("#gridview");
  gridicon.addEventListener("click", function () {
    document.querySelector(".courses_view").style.display = "";
    document.querySelector(".courses_view_row").style.display = "none";
  });
});

function filtercourses() {
  filtericon = document.querySelector("#filtericon");
  category = document.querySelector("#category");
  level = document.querySelector("#level");
  if (category.value == "all categories" && level.value == "all levels") {
    view = "all";
  } else {
    view = "filtered";
  }
  fetch(`/courses/${view}`, {
    method: "PUT",
    body: JSON.stringify({
      category: category.value,
      level: level.value,
    }),
  })
    .then((response) => response.json())
    .then((courses) => {
      course_view_div = document.createElement("div");
      course_view_row_div = document.createElement("div");
      courses.forEach((course) => {
        const course_div = document.createElement("div");
        const course_row_div = document.createElement("div");
        course_row_div.innerHTML = `<div class="row" style="padding-top: 1em;padding-bottom: 1em; border-radius: 25px;" id="courserow">
        <div class="col-sm">
          <img
            class="img-fluid rounded"
            src="${course["coverimg"]}"
          />
        </div>
        <div class="col-sm">
          <a href="/coursedetails/${course["id"]}"><h4 style="font-weight: 590">${course["title"]}</h4></a>
          <p style="color: rgb(75, 68, 68)">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui eum
          </p>
        </div>
      </div>`;
        course_div.innerHTML = `<div class="card zoomin" style="width: 10em">
  <img src='${course["coverimg"]}' class="card-img-top" alt="..." />
  <div class="card-body">
    <h5 class="card-title">${course["title"]}</h5>
    <p class="card-text">${course["tagline"]}</p>
    <p class="card-text">${course["category"]}</p>
    <p class="card-text text-truncate">${course["description"]}</p>
    <a href="/coursedetails/${course["id"]}" class="btn btn-primary">Read More</a>
  </div>
</div>`;
        course_view_div.append(course_div);
        course_view_row_div.append(course_row_div);
      });
      document.querySelector(".courses_view").innerHTML =
        course_view_div.innerHTML;
      document.querySelector(".courses_view_row").innerHTML =
        course_view_row_div.innerHTML;
    });
}
