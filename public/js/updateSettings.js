/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export function previewPhoto(event) {
  const fileInput = event.target; // The file input element
  const photoPreview = document.getElementById('userPhoto'); // The image element to preview the photo

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader(); // Create a FileReader object to read the file

    reader.onload = function(e) {
      photoPreview.src = e.target.result; // Set the image src to the base64 URL of the selected file
    };

    reader.readAsDataURL(fileInput.files[0]); // Read the file as a data URL
  }
}
