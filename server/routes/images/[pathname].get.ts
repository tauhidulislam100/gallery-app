import { z } from "zod";
import {
  PhotonImage,
  SamplingFilter,
  resize,
  initAsync,
} from "@cf-wasm/photon/others";
// @ts-ignore
import photonWasmModule from "@cf-wasm/photon/photon.wasm?module";

export default eventHandler(async (event) => {
  const { pathname } = await getValidatedRouterParams(
    event,
    z.object({
      pathname: z.string().min(1),
    }).parse
  );
  const query = getQuery(event);

  await initAsync(photonWasmModule);
  const img = await hubBlob().get(pathname);
  if (!img) {
    throw new Error("Image not found");
  }

  if (query?.w) {
    const width = Number(query?.w);
    const inputBytes = new Uint8Array(await img.arrayBuffer()); // Convert Blob to Uint8Array
    const inputImage = PhotonImage.new_from_byteslice(inputBytes);

    const originalWidth = inputImage.get_width();
    const originalHeight = inputImage.get_height();

    const scaleFactor = width / originalWidth;
    const newHeight = Math.round(originalHeight * scaleFactor);

    const outputImage = resize(
      inputImage,
      width,
      newHeight,
      SamplingFilter.Lanczos3
    );
    const resizedBytes = outputImage.get_bytes();

    // Create a Blob with the correct format (preserve original format)
    const resizedBlob = new Blob([resizedBytes], {
      type: img.type || "image/png",
    });

    return new Response(resizedBlob, {
      headers: {
        "Content-Type": resizedBlob.type,
      },
    });
  }

  return hubBlob().serve(event, pathname);
});
