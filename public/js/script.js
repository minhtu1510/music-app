// Aplayer
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  const dataSong = JSON.parse(aplayer.getAttribute("data-song"));
  const dataSinger = aplayer.getAttribute("data-singer");
  console.log(dataSinger);
  const datasameSong = JSON.parse(aplayer.getAttribute("data-same-song"));
  const data = [
    {
      name: dataSong.title,
      artist: dataSinger,
      url: dataSong.audio,
      cover: dataSong.avatar,
      lrc: dataSong.lyrics,
      type_song: dataSong.type_song,
    },
  ];
  for (item of datasameSong) {
    const tmp = {
      name: item.title,
      artist: item.nameSinger,
      url: item.audio,
      cover: item.avatar,
      lrc: item.lyrics,
      type_song: item.type_song,
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
  const imgDetail = document.querySelector("[img-detail]");

  ap.on("listswitch", async function () {
    // Lấy danh sách bài hát
    const audios = await ap.list.audios; // Đây là danh sách bài hát
    const index = await ap.list.index;
    // Lấy bài hát hiện tại // Sử dụng index của bài hát được chuyển
    imgDetail.src = audios[index].cover;
  });
  ap.on("play", async function () {
    avatar.style.animationPlayState = "running";
    const currentIndex = await ap.list.index; // Lấy index bài hiện tại
    const nextAudio = await ap.list.audios[currentIndex]; // Lấy bài tiếp theo
    console.log(nextAudio);
    if (nextAudio && nextAudio.type_song == "premium") {
      // Kiểm tra nếu bài tiếp theo là premium
      fetch("/songs/check-premium", {
        method: "POST",
        body: JSON.stringify({ song: nextAudio.name }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isAllowed) {
            ap.list.switch(currentIndex + 1); // Chuyển bài nếu được phép
            ap.play();
          } else {
            ap.pause();
            alertFunc(
              "Bài hát này yêu cầu tài khoản premium!",
              3000,
              "alert--error"
            );
          }
        });
    } else {
      // Chuyển bài bình thường
      ap.play();
    }
  });

  ap.on("pause", function () {
    avatar.style.animationPlayState = "paused";
  });
  ap.on("ended", async function () {
    const currentIndex = await ap.list.index; // Lấy index bài hiện tại
    const nextAudio = await ap.list.audios[currentIndex]; // Lấy bài tiếp theo
    console.log(nextAudio);
    if (nextAudio && nextAudio.type_song == "premium") {
      // Kiểm tra nếu bài tiếp theo là premium
      fetch("/songs/check-premium", {
        method: "POST",
        body: JSON.stringify({ song: nextAudio.name }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isAllowed) {
            ap.list.switch(currentIndex + 1); // Chuyển bài nếu được phép
            ap.play();
          } else {
            ap.pause();
            alertFunc(
              "Bài hát này yêu cầu tài khoản premium!",
              3000,
              "alert--error"
            );
          }
        });
    } else {
      ap.list.switch(currentIndex); // Chuyển bài bình thường
      ap.play();
    }
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
      console.log(id);
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
         
          <a class="inner-item" href="/songs/detail/${item.slug}" >
          <div class="inner-image">
            <img src="${item.avatar}">
          </div>
          <div class="inner-info">
            <div class="inner-title" type_song = ${item.type_song}>${item.title}</div>
            <div class="inner-singer">
              <i class="fa-solid fa-microphone-lines"></i> ${item.singerFullName}
            </div>
          </div>
          <div class="inner-premium ${item.type_song} ${item.type_song=="premium" ? "active" : ""} ">
           Premium
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

        // const a = document.createElement("a");
        // a.className = "inner-item";
        // a.href = link;
        // a.textContent = "Xem chi tiết bài hát";
      
        // // Thêm xử lý click nếu là premium
        // if (item.type_song === "premium") {
        //   a.addEventListener("click", (e) => {
        //     e.preventDefault(); // Ngăn hành động mặc định
        //     alert("Bạn không có quyền truy cập vào nội dung premium."); // Hiển thị thông báo
        //   });
        // }
      });
  });
}
//Hết gợi ý tìm kiếm
//THÔNG BÁO
var alertFunc = (content = null, time = 3000, type = "alert--success") => {
  if (content) {
    const newAlert = document.createElement("div");

    newAlert.setAttribute("class", `alert ${type}`);
    newAlert.innerHTML = `
          <div class="alert-content">${content}</div>
          <div class="alert-close"><i class="fa-solid fa-xmark"></i></div>
      `;
    var listAlert = document.querySelector(".list-alert");
    if (listAlert) {
      listAlert.appendChild(newAlert);

      const alertClose = newAlert.querySelector(".alert-close");
      alertClose.addEventListener("click", () => {
        listAlert.removeChild(newAlert);
      });
      console.log(listAlert);
      setTimeout(() => {
        listAlert.removeChild(newAlert);
      }, time);
    }
  }
};
//premium

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
// const song_images = document.querySelectorAll(".song-item .inner-image");
// const body = document.querySelector(".inner-main");
// song_images.forEach((item) => {

