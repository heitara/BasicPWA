export function ResponseBuilder() {
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
