import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CareerMilestone } from '@/lib/types';

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
      description: '',
      organization: '',
      startDate: '',
      endDate: '',
      achievements: '',
      skills: '',
      impact: '',
      order: existingMilestonesCount + 1, // Default to next order
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        achievements: initialData.achievements ? initialData.achievements.join('\n') : '',
        skills: initialData.skills ? initialData.skills.join(',') : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        organization: '',
        startDate: '',
        endDate: '',
        achievements: '',
        skills: '',
        impact: '',
        order: existingMilestonesCount + 1,
      });
    }
  }, [initialData, reset, existingMilestonesCount]);

  const onSave = (formData: z.infer<typeof CareerMilestoneFormSchema>) => {
    // Transform achievements and skills back to arrays before submitting
    const transformedData: Partial<CareerMilestone> = {
      ...initialData, // Keep initialData properties like id
      ...formData,
      achievements: formData.achievements
        ? formData.achievements
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      skills: formData.skills
        ? formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      // Ensure order is preserved if editing, or set for new
      order: initialData?.order !== undefined ? initialData.order : existingMilestonesCount + 1,
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

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? 'Save Changes' : 'Add Milestone'}</Button>
        </div>
      </form>
    </div>
  );
};
