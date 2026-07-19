const maxImageSize = 1600;

function readFile(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("La photo n’a pas pu être lue."));
    reader.readAsDataURL(file);
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Cette photo ne peut pas être convertie.")); };
    image.src = url;
  });
}

export async function prepareVehiclePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choisis une image depuis ta galerie.");
  if (file.size > 15 * 1024 * 1024) throw new Error("La photo est trop lourde. Choisis une image de moins de 15 Mo.");

  const image = await loadImage(file);
  const scale = Math.min(1, maxImageSize / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("La photo ne peut pas être préparée sur cet appareil.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const compressed = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!compressed) throw new Error("La photo n’a pas pu être compressée.");
  return readFile(compressed);
}
