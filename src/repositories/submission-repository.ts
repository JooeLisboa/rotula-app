import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { getFirebaseDb, uploadStorageFile } from '@/src/lib/firebase/client';

export interface SubmitProductContributionInput {
  uid: string;
  barcode: string;
  nutritionImageUri: string;
  ingredientsImageUri: string;
  frontImageUri?: string;
  onProgress?: (progress: number) => void;
}

async function fileUriToBlob(uri: string) {
  const response = await fetch(uri);
  return response.blob();
}

export const submissionRepository = {
  async submitProductContribution(input: SubmitProductContributionInput) {
    const submissionRef = doc(getFirebaseDb(), 'product_submissions', `${input.uid}_${input.barcode}_${Date.now()}`);

    input.onProgress?.(0.1);
    const nutritionImageUrl = await uploadStorageFile(
      `product_submissions/${input.uid}/${submissionRef.id}/nutrition.jpg`,
      await fileUriToBlob(input.nutritionImageUri)
    );

    input.onProgress?.(0.45);
    const ingredientsImageUrl = await uploadStorageFile(
      `product_submissions/${input.uid}/${submissionRef.id}/ingredients.jpg`,
      await fileUriToBlob(input.ingredientsImageUri)
    );

    let frontImageUrl: string | null = null;
    if (input.frontImageUri) {
      input.onProgress?.(0.75);
      frontImageUrl = await uploadStorageFile(
        `product_submissions/${input.uid}/${submissionRef.id}/front.jpg`,
        await fileUriToBlob(input.frontImageUri)
      );
    }

    await setDoc(submissionRef, {
      barcode: input.barcode,
      userId: input.uid,
      nutritionImageUrl,
      ingredientsImageUrl,
      frontImageUrl,
      status: 'pending',
      source: 'user-contribution',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    input.onProgress?.(1);

    return {
      id: submissionRef.id,
      nutritionImageUrl,
      ingredientsImageUrl,
      frontImageUrl: frontImageUrl ?? undefined,
    };
  },
};
