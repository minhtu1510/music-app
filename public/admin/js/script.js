//Preview ảnh
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
//Hết preview ảnh

// Nghe thử
const uploadAudio = document.querySelector("[upload-audio]");
if(uploadAudio) {
  const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
  const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
  const uploadAudioSource = uploadAudio.querySelector("source");
  uploadAudioInput.addEventListener("change", () => {
    const file = uploadAudioInput.files[0];
    if(file) {
      uploadAudioSource.src = URL.createObjectURL(file);
      uploadAudioPlay.load();
    }
  });
}
// Hết Nghe thử

// Bộ lọc
const boxFilter = document.querySelector("[box-filter]");
if(boxFilter) {
  let url = new URL(location.href); // Nhân bản url
  // Bắt sự kiện onChange
  boxFilter.addEventListener("change", () => {
    const value = boxFilter.value;
    
    if(value) {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }
    location.href = url.href;
  })
  // Hiển thị lựa chọn mặc định
  const statusCurrent = url.searchParams.get("status");
  if(statusCurrent) {
    boxFilter.value = statusCurrent;
  }
}
// Hết Bộ lọc

// Tìm kiếm
const formSearch = document.querySelector("[form-search]");
if(formSearch) {
  let url = new URL(location.href); // Nhân bản url
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định: submit form
    const value = formSearch.keyword.value;
    if(url.searchParams.get("page")){
      url.searchParams.delete("page")
    }
    if(value) {
      url.searchParams.set("keyword", value);
    } else {
      url.searchParams.delete("keyword");
    }
    location.href = url.href;
  });
  // Hiển thị từ khóa mặc định
  const valueCurrent = url.searchParams.get("keyword");
  if(valueCurrent) {
    formSearch.keyword.value = valueCurrent;
  }
}
// Hết Tìm kiếm

// Phân trang
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if(listButtonPagination.length > 0) {
  let url = new URL(location.href); // Nhân bản url
  listButtonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      if(page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
  
      location.href = url.href;
    })
  })
  // Hiển thị trang mặc định
  const pageCurrent = url.searchParams.get("page") || 1;
  const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`);
  if(buttonCurrent) {
    buttonCurrent.parentNode.classList.add("active");
  }
}
// Hết Phân trang

// Đổi trạng thái
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if(listButtonChangeStatus.length > 0) {
  listButtonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("item-id");
      const statusChange = button.getAttribute("button-change-status");
      const path = button.getAttribute("data-path");
      const data = {
        id: itemId,
        status: statusChange
      };
      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "success") {
            location.reload();
          }
        })
    })
  })
}
// Hết Đổi trạng thái

// Đổi trạng thái nhiều bản ghi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
      event.preventDefault()
      const statusChange = formChangeMulti.status.value
      const path = formChangeMulti.getAttribute("data-path");
      const ids = []
      const listInputChangeChecked = document.querySelectorAll("[input-change]:checked")
      listInputChangeChecked.forEach(input=>{
        const id = input.getAttribute("input-change")
        ids.push(id)
      })
      const data = {
        ids: ids,
        status: statusChange
      };
      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "success") {
            location.reload();
          }
        })
    })
  
}
// Hết Đổi trạng thái nhiều bản ghi

// Xóa bản ghi vĩnh viễn
const listButtonDeleteRubbish = document.querySelectorAll("[button-delete-rubbish]");
if(listButtonDeleteRubbish.length > 0) {
  listButtonDeleteRubbish.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");
      if(isConfirm) {
        const id = button.getAttribute("item-id");
        const path = button.getAttribute("data-path");
  
        fetch(path, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
          body: JSON.stringify({
            id: id
          })
        })
          .then(res => res.json())
          .then(data => {
            if(data.code == "success") {
              location.reload();
            }
          })
      }
    })
  })
}
// Hết Xóa bản ghi vĩnh viễn

// Xóa bản ghi tạm
const listButtonDelete = document.querySelectorAll("[button-delete]");
if(listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");
      if(isConfirm) {
        const id = button.getAttribute("item-id");
        const path = button.getAttribute("data-path");
  
        fetch(path, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({
            id: id
          })
        })
          .then(res => res.json())
          .then(data => {
            if(data.code == "success") {
              location.reload();
            }
          })
      }
    })
  })
}
// Hết Xóa bản ghi tạm

// alert-message
const alertMessage = document.querySelector("[alert-message]");
if(alertMessage) {
  setTimeout(() => {
    alertMessage.style.display = "none";
  }, 3000);
}
// End alert-message

// Phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const dataFinal = [];
    const listElementRoleId = document.querySelectorAll("[role-id]");
    listElementRoleId.forEach(elementRoleId => {
      const roleId = elementRoleId.getAttribute("role-id");
      const permissions = [];
      const listInputChecked = document.querySelectorAll(`input[data-id="${roleId}"]:checked`);
      listInputChecked.forEach(input => {
        const tr = input.closest(`tr[data-name]`);
        const name = tr.getAttribute("data-name");
        permissions.push(name);
      })
      dataFinal.push({
        id: roleId,
        permissions: permissions
      });
    })
    const path = buttonSubmit.getAttribute("data-path");
    fetch(path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(dataFinal)
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          location.reload();
        }
      })
  })
  // Hiển thị mặc định
  let dataPermissions = tablePermissions.getAttribute("table-permissions");
  dataPermissions = JSON.parse(dataPermissions);
  dataPermissions.forEach(item => {
    item.permissions.forEach(permission => {
      const input = document.querySelector(`tr[data-name="${permission}"] input[data-id="${item._id}"]`);
      input.checked = true;
    })
  });
}
// Hết Phân quyền

// Đổi loại tài khoản
const listButtonChangeType = document.querySelectorAll("[button-change-type]");
if(listButtonChangeType.length > 0) {
  listButtonChangeType.forEach(button => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("item-id");
      const typeChange = button.getAttribute("button-change-type");
      const path = button.getAttribute("data-path");
      const data = {
        id: itemId,
        type_user: typeChange
      };
      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "success") {
            location.reload();
          }
        })
    })
  })
}
// Hết Đổi loại tài khoản

// Đổi loại bài hát
const listButtonChangeTypeSong = document.querySelectorAll("[button-change-type-song]");
if(listButtonChangeTypeSong.length > 0) {
  listButtonChangeTypeSong.forEach(button => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("item-id");
      const typeChange = button.getAttribute("button-change-type-song");
      const path = button.getAttribute("data-path");
      const data = {
        id: itemId,
        type_song: typeChange
      };
      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "success") {
            location.reload();
          }
        })
    })
  })
}
// Hết Đổi loại bài hát