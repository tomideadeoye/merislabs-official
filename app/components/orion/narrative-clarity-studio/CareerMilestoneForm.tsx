import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CareerMilestone } from '@/lib/types';
// NOTE: Forcing TypeScript re-evaluation

/**
 * @fileoverview React Hook Form component for adding and editing Career Milestones.
 * @description This component provides a form interface for users to input and manage their
 *   career achievements, including details like title, organization, dates, achievements, and skills.
 *   It leverages `react-hook-form` and `zod` for robust form validation and state management.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a user-friendly form for creating new career milestones.
 *   - Allow editing of existing career milestones with pre-populated data.
 *   - Validate form inputs using Zod schema for data integrity.
 *   - Transform array-based fields (achievements, skills) for form display and submission.
 *
 * FILEPATH: `app/components/orion/narrative-clarity-studio/CareerMilestoneForm.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/narrative-clarity-studio/page.tsx`: This page renders and manages instances of this form.
 *   - `@/lib/types/cv.ts`: Imports the `CareerMilestone` interface for defining the structure of milestone data.
 *   - `react-hook-form`: Core library for form management.
 *   - `@hookform/resolvers/zod`: Integrates Zod for schema-based validation.
 *   - `zod`: Schema definition library for robust type validation.
 *   - `@/components/ui/`: Utilizes Shadcn UI components (Button, Input, Textarea, Label) for consistent styling.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `initialData` (if provided) contains a valid `CareerMilestone` object.
 *   - Automatically sets the `order` for new milestones based on the `existingMilestonesCount`.
 *   - Achievements and skills are handled as newline-separated or comma-separated strings respectively in the form, and converted to arrays for storage.
 *
 * NOTES:
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE:** None immediately apparent; this is a specialized form component.
 *   - **PERFORMANCE OPTIMIZATIONS:** Form re-renders are optimized by `react-hook-form`. Consider debouncing or throttling `onChange` if complex validations are added.
 *   - **ERROR HANDLING ROBUSTNESS:** Zod provides client-side validation errors. Backend validation should also be in place for full robustness.
 *
 * OPPORTUNITIES FOR IMPROVEMENT & COMPREHENSIVE NEXT STEPS:
 *   The "Career Milestones" section in the Narrative Clarity Studio is designed to evolve into a powerful tool
 *   for tracking, analyzing, and gaining insights from your professional journey.
 *
 *   **1. Enriched Data Fields Input:**
 *     - **Goal:** Update the form to allow input for the newly added fields in `CareerMilestone` (`quantifiableResults`, `lessonsLearned`, `challengesFaced`, `keyTakeaways`, `associatedSkills`, `recognitionAwards`, `status`).
 *     - **How to Implement:** Add new `Input` or `Textarea` components for these fields, ensuring they are correctly hooked up to `react-hook-form`'s `Controller` and `zod` schema.
 *       For `associatedSkills` and `recognitionAwards`, consider using a multi-select or tag input component.
 *       For `status`, use a `Select` component with predefined options.
 *   **2. Dynamic Form Generation/Conditional Fields:**
 *     - **Goal:** Make the form more dynamic, showing/hiding fields based on user input or milestone type.
 *     - **How to Implement:** Implement conditional rendering based on form state or a new `milestoneType` field to simplify the UI for different use cases.
 *   **3. AI-Assisted Input:**
 *     - **Goal:** Leverage AI to assist users in populating milestone details.
 *     - **How to Implement:** For fields like `description`, `achievements`, or `impact`, add a small "AI Suggest" button that calls an LLM to expand on a brief input, or quantify achievements based on a qualitative description. This would interact with a new LLM API route.
 *   **4. Integration with other Modules:**
 *     - **Goal:** Connect career milestones to other relevant Orion modules.
 *     - **How to Implement:** Once a milestone is saved, offer options to generate an updated CV summary, feed into a comprehensive career growth dashboard, or trigger new learning path suggestions based on identified skill gaps.
 */

