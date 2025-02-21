const inputField = document.getElementById("input-temp");
const fromUnitField = document.getElementById("input-unit");
const toUnitField = document.getElementById("output-unit");
const outputField = document.getElementById("output-temp");
const form = document.getElementById("converter");
const previousSearches = document.getElementById("previousSearches");

const TABLE_CONVERSIONS = "conversions";

console.log("JS loaded");

const broadcast = new BroadcastChannel("channel-123");
broadcast.onmessage = (event) => {
  if (event.data && event.data.type === "MSG_ID") {
    console.log(`JS:`, event.data);
  }
};

let db;
let conversionsObjectStore;
const request = indexedDB.open("MyTestDatabase");
request.onerror = (event) => {
  console.error(`Database error: ${event.target.error?.message}`);
};

request.onupgradeneeded = (event) => {
  // Save the IDBDatabase interface
  const db = event.target.result;

  // Create an objectStore for this database
  conversionsObjectStore = db.createObjectStore(TABLE_CONVERSIONS, {
    autoIncrement: true,
  });
};

request.onsuccess = (event) => {
  db = event.target.result;
  refreshPreviousSearches();
};

function convertTemp(value, fromUnit, toUnit) {
  if (fromUnit === "c") {
    if (toUnit === "f") {
      return (value * 9) / 5 + 32;
    } else if (toUnit === "k") {
      return value + 273.15;
    }
    return value;
  }
  if (fromUnit === "f") {
    if (toUnit === "c") {
      return ((value - 32) * 5) / 9;
    } else if (toUnit === "k") {
      return ((value + 459.67) * 5) / 9;
    }
    return value;
  }
  if (fromUnit === "k") {
    if (toUnit === "c") {
      return value - 273.15;
    } else if (toUnit === "f") {
      return (value * 9) / 5 - 459.67;
    }
    return value;
  }
  throw new Error("Invalid unit");
}

form.addEventListener("input", () => {
  const inputTemp = parseFloat(inputField.value);
  const fromUnit = fromUnitField.value;
  const toUnit = toUnitField.value;

  const outputTemp = convertTemp(inputTemp, fromUnit, toUnit);
  outputField.value =
    Math.round(outputTemp * 100) / 100 + " " + toUnit.toUpperCase();
  saveToDB(
    `${inputTemp}${fromUnit} converted to ${outputField.value}${toUnit}.`
  );
});

const saveToDB = (conversion) => {
  const transaction = db.transaction([TABLE_CONVERSIONS], "readwrite");

  transaction.oncomplete = (event) => {
    console.log("All done!");
    refreshPreviousSearches();
  };

  transaction.onerror = (event) => {
    // Don't forget to handle errors!
  };

  const objectStore = transaction.objectStore(TABLE_CONVERSIONS);
  const request = objectStore.add(conversion);
  request.onsuccess = (event) => {
    console.log(`Conversion '${conversion}' added to the DB.`);
  };
};

const refreshPreviousSearches = () => {
  while (previousSearches.firstChild) {
    previousSearches.removeChild(previousSearches.firstChild);
  }

  const transaction = db.transaction([TABLE_CONVERSIONS], "readonly");

  transaction.oncomplete = (event) => {
    console.log("Read All done!");
  };

  transaction.onerror = (event) => {
    console.log("Read fail!");
  };

  const objectStore = transaction.objectStore(TABLE_CONVERSIONS);
  const request = objectStore.getAll();
  request.onsuccess = (event) => {
    const all = event.target.result;
    const last10 = all.reverse().splice(0, 10);
    last10.forEach((element, index) => {
      const divConversion = document.createElement("div");
      divConversion.innerHTML = `${index + 1}. ${element}`;
      previousSearches.appendChild(divConversion);
    });
  };
};

const onButtonClick = () => {
  console.log("JS: onButtonClick");
  broadcast.postMessage({ type: "MSG_ID", data: "button clicked" });
};
const sendCommand = (command) => {
  broadcast.postMessage({ type: "MSG_EXTENSION", data: {
    extFunc: command,
    params: { a: 1 }
  } });
};

const onDownloadClick = () => {
  console.log("JS: onDownloadClick");
  fetch("http://localhost:22223/todos/1")
    .then((response) => response.json())
    .then((data) => {
      console.log("fetch success", data);
    })
    .catch((error) => {
      console.log("fetch error", error);
    });
};

function ResponseBuilder() {
  return {
    getResult() {
      return buildResponse({ id: 2, ime: "dada" });
    },
  };
}

function buildResponse(data) {
  return (
    JSON.stringify(data), { headers: { "Content-Type": "application/json" } }
  );
}

const responseBuilder3 = new ResponseBuilder();
const getResponse3 = () => {
  return responseBuilder3.getResult();
};
