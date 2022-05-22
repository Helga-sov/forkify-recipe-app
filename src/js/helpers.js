import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';
//make this function here a little bit more robust and more real world by adding some time out. So basically setting a time after which we make the request fail. And so this is important in order to prevent for really bad internet connections where then this fetch here could be running forever.
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // if the fetch function is unsuccessful, then we get a nice message from API which we can use when throwing a new error
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    //console.log(err);
    //get this error message inside of the model
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     // if the fetch function is unsuccessful, then we get a nice message from API which we can use when throwing a new error
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} ${res.status}`);
//     return data;
//   } catch (err) {
//     //console.log(err);
//     //get this error message inside of the model
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     // if the fetch function is unsuccessful, then we get a nice message from API which we can use when throwing a new error
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} ${res.status}`);
//     return data;
//   } catch (err) {
//     //console.log(err);
//     //get this error message inside of the model
//     throw err;
//   }
// };
