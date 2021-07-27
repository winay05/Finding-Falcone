const validateResponse = (res, errored) => {
  if (errored || !res) {
    // console.log("couldnt connect to backend");
    return false;
  }
  return true;
};

const makeGetRequest = async (url, ob) => {
  let res, errored;
  errored = false;

  try {
    res = await (await fetch(url)).json();
    // console.log(res);
  } catch (err) {
    errored = false;
  } finally {
    if (validateResponse(res, errored)) return res;
    alert(`failed to get ${ob}`);
    return null;
  }
};
const makePostRequest = async (url, body, ob) => {
  let errored, res;
  errored = false;

  try {
    res = await (
      await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    ).json();
  } catch (err) {
    // console.log(err);
    errored = true;
  } finally {
    if (validateResponse(res, errored)) return res;
    alert(`failed to get ${ob}`);
    return null;
  }
};

export { makeGetRequest, makePostRequest };
