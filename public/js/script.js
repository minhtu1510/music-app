// Aplayer
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  const dataSong = JSON.parse(aplayer.getAttribute("data-song"));
  const dataSinger = JSON.parse(aplayer.getAttribute("data-singer"));
  const datasameSong = JSON.parse(aplayer.getAttribute("data-same-song"));
  const data = [
    {
      name: dataSong.title,
      artist: dataSinger.fullName,
      url: dataSong.audio,
      cover: dataSong.avatar,
      lrc: dataSong.lyrics,
    },
  ];
  for (item of datasameSong) {
    const tmp = {
      name: item.title,
      artist: dataSinger.fullName,
      url: item.audio,
      cover: item.avatar,
      lrc: item.lyrics,
    };
    data.push(tmp);
  }
  const ap = new APlayer({
    container: aplayer,
    lrcType: 1,
    audio: data,
    autoplay: true,
  });
  const avatar = document.querySelector(".singer-detail .inner-avatar");
  ap.on("play", function () {
    avatar.style.animationPlayState = "running";
  });

  ap.on("pause", function () {
    avatar.style.animationPlayState = "paused";
  });

  ap.on("ended", function () {
    fetch(`/songs/listen/${dataSong._id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          document.querySelector(
            ".singer-detail .inner-listen span"
          ).innerHTML = data.listen;
        }
      });
  });
}
// End Aplayer

//Tính năng like
const buttonLike = document.querySelector("[button-like]");

if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const id = buttonLike.getAttribute("button-like");
    const userId = buttonLike.getAttribute("user-id");
    if (userId != "") {
      let status = "";
      if (buttonLike.classList.contains("active")) {
        buttonLike.classList.remove("active");
        status = "dislike";
      } else {
        buttonLike.classList.add("active");
        status = "like";
      }
      const dataLike = {
        id: id,
        status: status,
        userId: userId,
      };

      fetch("/songs/like", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataLike),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.code == "success") {
            buttonLike.querySelector("span").innerHTML = data.like;
            console.log(buttonLike.querySelector("span"));
            console.log(data.like);
          }
        });
    } else {
      handleClickPremium();
    }
  });
}
//Hết tính năng like

//Tính năng yêu thích
const listbuttonFavorite = document.querySelectorAll("[button-favorite]");
if (listbuttonFavorite.length > 0) {
  listbuttonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const id = buttonFavorite.getAttribute("button-favorite");
      const userId = buttonFavorite.getAttribute("user-id");
      if (userId != "") {
        buttonFavorite.classList.toggle("active");
        const dataLike = {
          songId: id,
          userId: userId,
        };

        fetch("/songs/favorite", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataLike),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "success") {
              console.log("Đã thêm bài hát vào danh sách yêu thích");
            }
          });
      } else {
        handleClickPremium();
      }
    });
  });
}
//Hết tính năng yêu thích

//Gợi ý tìm kiếm
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const input = boxSearch.querySelector(`input[name="keyword"]`);
  const innerSuggest = boxSearch.querySelector(".inner-suggest");
  const innerList = boxSearch.querySelector(".inner-list");
  input.addEventListener("keyup", () => {
    const keyword = input.value;

    fetch(`/songs/search/suggest?keyword=${keyword}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.songs.length > 0) {
          const htmls = data.songs.map(
            (item) => `
          <a class="inner-item" href="/songs/detail/${item.slug}">
          <div class="inner-image">
            <img src="${item.avatar}">
          </div>
          <div class="inner-info">
            <div class="inner-title">${item.title}</div>
            <div class="inner-singer">
              <i class="fa-solid fa-microphone-lines"></i> ${item.singerFullName}
            </div>
          </div>
        </a> 
          `
          );
          innerSuggest.classList.add("show");
          innerList.innerHTML = htmls.join("");
        } else {
          innerSuggest.classList.remove("show");
          innerList.innerHTML = "";
        }
      });
  });
}
//Hết gợi ý tìm kiếm

