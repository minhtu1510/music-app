// Aplayer
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  const dataSong = JSON.parse(aplayer.getAttribute("data-song"));
  const dataSinger = JSON.parse(aplayer.getAttribute("data-singer"));
  const ap = new APlayer({
    container: aplayer,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
      },
    ],
    autoplay: true,
  });
  const avatar = document.querySelector(".singer-detail .inner-avatar");
  ap.on("play", function () {
    avatar.style.animationPlayState = "running";
  });

  ap.on("pause", function () {
    avatar.style.animationPlayState = "paused";
  });
}
// End Aplayer

//Tính năng like
const buttonLike = document.querySelector("[button-like]")
if(buttonLike){
  buttonLike.addEventListener("click",()=>{
    const id = buttonLike.getAttribute("button-like")
    let status=""
    if(buttonLike.classList.contains("active")){
      buttonLike.classList.remove("active")
      status="dislike"
    } else{
      buttonLike.classList.add("active")
      status="like"
    }
    const dataLike = {
      id:id,
      status:status
    }

    fetch("/songs/like",{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(dataLike)
    })
      .then(res=>res.json())
      .then(data=>{
        if(data.code=="success"){
          buttonLike.querySelector("span").innerHTML=data.like
        }
      })

  })
}
//Hết tính năng like

//Tính năng yêu thích
const listbuttonFavorite = document.querySelectorAll("[button-favorite]");
if (listbuttonFavorite.length > 0) {
  listbuttonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const id = buttonFavorite.getAttribute("button-favorite");
      buttonFavorite.classList.toggle("active");

      // const dataLike = {
      //   id:id,
      //   status:status
      // }

      fetch("/songs/favorite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            console.log("Đã thêm bài hát vào danh sách yêu thích");
          }
        });
    });
  });
}
//Hết tính năng yêu thích


