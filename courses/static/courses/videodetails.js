//addcmt(); 'load' = all, 'add' = add
//replycmt(); 'load' = replybox, 'reply' = api

document.addEventListener("DOMContentLoaded", function () {
  commentbtn = document.querySelector(".commentbtn");
  addcmt("load");
  commentbtn.addEventListener("click", () => addcmt("add"));
});

function addcmt(view) {
  txtara = document.querySelector(".commenttxt");
  if (txtara.value == "" && view == "add") {
    document.querySelector("#error_msg").innerHTML = "can't be empty!";
  } else {
    fetch(`/comment/${view}`, {
      method: "post",
      body: JSON.stringify({
        comment: txtara.value,
        vidid: txtara.getAttribute("data-id"),
      }),
    })
      .then((rsp) => rsp.json())
      .then((comments) => {
        comments_div = document.createElement("div");
        comments.forEach((comment) => {
          comment_row = document.createElement("div");
          comment_time = moment(comment["timestamp"]).calendar();
          comment_row.innerHTML = `
          <div id="comment${comment["id"]}row">
          <div class="media">
        <img src="/static/courses/img/balloons.jpg" class="mr-3" alt="..." style="width:3em;height:3em;border-radius:50%;object-fit:cover;"/>
        <div class="media-body">
          <h5 class="mt-0">${comment["username"]}<span style="font-size:0.9em;color:grey;">   ${comment_time}</span></h5>
          ${comment["comment"]}
          </br>
          <div class="d-flex flex-row-reverse">
          <div class="p-2"><a href="#" id="delete"><i class="fas fa-trash-alt"></i></a></div>

  <div class="p-2"><a href="#a" id="reply" data-value="${comment["id"]}">Reply</a></div>
  <div class="p-2"><a href="#a"><i class="far fa-heart"></i></a></div></div>
</div>
          
        </div>
      </div>
      <div class="replybox reply${comment["id"]}" ></div>
      <hr/>
        `;
          txtara.value = "";
          comments_div.append(comment_row);
        });
        document.querySelector("#comments_list").innerHTML =
          comments_div.innerHTML;
        document.querySelector("#error_msg").innerHTML = "";
        document.querySelector(
          "#commentnum"
        ).innerHTML = `${comments.length} comments`;
        document.querySelectorAll("#reply").forEach((reply) => {
          reply.addEventListener("click", () =>
            replycmt(reply.getAttribute("data-value"))
          );
        });
      });
  }
}

function replycmt(cmtid, view) {
  if (view == "load") {
    document.querySelectorAll(".replybox").forEach((reply) => {
      reply.innerHTML = "";
    });
    replybox = document.getElementsByClassName(`replybox reply${cmtid}`);
    replybox[0].innerHTML = `
    <img
      src="/static/courses/img/balloons.jpg"
      class="mr-3"
      alt="..."
      style="width: 3em; height: 3em; border-radius: 50%; object-fit: cover"
    />
    <input type="text" placeholder="Reply..." id="replyinput" />
  `;
  } else if (view == "reply") {
  } else {
    console.log("not a valid reply view");
  }
}
