// Cloudinary-гийн "unsigned upload preset" ашиглан зургийг
// браузераас шууд Cloudinary рүү байршуулдаг туслах функц.
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary тохиргоо дутуу байна. .env.local файлд " +
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME болон " +
        "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET нэмнэ үү.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    throw new Error("Зураг байршуулахад алдаа гарлаа. Дахин оролдоно уу.");
  }

  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    typeof (data as { secure_url?: unknown }).secure_url !== "string"
  ) {
    throw new Error("Cloudinary-ийн хариу буруу байна.");
  }

  return (data as { secure_url: string }).secure_url;
}
