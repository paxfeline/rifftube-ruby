
export const executeScriptElements = (containerElement) =>
{
  //debugger;
  
  console.log("reworking scripts");

  const scriptElements = containerElement.querySelectorAll("script");

  Array.from(scriptElements).forEach((scriptElement) => {
    const clonedElement = document.createElement("script");

    Array.from(scriptElement.attributes).forEach((attribute) => {
      clonedElement.setAttribute(attribute.name, attribute.value);
    });
    
    clonedElement.text = scriptElement.text;

    console.log("rework: ", clonedElement);

    scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
  });
}