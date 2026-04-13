export interface UploadAvatarInput {
  uid: string;
  fileName: string;
  data: Blob | Uint8Array | ArrayBuffer;
}

export interface UploadProductImageInput {
  barcode: string;
  fileName: string;
  data: Blob | Uint8Array | ArrayBuffer;
}