// });
const body = document.querySelector(".inner-main");
// handleCheckPremium = (event, type_song)=> {
//     if (type_song === "premium") {
//       event.preventDefault();
//       const modal = document.createElement("div");
//       modal.setAttribute("class", "modal_login");
//       modal.innerHTML = `
//         <div class="modal-main">
//           <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
//           <div class="modal-wrap">
//             <img src="/images/image_login.png" alt="ảnh">
//             <div class="modal-title">Đăng nhập vào tài khoản</div>
//             <a href="/auth/login">Đăng nhập</a>
//           </div>

//         </div>
//         <div class="bg-modal"></div>
//       `;
//       body.appendChild(modal);

//       const close_btn = document.querySelector(".modal-btn");
//       close_btn.addEventListener("click", () => {
//         body.removeChild(modal);
//       });
//     }
// }

handleCheckPremium = (event, users) => {
  if ((users && users.type_user == "basic") || !users) {
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
          <button id="btn-check-premium" >Khám phá ngay</button>
        </div>
      </div>
      <div class="bg-modal"></div>
    `;
    body.appendChild(modal_pro);

    const close_btn = document.querySelector(".modal_pro .modal-btn");
    close_btn.addEventListener("click", () => {
      body.removeChild(modal_pro);
    });
    const btnCheck = document.querySelector("#btn-check-premium");
    btnCheck.addEventListener("click", () => {
      if (users) {
        window.location.href = "http://localhost:3000/payment";
      } else {
        handleClickPremium();
      }
    });
  }
};
// const song_title = document.querySelectorAll(".song-item .inner-title");
// song_title.forEach((item) => {
//   item.addEventListener("click", (event) => {
//     const type_song = item.getAttribute("type_song");
//     if (type_song === "premium") {
//       event.preventDefault();
//       const modal_pro = document.createElement("div");
//       modal_pro.setAttribute("class", "modal_pro");
//       modal_pro.innerHTML = `
//         <div class="modal-main">
//           <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
//           <div class="modal-wrap">
//             <img src="/images/image_login.png" alt="ảnh">
//             <div class="modal-title">Muốn nghe full bản nhạc</div>
//             <div class="modal-title--sub1">Nâng cấp gói premium chỉ từ 13.000đ</div>
//             <div class="modal-title--sub2">Tặng bạn thêm nhiều đặc quyền khác hấp dẫn khác.</div>
//             <button onclick="handleClickPremium()">Khám phá ngay</button>
//           </div>

//         </div>
//         <div class="bg-modal"></div>
//       `;
//       body.appendChild(modal_pro);

//       const close_btn = document.querySelector(".modal_pro .modal-btn");
//       close_btn.addEventListener("click", () => {
//         body.removeChild(modal_pro);
//       });
//     }
//   });
// });
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
    let timeTotal;
    let timeCurrent;

    innerAudio.onloadedmetadata = () => {
      timeTotal = innerAudio.duration;
      elementPlayTimeTotal.max = timeTotal;

      //lấy thời gian hiện tại
      innerAudio.ontimeupdate = () => {
        timeCurrent = innerAudio.currentTime;
        const percent = (timeCurrent * 100) / timeTotal;
        // elementPlayTimeCurrent.style.width = `${percent}%`;
        elementPlayTimeTotal.value = timeCurrent;

        //khi hết thời gian tự động sang bài tiếp theo
        if (timeCurrent == timeTotal) {
          handleClickNextSong();
        }
      };
    };

    //chuyển màu click btn
    const songItem = document.querySelector(`[song-id-main = "${song._id}"]`);
    console.log(songItem);
    //xóa tất cả các active
    const songOldItem = document.querySelector("[song-id-main].active");

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
  const songItem = document.querySelector("[song-id-main].active");
  // nếu có thì thuộc phần main , nếu không là thuộc playlist
  const check = songItem.querySelector(".dataSection1__button");
  const nextSong = songItem.nextElementSibling;

  if (check) {
    if (nextSong) {
      const btnPlay = nextSong.querySelector(".dataSection1__button");
      btnPlay.click();
    }
  } else {
    if (nextSong) {
      const btnPlay = nextSong.querySelector(
        ".box-item__category--title--btnPlay"
      );
      btnPlay.click();
    }
  }
};
//quay lại bài trước
handleClickPreSong = () => {
  const songItem = document.querySelector("[song-id-main].active");
  // nếu có thì thuộc phần main , nếu không là thuộc playlist
  const check = songItem.querySelector(".dataSection1__button");
  const preSong = songItem.previousElementSibling;
  if (check) {
    if (preSong) {
      const btnPlay = preSong.querySelector(".dataSection1__button");
      btnPlay.click();
    }
  } else {
    if (preSong) {
      const btnPlay = nextSong.querySelector(
        ".box-item__category--title--btnPlay"
      );
      btnPlay.click();
    }
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

//Hiện thông báo tạo playlist
handleCreatePlaylist = (songId="") => {
  console.log(songId);
    const modal = document.createElement("div");
    modal.setAttribute("class", "modal-create-playlist");
    // action="/playlist" method="POST"
    modal.innerHTML = `
        <div class="modal-main"> 
          <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
          <form id="modal-create-playlist-new" class="modal-wrap">
            <div class="modal-title">Tạo playlist mới</div>
            <input type="text" name="namePlaylist" placeholder="Nhập tên playlist...">
            <button type="submit" onClickCreate songId=${songId}>Tạo mới</button>
          </form>
            
        </div>
        <div class="bg-modal"></div>
    `;
    body.appendChild(modal);
    const close_btn = document.querySelector(".modal-create-playlist .modal-btn");
    close_btn.addEventListener("click", () => {
      body.removeChild(modal);
    });
    const form = document.querySelector("#modal-create-playlist-new");
    form.addEventListener("submit", () =>{
      const namePlaylist = form.namePlaylist.value;
      if(!namePlaylist){
        alertFunc("Vui lòng nhập tên playlist",3000,"alert--error")
        return;
    }
      console.log(namePlaylist)
      const data={
        namePlaylist: namePlaylist
      }
      fetch("/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          return res.json(); // Chỉ cần gọi một lần
        })
        .then((data) => {
          if (data.code == "success") {
            
            console.log(data.newPlaylistId)
            console.log("thanh cong")
            if(songId != null){
              id=data.newPlaylistId;
              _path=`/playlist/addSong/${songId}`;
              handleAddSong(id,_path)
            }
            window.location.href = window.location.href;
          }})
    
   
    })
    

  
};
//Hết Hiện thông báo tạo playlist
//thông báo khác của playlist <chỉnh sửa - xoa>
const clickMessageOtherPlaylist = document.querySelector(
  ".playlist-detail__image--other"
);
if (clickMessageOtherPlaylist) {
  clickMessageOtherPlaylist.addEventListener("click", () => {
    let modalMessageOther = document.querySelector(".modal-message-other");

    const playlistId = clickMessageOtherPlaylist.getAttribute("playlist-id");
    if (!modalMessageOther) {
      let modalMessageOther = document.createElement("div");
      modalMessageOther.setAttribute("class", "modal-message-other");
      modalMessageOther.innerHTML = `
        <div class="modal-message-other__wrap">
          <button onclick="handleMessageEditPlaylist('${playlistId}')"> <i class="fa-solid fa-pen"></i>  Chỉnh sửa playlist</button>  
          <button onclick="handleRemovePlaylist('${playlistId}')"><i class="fa-solid fa-trash-can"></i> Xóa playlist</button>  
        </div>
      `;
      clickMessageOtherPlaylist.appendChild(modalMessageOther);
    } else {
      clickMessageOtherPlaylist.removeChild(modalMessageOther);
    }
  });
}

//hết thông báo khác của playlist <chỉnh sửa - xoa>

//Thêm bài hát vào playlist
handleAddSong = (id,_path="") => {
  const modal = document.querySelector(".modal-add-playlist");
  const dataSection1 = document.querySelector(".dataSection1");
  const boxPlaylistDetail = document.querySelector(
    ".playlist-detail__songSuggest--item"
  );
  let path;
  if (modal) {
    const pathElement = modal.querySelector("[path]");
    path = pathElement.getAttribute("path");
  } else if (boxPlaylistDetail ||dataSection1) {
    path = _path;
  }
  console.log(`_path : ${_path}`);
  console.log(`path : ${path}`);
  console.log(`id: ${path}`);
  const data = { id: id };
  console.log(data);
  console.log(JSON.stringify(data)); // Kiểm tra dữ liệu

  fetch(path, {
    // fetch(path, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      // if (!res.ok) {
      //   throw new Error(`HTTP error! Status: ${res.status}`);
      // }
      return res.json(); // Chỉ cần gọi một lần
    })
    .then((data) => {
      if (data.code == "success") {
        alertFunc("Thêm vào playlist thành công");
        window.location.href = window.location.href;
        // window.location.href = "/playlist";
        const modal = document.querySelector(".modal-add-playlist");
        modal.remove();
      } else {
        alertFunc("Đã tồn tại bài hát trong playlist", 3000, "alert--error");
      }
    });
};
handleAddSongPlaylist = (event, songId) => {
  //danh sach playlist trong thư mục playlist
  const playlistElement = document.querySelector("[playlist]");
  let playlist = playlistElement.getAttribute("playlist");
  playlist = JSON.parse(playlist);

  const dataSection1 = document.querySelector(".dataSection1");

  //tạo giao diện thêm playlist
  const modal = document.createElement("div");
  modal.setAttribute("class", "modal-add-playlist");
  let content = `
      <div class="modal-main"> 
        <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
        <div class="modal-wrap">  
          <input type="text" id="nameSearchPlaylist" name="keyword" placeholder="Nhập tên playlist...">
          <div class="modal-playlist">
            <div class="modal-create-new-playlist" onclick="handleCreatePlaylist('${songId}')">
              <i class="fa-solid fa-plus"></i>
              <div class="modal-item--title"> Tạo playlist mới
              </div>
            </div>
            <div class="modal-add-old-playlist-list" playlist='${JSON.stringify(playlist)}' >
            `;
  for (const item of playlist) {
    content += `
            
              <div class="modal-add-old-playlist">
                <i class="fa-solid fa-icons"></i>
                <div class="modal-item--title" path="/playlist/addSong/${songId}" onClick="handleAddSong('${item._id}', '/playlist/addSong/${songId}')" >${item.title}</div>
              </div>
            `;
  }
  content += `
            </div>
          </div>
          
        </div>
          
      </div>
      <div class="bg-modal"></div>
  `;
  modal.innerHTML = content;
  body.appendChild(modal);
  const close_btn = document.querySelector(".modal-add-playlist .modal-btn");
  close_btn.addEventListener("click", () => {
    body.removeChild(modal);
  });

  //tim kiem
  const inputElement = modal.querySelector(`input[name="keyword"]`);
  inputElement.addEventListener("keyup", (event) =>{
    keyword = event.target.value;
    console.log(`keyword : ${keyword}`);
    const listElement = modal.querySelector(".modal-add-old-playlist-list");
    console.log(listElement);
    let playlist = listElement.getAttribute("playlist");
    playlist=JSON.parse(playlist)
    console.log(playlist);
    const list = playlist.filter(item => item.title.includes(keyword));
    console.log(list)
    let content;
    for (const item of list) {
       content+=
      `
                <div class="modal-add-old-playlist">
                  <i class="fa-solid fa-icons"></i>
                  <div class="modal-item--title" path="/playlist/addSong/${songId}" onClick="handleAddSong('${item._id}', '/playlist/addSong/${songId}')" >${item.title}</div>
                </div>
      `
    }
    listElement.innerHTML = content
    if(keyword =""){
      let content;
      for (const item of playlist) {
        content +=
        `
                  <div class="modal-add-old-playlist">
                    <i class="fa-solid fa-icons"></i>
                    <div class="modal-item--title" path="/playlist/addSong/${songId}" onClick="handleAddSong('${item._id}', '/playlist/addSong/${songId}')" >${item.title}</div>
                  </div>
        `
      }
      listElement.innerHTML = content
    }
  
  })

};

//Hết Thêm bài hát vào playlist
//Xóa bài hát khỏi playlist
handleDeleteSongPlaylist = (songId, playlistId) => {
  console.log(songId);
  console.log(playlistId);
  const data = {
    songId: songId,
    playlistId: playlistId,
  };
  songId = JSON.stringify(songId);
  fetch(`/playlist/deleteSong/${songId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.code == "success") {
        alertFunc("Xóa bài hát thành công");
        window.location.href = window.location.href;
      } else {
        alertFunc("Xóa bài hát không thành công", 3000, "alert--error");
      }
    });
};
//Hết Xóa bài hát khỏi playlist
//Account
const accountClick = document.querySelector(".account .avatarAccount");
if (accountClick) {
  accountClick.addEventListener("click", () => {
    const account = document.querySelector(".account");
    const img = document.querySelector(".account .avatarAccount img");
    let user = img.getAttribute("user");
    user = JSON.parse(user);
    let modalAccount = document.querySelector(".modal-info-account");
    if (!modalAccount) {
      const modalAccount = document.createElement("div");
      modalAccount.setAttribute("class", "modal-info-account");
      modalAccount.innerHTML = `
      <div class="account-wrap">
        <div class="account-info">
          <img src=${user.avatar} alt="ảnh">
          <div class="account-title">
            <div class="account-title--name">${user.fullName}</div>
            <div class="account-title-type ${user.type_user == "premium" ? "premium" : "basic" }">${user.type_user}</div>
          </div>
        </div>
        <button id="btn-update">Nâng cấp tài khoản</button>
      </div>
    `;
      account.appendChild(modalAccount);
      const btnCheck = document.querySelector("#btn-update");
      btnCheck.addEventListener("click", () => {
        window.location.href = "http://localhost:3000/payment";
      });
    } else {
      account.removeChild(modalAccount);
    }
  });
}

//Hết Account
//Search
const input = document.querySelector(".search .form-group input");
const searchBox = document.querySelector(".search .inner-list");
if(input && searchBox) {
  document.addEventListener("click", (event) => {
    if(event.target == searchBox || event.target == input){
      searchBox.style.display = "block";
      // console.log(`target: ${event.target.a}`);
    }else{
      searchBox.style.display = "none";

    }
    // event.preventDefault();
    //nếu nhấn vào item là premium sẽ hiện thông báo
    console.log(event.target);
      // Kiểm tra nếu phần tử được click là một liên kết (class "inner-item")
    if (event.target.classList.contains("inner-title")) {
      const isPremium = event.target.getAttribute("type_song") === "premium"; // Lấy giá trị premium
      
      if (isPremium) {
        event.preventDefault(); // Ngăn hành động mặc định (chuyển trang)
        alertFunc("Bạn không có quyền truy cập vào nội dung premium.",3000,"alert--error"); // Hiển thị thông báo
      }
    }
  })
}
//hiên premium của favoriteSong và detailSinger
const songItemFavorite = document.querySelector(".song-item");
const songDetailSinger = document.querySelector(".box-item__category");
if(songItemFavorite || songDetailSinger){
  document.addEventListener("click", (event) => {
    // event.preventDefault();
    //nếu nhấn vào item là premium sẽ hiện thông báo
    console.log(event.target);
      // Kiểm tra nếu phần tử được click là một liên kết (class "inner-item")
    if (event.target.tagName == "A" || event.target.tagName == "IMG") {
      const isPremium = event.target.getAttribute("type_song") === "premium"; // Lấy giá trị premium
      if (isPremium) {
        event.preventDefault(); // Ngăn hành động mặc định (chuyển trang)
        alertFunc("Bạn không có quyền truy cập vào nội dung premium.",3000,"alert--error"); // Hiển thị thông báo
      }
    }
  })
}
//Hết hiên premium của favoriteSong và detailSinger
//Hết hiên premium của favoriteSong và detailSinger

// if (input) {
//   input.addEventListener("blur", (e) => {
//     if (!searchBox.contains(document.activeElement)) {
//       searchBox.style.display = "none";
//     }
//   });
//   input.addEventListener("click", () => {
//     searchBox.style.display = "block";
//     // searchBox.focus();
//   });
//   searchBox.addEventListener("click", () => {
//     searchBox.style.display = "block";
//   })
// }
//Hết Search


//Hiện  chỉnh sửa playlist
// handleEditPlaylist = (event, path) =>{
//   event.preventDefault();
// const formEdit = document.querySelector(".modal-edit-playlist form");
// const inputEdit = formEdit.newNamePlaylist.value;
// console.log(inputEdit);
// const data = {content:input}
// console.log(path)
// console.log(data)
// fetch(path, {
//   method: "PATCH",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(data),
// }).then(res => res.json)
// .then((data) => {
//   if(data.code == "success"){
//     alertFunc("Chinh sua thanh cong")
//   }else{
//     alertFunc("Chinh sua khong thanh cong",3000,"alert--error");
//   }
// })
// }
//Hiện thông báo chỉnh sửa playlist
handleMessageEditPlaylist = (playlistId) => {
  console.log(`playlistId: ${playlistId}`);

  const modal = document.createElement("div");
  modal.setAttribute("class", "modal-edit-playlist");
  const oldNamePlaylistElement = document.querySelector(
    ".playlist-detail__image--title-main"
  );
  let oldSlugPlaylist;
  let checkDetailOrNot = true;
  if(!oldNamePlaylistElement){
    const oldNamePlaylistElement_index = document.querySelector(`[playlistId = "${playlistId}"]`)
    const innerTitle = oldNamePlaylistElement_index.querySelector(".playlist-old-name-playlist")
    oldSlugPlaylist = innerTitle.getAttribute("slug");
    console.log(`ten :${oldSlugPlaylist}`)
    playlistClickOther(playlistId);
    checkDetailOrNot = false
  }else{
    oldSlugPlaylist = oldNamePlaylistElement.getAttribute("slug");
    console.log(oldSlugPlaylist);
  }


  //
  modal.innerHTML = `
      <div class="modal-main"> 
        <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
        <form class="modal-wrap">
          <div class="modal-title">Chỉnh sửa playlist</div>
          <input type="text" name="newNamePlaylist" placeholder="Nhập tên playlist...">
          <button>Lưu</button>
        </form>
          
      </div>
      <div class="bg-modal"></div>
  `;
  body.appendChild(modal);
  const close_btn = document.querySelector(".modal-edit-playlist .modal-btn");
  close_btn.addEventListener("click", () => {
    body.removeChild(modal);
  });

  const form = document.querySelector(".modal-edit-playlist form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input").value;
    if(!input){
      alertFunc("Vui lòng nhập tên playlist chỉnh sửa",3000,"alert--error")
      return;
  }
    console.log(input);
    const data = {
      newNamePlaylist: input,
      id: playlistId,
    };

    fetch(`/playlist/detail/${oldSlugPlaylist}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.code == "success") {
          alertFunc("Chinh sua thanh cong");
          console.log("thanhcong");
          modal.remove();
          if(checkDetailOrNot){
            oldNamePlaylistElement.innerHTML = input;
            history.pushState(
              {},
              "",
              `/playlist/detail/${encodeURIComponent(data.newSlug)}`

            );
            location.reload(); // Reload trang hiện tại
          }else{
            location.reload();
            window.location.href  =  window.location.href ;
          }
          
         
          console.log(`sau bien doi: ${oldNamePlaylistElement}`);
          // Thay đổi URL mà không reload trang
          
          // 
          
        } else {
          alertFunc("Chinh sua khong thanh cong", 3000, "alert--error");
        }
      });
  });
};
//Hết Hiện thông báo chỉnh sửa playlist