//premium
// const premium = document.querySelector(".song-item");
// if(premium){
//   premium.addEventListener("click", () => {
//     const song = document.querySelector(["active"]);
//     console.log(song);
//     if(song != null){

//     }
//   })
// }
function handlePremium(event, isPremium) {
  if (isPremium) {
    console.log("okeee");
    // Hiển thị thông báo yêu cầu đăng nhập
    alert("Nội dung Premium. Vui lòng đăng nhập để truy cập.");
    // Ngăn điều hướng mặc định
    event.preventDefault();
  }
}
// const song_image = document.querySelector(".song-item .inner-image");
// const song_title = document.querySelector(".song-item .inner-title");
// const isPremium = true;
// if(song && isPremium){
//   song.addEventListener("click", (event) => {
//     console.log("oke");
//     event.preventDefault();
//     alert("Nội dung Premium. Vui lòng đăng nhập để truy cập.");
//   })
// }
const song_images = document.querySelectorAll(".song-item .inner-image");
const body = document.querySelector(".inner-main");
song_images.forEach((item) => {
  item.addEventListener("click", (event) => {
    const type_song = item.getAttribute("type_song");
    if (type_song === "premium") {
      event.preventDefault();
      const modal = document.createElement("div");
      modal.setAttribute("class", "modal_login");
      modal.innerHTML = `
        <div class="modal-main"> 
          <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
          <div class="modal-wrap">
            <img src="/images/image_login.png" alt="ảnh">
            <div class="modal-title">Đăng nhập vào tài khoản</div>
            <a href="/auth/login">Đăng nhập</a>
          </div>
          
        </div>
        <div class="bg-modal"></div>
      `;
      body.appendChild(modal);

      const close_btn = document.querySelector(".modal-btn");
      close_btn.addEventListener("click", () => {
        body.removeChild(modal);
      });
    }
  });
});

