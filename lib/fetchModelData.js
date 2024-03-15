var Promise = require("promise");

/**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  *
*/

export function fetchModel(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

  
    xhr.open('GET', url, true);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({ data: response });
        } catch (error) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            status: xhr.status,
            statusText: 'Error parsing response as JSON',
          });
        }
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      }
    };

    xhr.onerror = () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    };

    xhr.send();
    /*
      console.log(url);
      setTimeout(() => reject({status: 501, statusText: "Not Implemented"}),0);
      // On Success return:
      // resolve({data: getResponseObject}); */
  });
}

export default fetchModel;

//Branch testing