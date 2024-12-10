/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const reviewHandler = async (tour, user, review, rating, slug) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        tour,
        user,
        review,
        rating
      }
    });

    if (res.status === 201) {
      showAlert('success', 'Review added successfully');
      window.setTimeout(() => {
        location.assign(`/tour/${slug}`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
