import { submissionRepository, type SubmitProductContributionInput } from '@/src/repositories/submission-repository';

export const submissionService = {
  submitProductContribution(input: SubmitProductContributionInput) {
    return submissionRepository.submitProductContribution(input);
  },
};
