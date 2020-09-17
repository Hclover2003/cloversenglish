//comment(); 'load' = all, 'add' = add
//replycmt(); 'load' = replybox, 'reply' = api

//when page loaded, load all comments and addclickevent to submit comment
document.addEventListener("DOMContentLoaded", function () {
  comment("load");
  commentbtn = document.querySelector(".commentbtn");
  commentbtn.addEventListener("click", () => comment("add"));
  document
    .querySelector(".commenttxt")
    .addEventListener("input", () => togglecmtbtn());
});

function togglecmtbtn() {
  if (document.querySelector(".commenttxt").value.trim().length == 0) {
    commentbtn.disabled = true;
  } else {
    commentbtn.disabled = false;
  }
}

function comment(view) {
  comment_txtarea = document.querySelector(".commenttxt");
  fetch(`/comment/${view}`, {
    method: "post",
    body: JSON.stringify({
      comment: comment_txtarea.value,
      vidid: comment_txtarea.getAttribute("data-id"),
    }),
  })
    .then((rsp) => rsp.json())
    .then((comments) => {
      comments_div = document.createElement("div");
      comments.forEach((comment) => {
        comment_row = document.createElement("div");
        comment_time = moment(comment["timestamp"]).calendar();
        comment_row.id = `comment${comment["id"]}row`;
        comment_row.innerHTML = `
          <div class="media">
        <img src="/static/courses/img/balloons.jpg" class="mr-3" alt="..." style="width:3em;height:3em;border-radius:50%;object-fit:cover;"/>
        <div class="media-body">
          <h5 class="mt-0">${comment["username"]}<span style="font-size:0.9em;color:grey;">   ${comment_time}</span></h5>
          ${comment["comment"]}
          </br>
          <div class="d-flex flex-row-reverse">
          <div class="p-2"><a href="#d" id="delete" data-value="${comment["id"]}"><i class="fas fa-trash-alt"></i></a></div>

  <div class="p-2"><a href="#r" id="reply" data-value="${comment["id"]}">Reply</a></div>
  <div class="p-2"><a href="#l"><i class="far fa-heart"></i></a></div></div>
</div>
          
        </div>
        <div class="commentreplies ${comment["id"]}" data-value="${comment["id"]}"></div>
      <div class="replybox reply${comment["id"]}" ></div>
      <hr/>
        `;
        comment_txtarea.value = "";
        comments_div.append(comment_row);
      });
      document.querySelector("#comments_list").innerHTML =
        comments_div.innerHTML;

      //update display of total number of comments
      document.querySelector(
        "#commentnum"
      ).innerHTML = `${comments.length} comments`;

      //reply buttons
      document.querySelectorAll("#reply").forEach((reply) => {
        reply.addEventListener("click", () =>
          replycmt(reply.getAttribute("data-value"), "load")
        );
      });
      loadreplies();

      //delete buttons
      document.querySelectorAll("#delete").forEach((delbtn) => {
        delbtn.addEventListener("click", () =>
          delcmt(delbtn.getAttribute("data-value"), "comment")
        );
      });
    });
}

function replycmt(cmtid, view) {
  if (view == "load") {
    document.querySelectorAll(".replybox").forEach((reply) => {
      reply.innerHTML = "";
    });
    replybox = document.getElementsByClassName(`replybox reply${cmtid}`);
    replybox[0].innerHTML = `
    <div class="d-flex" style="margin-left: 3em; margin-top: 1em;">
    <img
      src="/static/courses/img/balloons.jpg"
      class="mr-3"
      alt="..."
      style="width: 3em; height: 3em; border-radius: 50%; object-fit: cover"
    />
    <textarea
          placeholder="Reply..."
          class="form-control"
          id="replytxtarea${cmtid}"
          rows="3"
          cols="80"
        ></textarea>
        <button
          class="btn btn-success replybtn"
          data-value = "${cmtid}"
          type="button"
          style="margin-left: 1em"
        >
          Reply
        </button><button
        class="btn btn-info cancelbtn"
        type="button"
        style="margin-left:0.5em;"
      >
        X
      </button></div>
  `;
    document.querySelectorAll(".replybtn").forEach((replybtn) => {
      replybtn.addEventListener("click", () =>
        replycmt(replybtn.getAttribute("data-value"), "reply")
      );
    });
    document.querySelectorAll(".cancelbtn").forEach((cancelbtn) => {
      cancelbtn.addEventListener("click", function () {
        replybox[0].innerHTML = "";
      });
    });
  } else if (view == "reply") {
    txtarea = document.querySelector(`#replytxtarea${cmtid}`);
    fetch("/reply", {
      method: "PUT",
      body: JSON.stringify({
        cmtid: cmtid,
        reply: txtarea.value,
      }),
    });
  } else {
  }
}

function delcmt(cmtid, view) {
  fetch("/delete", {
    method: "PUT",
    body: JSON.stringify({
      id: cmtid,
      view: view,
    }),
  }).then((rsp) => {
    console.log(rsp);
    comment("load");
  });
}

function loadreplies() {
  document.querySelectorAll(".commentreplies").forEach((cmtreplybox) => {
    fetch("/loadreplies", {
      method: "PUT",
      body: JSON.stringify({
        cmtid: cmtreplybox.getAttribute("data-value"),
      }),
    })
      .then((rsp) => rsp.json())
      .then((replies) => {
        replies.forEach((reply) => {
          replyarea = document.getElementsByClassName(
            `commentreplies ${reply["cmtid"]}`
          )[0];
          replyarea.innerHTML += `<div class="media reply" style="padding-left: 4em;">
          <img src="/static/courses/img/balloons.jpg" class="mr-3" alt="..." style="width:3em;height:3em;border-radius:50%;object-fit:cover;"/>
          <div class="media-body">
            <h5 class="mt-0">${reply["username"]}<span style="font-size:0.9em;color:grey;">   ${comment_time}</span></h5>
            ${reply["reply"]}
            </br>
            <div class="d-flex flex-row-reverse">
            <div class="p-2"><a href="#" id="delete"><i class="fas fa-trash-alt"></i></a></div>
    <div class="p-2"><a href="#a"><i class="far fa-heart"></i></a></div></div>
  </div>
            
          </div>
          <div class="commentreplies ${comment["id"]}" data-value="${comment["id"]}"></div>
        <div class="replybox reply${comment["id"]}" ></div>
        <hr/>
          `;
        });
      });
  });
}
