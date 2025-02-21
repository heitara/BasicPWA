import { ResponseBuilder } from "./CustomClass.js";

const CACHE_NAME = `temperature-converter-v1`;

const STATIC_EXTENSION_ID = 'eifdgggpmlienaomdighcmmfojmledjk';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const callExtensionAPI = (method) => {
  console.log(`Call extension method:`, method);
  chrome.runtime.sendMessage(STATIC_EXTENSION_ID, {
    methodName: method,
  });
};
// callExtensionAPI('callRestart'); // call a function 

const MESSAGE_TYPE_EXTENSION = "MSG_EXTENSION";


const broadcast = new BroadcastChannel("channel-123");
broadcast.onmessage = (event) => {
  if (event.data && event.data.type === "MSG_ID") {
    console.log(`SW:`, event.data);
  }
  if (event.data && event.data.type === MESSAGE_TYPE_EXTENSION) {
    console.log(`Extension:`, event.data);
    let extensionFunctionName = event.data.data.extFunc;
    if (extensionFunctionName !== undefined) {
      console.log(`Invoke ext. function:`, extensionFunctionName);
      callExtensionAPI(extensionFunctionName);
    }
  }

  // broadcast.postMessage({ type: "MSG_ID", data: "pong" });
};

// Use the install event to pre-cache all initial resources.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(["/", "/converter.js", "/converter.css"]);
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log(`Fetch:`, event);
      if (event.request.url == "http://localhost:22223/todos/1") {
        const responseBuilder = new ResponseBuilder();
        return new Response(responseBuilder.getResult());
      }

      // Get the resource from the cache.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          // The network failed.
        }
      }
    })()
  );
});
