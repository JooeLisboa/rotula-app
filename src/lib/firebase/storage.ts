import { uploadStorageFile } from '@/src/lib/firebase/client';
import type { UploadAvatarInput, UploadProductImageInput } from '@/src/types/storage';

export function uploadUserAvatar(input: UploadAvatarInput) {
  return uploadStorageFile(`user_avatars/${input.uid}/${input.fileName}`, input.data);
}

export function uploadProductImage(input: UploadProductImageInput) {
  return uploadStorageFile(`product_images/${input.barcode}/${input.fileName}`, input.data);
}