// Define a schema for the form inputs (before transformation)
const CareerMilestoneFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  organization: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  achievements: z.string().optional(), // Form input is string
  skills: z.string().optional(), // Form input is string
  impact: z.string().optional(),
  order: z.number().optional(),
  quantifiableResults: z.string().optional(),
  lessonsLearned: z.string().optional(),
  challengesFaced: z.string().optional(),
  keyTakeaways: z.string().optional(),
  associatedSkills: z.string().optional(), // Form input is string
  recognitionAwards: z.string().optional(), // Form input is string
  status: z.enum(['planned', 'in-progress', 'completed', 'on-hold']).optional(),
});

interface CareerMilestoneFormProps {
  initialData?: CareerMilestone;
  onSubmit: (data: Partial<CareerMilestone>) => void;
  onCancel: () => void;
  existingMilestonesCount: number;
}

export const CareerMilestoneForm: React.FC<CareerMilestoneFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  existingMilestonesCount,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CareerMilestoneFormSchema>>({
    resolver: zodResolver(CareerMilestoneFormSchema),
    defaultValues: {
      title: '',
      description: undefined,
      organization: undefined,
      startDate: undefined,
      endDate: undefined,
      achievements: undefined,
      skills: undefined,
      impact: undefined,
      order: existingMilestonesCount + 1, // Default to next order
      quantifiableResults: undefined,
      lessonsLearned: undefined,
      challengesFaced: undefined,
      keyTakeaways: undefined,
      associatedSkills: undefined,
      recognitionAwards: undefined,
      status: undefined, // Default to undefined for optional enum
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        achievements: initialData.achievements ? initialData.achievements.join('\n') : undefined,
        skills: initialData.skills ? initialData.skills.join(',') : undefined,
        associatedSkills: initialData.associatedSkills ? initialData.associatedSkills.join(',') : undefined,
        recognitionAwards: initialData.recognitionAwards ? initialData.recognitionAwards.join(',') : undefined,
        status: initialData.status || undefined,
      });
    } else {
      reset({
        title: '',
        description: undefined,
        organization: undefined,
        startDate: undefined,
        endDate: undefined,
        achievements: undefined,
        skills: undefined,
        impact: undefined,
        order: existingMilestonesCount + 1,
        quantifiableResults: undefined,
        lessonsLearned: undefined,
        challengesFaced: undefined,
        keyTakeaways: undefined,
        associatedSkills: undefined,
        recognitionAwards: undefined,
        status: undefined,
      });
    }
  }, [initialData, reset, existingMilestonesCount]);

  const onSave = (formData: z.infer<typeof CareerMilestoneFormSchema>) => {
    // Transform achievements and skills back to arrays before submitting
    const transformedData: Partial<CareerMilestone> = {
      ...initialData, // Keep initialData properties like id
      title: formData.title, // Explicitly include title as it's required by schema
      description: formData.description || undefined,
      organization: formData.organization || undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      achievements: formData.achievements
        ? formData.achievements
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      skills: formData.skills
        ? formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      impact: formData.impact || undefined,
      order: initialData?.order !== undefined ? initialData.order : existingMilestonesCount + 1,
      quantifiableResults: formData.quantifiableResults || undefined,
      lessonsLearned: formData.lessonsLearned || undefined,
      challengesFaced: formData.challengesFaced || undefined,
      keyTakeaways: formData.keyTakeaways || undefined,
      associatedSkills: formData.associatedSkills
        ? formData.associatedSkills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      recognitionAwards: formData.recognitionAwards
        ? formData.recognitionAwards
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      status: formData.status || undefined, // Ensure empty string is converted to undefined for optional enum
    };
    onSubmit(transformedData);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">{initialData ? 'Edit Milestone' : 'Add New Milestone'}</h2>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-gray-300">
            Title
          </Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                id="title"
                type="text"
                placeholder="e.g., Led cross-functional team"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                {...field}
              />
            )}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="organization" className="text-gray-300">
            Organization (Optional)
          </Label>
          <Controller
            name="organization"
            control={control}
            render={({ field }) => (
              <Input
                id="organization"
                type="text"
                placeholder="e.g., Google, Merislabs"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                {...field}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-gray-300">
              Start Date (Optional)
            </Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Input
                  id="startDate"
                  type="date"
                  className="bg-gray-700 border-gray-600 text-gray-200"
                  {...field}
                  value={field.value || ''} // Ensure controlled component
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-gray-300">
              End Date (Optional)
            </Label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Input
                  id="endDate"
                  type="date"
                  className="bg-gray-700 border-gray-600 text-gray-200"
                  {...field}
                  value={field.value || ''} // Ensure controlled component
                />
              )}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-300">
            Description (Optional)
          </Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Brief description of your role or the milestone."
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[80px]"
                {...field}
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="achievements" className="text-gray-300">
            Key Achievements (one per line)
          </Label>
          <Controller
            name="achievements"
            control={control}
            render={({ field }) => (
              <Textarea
                id="achievements"
                placeholder="- Achieved X resulting in Y\n- Implemented Z improving efficiency by P%"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[120px]"
                {...field}
                value={field.value || ''}
              />
            )}
          />
          {errors.achievements && <p className="text-red-500 text-sm mt-1">{errors.achievements.message}</p>}
        </div>

        <div>
          <Label htmlFor="skills" className="text-gray-300">
            Relevant Skills (comma-separated, Optional)
          </Label>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <Input
                id="skills"
                type="text"
                placeholder="e.g., Project Management, TypeScript, Agile"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                {...field}
                value={field.value || ''}
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="impact" className="text-gray-300">
            Impact/Outcome (Optional)
          </Label>
          <Controller
            name="impact"
            control={control}
            render={({ field }) => (
              <Textarea
                id="impact"
                placeholder="Summarize the impact of this milestone."
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[80px]"
                {...field}
              />
            )}
          />
        </div>

        {/* New fields for future enrichment */}
        <div>
          <Label htmlFor="quantifiableResults" className="text-gray-300">
            Quantifiable Results (Optional)
          </Label>
          <Controller
            name="quantifiableResults"
            control={control}
            render={({ field }) => (
              <Textarea
                id="quantifiableResults"
                placeholder="e.g., Increased revenue by 15%, Reduced costs by $5k/month"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[80px]"
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="lessonsLearned" className="text-gray-300">
            Lessons Learned (Optional)
          </Label>
          <Controller
            name="lessonsLearned"
            control={control}
            render={({ field }) => (
              <Textarea
                id="lessonsLearned"
                placeholder="Key insights gained from this experience."
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[80px]"
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="challengesFaced" className="text-gray-300">
            Challenges Faced (Optional)
          </Label>
          <Controller
            name="challengesFaced"
            control={control}
            render={({ field }) => (
              <Textarea
                id="challengesFaced"
                placeholder="Obstacles encountered and how they were overcome."
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[80px]"
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="keyTakeaways" className="text-gray-300">
            Key Takeaways (Optional)
          </Label>
          <Controller
            name="keyTakeaways"
            control={control}
            render={({ field }) => (
              <Textarea
                id="keyTakeaways"
                placeholder="Broader insights or conclusions from this milestone."
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[80px]"
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="associatedSkills" className="text-gray-300">
            Associated Skills (Comma-separated, Optional)
          </Label>
          <Controller
            name="associatedSkills"
            control={control}
            render={({ field }) => (
              <Input
                id="associatedSkills"
                type="text"
                placeholder="e.g., Leadership, Project Management, Data Analysis"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                {...field}
                value={field.value || ''}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="recognitionAwards" className="text-gray-300">
            Recognition & Awards (Comma-separated, Optional)
          </Label>
          <Controller
            name="recognitionAwards"
            control={control}
            render={({ field }) => (
              <Input
                id="recognitionAwards"
                type="text"
                placeholder="e.g., Employee of the Month, Dean's List"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                {...field}
                value={field.value || ''}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="status" className="text-gray-300">
            Status (Optional)
          </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                id="status"
                className="bg-gray-700 border-gray-600 text-gray-200 rounded-md p-2 w-full"
                {...field}
                value={field.value || ''}
              >
                <option value="">Select Status</option>
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button type="submit">{initialData ? 'Save Changes' : 'Add Milestone'}</Button>
        </div>
      </form>
    </div>
  );
};