//Hiện nút xóa bài hát khỏi playlist
// handleDisplayButtonDelete = () => {

// }
const displayDelete = document.querySelector(
  ".box-item__category--title-btn-delete"
);
if (displayDelete) {
  displayDelete.addEventListener("click", () => {
    const music = document.querySelector(".box-items__category");

    let modalDelete = document.querySelector(".modal-delete-music");
    if (!modalDelete) {
      const modalDelete = document.createElement("div");
      modalDelete.setAttribute("class", "modal-delete-music");
      modalDelete.innerHTML = `
        <div class="modal-delete-music__wrap"> 
            <button onclick="handleRemovePlaylist()"><i class="fa-solid fa-trash-can"></i> Xóa bài hát khỏi playlist</button>  
        </div>
      `;
      music.appendChild(modalDelete);
    } else {
      music.removeChild(modalDelete);
    }
  });
}

//Hết Hiện nút xóa bài hát khỏi playlist
//Hiện thông báo có chắc chắn muốn xóa không
handleRemovePlaylist = (playlistId) => {
  const modal = document.createElement("div");
  modal.setAttribute("class", "modal-check-remove-playlist");
  modal.innerHTML = `
      <div class="modal-main"> 
        <div class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
        <form class="modal-wrap">
          <div class="modal-title">Bạn có chắc chắn muốn xóa bài hát khỏi playlist này không</div>
          <div class="modal-buttons">
            <button id="btn-agree-delete">Có</button>
            <button id="btn-disagree-delete">Hủy</button>
          </div>
          
        </form>
          
      </div>
      <div class="bg-modal"></div>
  `;
  body.appendChild(modal);
  const close_btn = document.querySelector(
    ".modal-check-remove-playlist .modal-btn"
  );
  close_btn.addEventListener("click", () => {
    body.removeChild(modal);
  });
  const oldNamePlaylistElement = document.querySelector(
    ".playlist-detail__image--title-main"
  );
  let oldNamePlaylist;
  let checkDetailOrNot = true;
  if(!oldNamePlaylistElement){

    const oldNamePlaylistElement_index = document.querySelector(`[playlistId = "${playlistId}"]`)
    const innerTitle = oldNamePlaylistElement_index.querySelector(".playlist-old-name-playlist")
    oldNamePlaylist = innerTitle.getAttribute("title");
    console.log(`ten :${oldNamePlaylist}`)
    playlistClickOther(playlistId);
    checkDetailOrNot = false
  }else{
    oldNamePlaylist = oldNamePlaylistElement.getAttribute("title");
    console.log(oldNamePlaylist);
  }
  // const oldNamePlaylist = oldNamePlaylistElement.getAttribute("title");
  const data = {
    id: playlistId,
  };

  const btnDelete = document.querySelector("#btn-agree-delete");
  btnDelete.addEventListener("click", () => {
    fetch(`/playlist/detail/${oldNamePlaylist}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.code == "success") {
          window.location.href = "/playlist";
          alertFunc("Xóa thanh cong");
          console.log("thanhcong");
          modal.remove();
          // Thay đổi URL mà không reload trang
        } else {
          alertFunc("Xóa khong thanh cong", 3000, "alert--error");
        }
      });
  });
};
//Hiện thông báo có chắc chắn muốn xóa không
//phát bài hát trong playlist
//nút tiếp tục phát
handlePlaySongInPlaylist = (event) => {
  // handlePlayAudio(event, song, singer)
  const listSong = document.querySelector(
    ".playlist-detail .playlist-detail__songOfPlaylist--list"
  );
  console.log(listSong);
  // box-items__category
  //kiểm tra có bài hát đang phát chưa, nếu chưa thì chọn bài hát đầu, nếu có thì phát bài đang hát
  const songPlay = listSong.querySelector("[song-id-main].active");
  let songObject;
  let singer;
  if (songPlay) {
    const playSongElement = listSong.querySelector("[song-id-main].active");
    const playSong = playSongElement.querySelector(".box-items__category");
    songObject = playSong.getAttribute("song");
    singer = playSong.getAttribute("singer");
  } else {
    const firstSongElement = listSong.firstElementChild;
    const firstSong = firstSongElement.querySelector(".box-items__category");
    songObject = firstSong.getAttribute("song");
    singer = firstSong.getAttribute("singer");
  }

  songObject = JSON.parse(songObject);
  console.log(songObject);
  console.log(singer);
  handlePlayAudio(event, songObject, singer);
  // const firstSongSinger = firstSong.querySelector(".box-item__category--singer");
  // console.log(firstSong);
  // console.log(firstSongSinger);
};
//nếu có bài hát trong playlist thì lấy ảnh bài hát đầu làm đại diện

// const listPlaylist_Index = document.querySelector(".listmusic .playlist-old");
// const list = document.querySelector(".listmusic");

const listSongPlaylist = document.querySelector(
  ".playlist-detail .playlist-detail__songOfPlaylist--list"
);
if (listSongPlaylist) {
  const firstSongPlaylist = listSongPlaylist.firstElementChild;
  console.log(firstSongPlaylist);
  if (firstSongPlaylist) {
    songImg = firstSongPlaylist.getAttribute("songImg");
    playlistId_detail = firstSongPlaylist.getAttribute("playlistId");
    // console.log(playlistId_detail);
    const imgPlaylist = document.querySelector(
      ".playlist-detail .playlist-detail__image--img img"
    );
    imgPlaylist.src = songImg;

    // // const checkPlaylist_Index = listPlaylist_Index.querySelector(`.playlist-old--title[playlistId = ${playlistId_detail}]`)
    // // console.log(checkPlaylist_Index);
    // const IdPlaylist_Index = listPlaylist_Index.querySelector(`[playlistId="${playlistId_detail}"]`);

    // // const IdPlaylist_Index = listPlaylist_Index.querySelector(`[playlistId = "${playlistId_detail}"]`)
    // const imgPlaylist_Index = IdPlaylist_Index.querySelector("img")
    // imgPlaylist_Index.src= songImg;
  }
}

//Chuyển url
handleUrl = (event, url) => {
  window.location.href = url;
};

//hết chuyển url

// Đổi màu tab đang chọn
const currentPath = window.location.pathname;
const basePath = currentPath.split("/")[1];
// Tìm tên tab tương ứng đang chọn
let hrefString = "/";
if (basePath != "auth") {
  hrefString = basePath == "songs" ? "/topics" : `/${basePath}`;
} else {
  hrefString = currentPath;
}

const tab = document.querySelector(
  `.sider .sider-menu li a[href="${hrefString}"]`
);
if (tab) {
  tab.classList.add("current-tab");
}
// Hết đổi màu tab đang chọn

// Đăng nhập google
const googleBtn = document.querySelector(".login-google");
if (googleBtn) {
  console.log(googleBtn);
  googleBtn.addEventListener("click", (e) => {
    console.log((window.location.href = "/auth/google"));
  });
}
// // Hết đăng nhập google

// //Hết tìm kiếm ở playlist
//nút phát nhạc ở ngoài
playlistClickPlay = () => {

}
//thông báo khác của playlist <chỉnh sửa - xoa>
playlistClickOther = (playlistId) => {
    const clickOtherElement = document.querySelector(`[playlistId = "${playlistId}"]`);
    console.log(`other: ${clickOtherElement.getAttribute("playlistId")}`)
    console.log(clickOtherElement);
    const btnContent = document.querySelector(".playlist__header--icon");
    let modalMessageOther = document.querySelector(".modal-message-other-index");
    if (!modalMessageOther) {
      let modalMessageOther = document.createElement("div");
      modalMessageOther.setAttribute("class", "modal-message-other-index");
      modalMessageOther.innerHTML = `
        <div class="modal-message-other__wrap">
          <button onclick="handleMessageEditPlaylist('${playlistId}')"> <i class="fa-solid fa-pen"></i>  Chỉnh sửa playlist</button>  
          <button onclick="handleRemovePlaylist('${playlistId}')"><i class="fa-solid fa-trash-can"></i> Xóa playlist</button>  
        </div>
      `;
      console.log(modalMessageOther)
      clickOtherElement.appendChild(modalMessageOther);
    } else {
      clickOtherElement.removeChild(modalMessageOther);
    }
}

//hết thông báo khác của playlist <chỉnh sửa - xoa>
//phát nhạc ở index playlist
handleClickPlay = (event, playlist) => {
  // playlist = JSON.parse(playlist);
  console.log(playlist);

  // handlePlayAudio = (event, song, singer);
  //lấy API để hiện ra danh sách bài hát
  
}