const song_title = document.querySelectorAll(".song-item .inner-title");
song_title.forEach((item) => {
  item.addEventListener("click", (event) => {
    const type_song = item.getAttribute("type_song");
    if (type_song === "premium") {
      event.preventDefault();
      const modal_pro = document.createElement("div");
      modal_pro.setAttribute("class", "modal_pro");
      modal_pro.innerHTML = `
        <div class="modal-main"> 
          <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
          <div class="modal-wrap">
            <img src="/images/image_login.png" alt="ảnh">
            <div class="modal-title">Muốn nghe full bản nhạc</div>
            <div class="modal-title--sub1">Nâng cấp gói premium chỉ từ 13.000đ</div>
            <div class="modal-title--sub2">Tặng bạn thêm nhiều đặc quyền khác hấp dẫn khác.</div>
            <button onclick="handleClickPremium()">Khám phá ngay</button>
          </div>
          
        </div>
        <div class="bg-modal"></div>
      `;
      body.appendChild(modal_pro);

      const close_btn = document.querySelector(".modal_pro .modal-btn");
      close_btn.addEventListener("click", () => {
        body.removeChild(modal_pro);
      });
    }
  });
});
handleClickPremium = () => {
  const modal = document.createElement("div");
  modal.setAttribute("class", "modal_login");
  modal.innerHTML = `
      <div class="modal-main"> 
        <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
        <div class="modal-wrap">
          <img src="/images/image_login.png" alt="ảnh">
          <div class="modal-title">Đăng nhập vào tài khoản</div>
          <a href="/auth/login">Đăng nhập</a>
        </div>
          
      </div>
      <div class="bg-modal"></div>
  `;
  body.appendChild(modal);
  console.log(modal);
  const close_btn = document.querySelector(".modal_login .modal-btn");
  close_btn.addEventListener("click", () => {
    body.removeChild(modal);
  });
};
//hết premium
//Chay Audio
// khi click audio
handlePlayAudio = (event, song, singer) => {
  const audio = song.audio;

  const elementAudio = document.querySelector(".play-audio");
  //hiện play
  elementAudio.classList.add("begin");
  if (elementAudio) {
    const innerAudio = elementAudio.querySelector(".inner-audio");
    if (innerAudio) {
      //đổi source audio sau đó load lại và chạy
      innerAudio.src = audio;
      innerAudio.load();
      innerAudio.play();
    }
    console.log(innerAudio);
    //đổi tên, ảnh, ca sĩ trên thanh play
    const elementTitle = elementAudio.querySelector(".inner-title");
    elementTitle.innerHTML = song.title;
    const elementSinger = elementAudio.querySelector(".inner-singer");
    elementSinger.innerHTML = singer;
    const elementImage = elementAudio.querySelector(".inner-image");
    elementImage.src = song.avatar;
    //hien thi nut pause
    const btnPlay = document.querySelector(".button-play");
    btnPlay.classList.add("run");

    //lấy tổng thời gian
    const elementPlayTimeTotal = elementAudio.querySelector(
      ".play__time .inner-total"
    );
    // const elementPlayTimeCurrent = elementAudio.querySelector(".play__time .inner-current");
    innerAudio.onloadedmetadata = () => {
      const timeTotal = innerAudio.duration;
      elementPlayTimeTotal.max = timeTotal;

      //lấy thời gian hiện tại
      innerAudio.ontimeupdate = () => {
        const timeCurrent = innerAudio.currentTime;
        const percent = (timeCurrent * 100) / timeTotal;
        // elementPlayTimeCurrent.style.width = `${percent}%`;
        elementPlayTimeTotal.value = timeCurrent;
      };
    };

    //chuyển màu click btn
    const songItem = document.querySelector(`[song-id = "${song._id}"]`);
    //xóa tất cả các active
    const songOldItem = document.querySelector("[song-id].active");

    if (songOldItem) {
      songOldItem.classList.remove("active");
    }
    //click
    if (songItem) {
      songItem?.classList.add("active");
    }
  }
};
handlePlay = () => {
  //nut play/pause
  const elementAudio = document.querySelector(".play-audio");
  const innerAudio = elementAudio.querySelector(".inner-audio");
  const btnPlay = document.querySelector(".button-play");
  console.log(btnPlay);
  if (btnPlay.classList.contains("run")) {
    btnPlay.classList.remove("run");
    innerAudio.pause();
  } else {
    btnPlay.classList.add("run");
    innerAudio.play();
  }
};
handleChangeTime = (event) => {
  // thành audio phát nhạc
  const elementAudio = document.querySelector(".play-audio");
  const innerAudio = elementAudio.querySelector(".inner-audio");
  innerAudio.currentTime = parseFloat(event.target.value);
};

handleChangeVolume = (event) => {
  const elementAudio = document.querySelector(".play-audio");
  const innerAudio = elementAudio.querySelector(".inner-audio");
  volume = parseFloat(event.target.value);
  //volume: [0,1]
  innerAudio.volume = volume / 100;

  const elementPlayVolume = elementAudio.querySelector(
    ".play__volume .inner-total"
  );
  elementPlayVolume.value = volume;
};

//nút đến bài hát tiếp theo
handleClickNextSong = () => {
  const songItem = document.querySelector("[song-id].active");
  const nextSong = songItem.nextElementSibling;
  if (nextSong) {
    const btnPlay = nextSong.querySelector(".dataSection1__button");
    btnPlay.click();
  }
};
//quay lại bài trước
handleClickPreSong = () => {
  const songItem = document.querySelector("[song-id].active");
  const preSong = songItem.previousElementSibling;
  if (preSong) {
    const btnPlay = preSong.querySelector(".dataSection1__button");
    btnPlay.click();
  }
};

//Hết Chay Audio

// alert-message
const alertMessage = document.querySelector("[alert-message]");
if (alertMessage) {
  setTimeout(() => {
    alertMessage.style.display = "none";
  }, 3000);
}
// End alert-message
