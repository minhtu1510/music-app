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
