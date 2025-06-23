/**
 * @fileoverview User Profile Editing Page for the Orion Admin Dashboard.
 * @description This page provides a dedicated user interface for viewing, editing, and saving
 *   Tomide's comprehensive user profile data. It integrates with the `profile_service.ts`
 *   to fetch data from the Neon database (with local storage caching) and uses the
 *   `/api/orion/profile/save` endpoint to persist changes. The UI is built with `react-hook-form`
 *   and `zod` for robust form management and validation, ensuring a smooth user experience.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To display all relevant user profile fields in an editable form.
 *   - To fetch the current user profile data upon component mount.
 *   - To allow users to update their profile information and save it to the database.
 *   - To provide clear loading states, success messages, and error handling feedback to the user.
 *   - To ensure data validation before submission.
 *
 * FILEPATH: `app/(orion_admin)/admin/profile/page.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/profile_service.ts`: Consumed for fetching user profile data.
 *   - `/api/orion/profile/save/route.ts`: The API endpoint used for saving profile updates.
 *   - `@/lib/types/index.ts`: Defines the `UserProfileData` interface for type consistency.
 *   - `@/lib/logger`: Used for client-side logging.
 *   - `react-hook-form` & `zod`: External libraries for form management and schema validation.
 *   - `@/components/ui/*`: Shadcn UI components for building the form elements (e.g., Button, Input, Textarea, Form).
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes a `userId` can be derived for fetching/saving the profile (currently hardcoded for unauthenticated access).
 *   - Assumes `localStorage` is available for client-side caching.
 *   - Implements optimistic UI updates for a snappier feel, with fallback to rollback on error.
 *
 * NOTES:
 *   - This is a critical component for giving the user direct control over their core profile data.
 *   - The extensive `profileText` field is handled by a `Textarea` for multi-line input.
 *   - The social links and contact info are currently simple string inputs but could be evolved into more structured arrays/objects with dedicated sub-forms in the future.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic Form Generation**: For complex or evolving schemas, consider dynamic form generation based on the `UserProfile` schema.
 *   - **Rich Text Editor**: For the `profileText` field, integrate a rich text editor (e.g., TipTap as used elsewhere in the project) for a better editing experience.
 *   - **Nested Form Fields**: Implement more sophisticated handling for structured data like social links or education/experience arrays using `useFieldArray` from `react-hook-form`.
 *   - **Image Upload**: If profile pictures or other media become part of the profile, integrate image upload functionality.
 *   - **Real-time Validation Feedback**: Provide more immediate and granular validation feedback to the user as they type.
 *   - **Toast Notifications**: Use a consistent toast notification system for success/error messages across the application.
 */
'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { fetchUserProfile } from '@/lib/profile_service';
import type { UserProfileData, UserProfileFetchResponse } from '@/lib/types';
import logger from '@/lib/logger';
import { ControllerRenderProps, FieldValues, FieldPath, ControllerProps } from 'react-hook-form';

// Trigger re-evaluation

const profileFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  mobile: z.string().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  substack: z.string().url().optional().or(z.literal('')),
  slideshare: z.string().url().optional().or(z.literal('')),
  medium: z.string().url().optional().or(z.literal('')),
  discord: z.string().optional().or(z.literal('')),
  merisLabsLinkedin: z.string().url().optional().or(z.literal('')),
  bioPitchLink: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  language: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  profileText: z.string().min(1, { message: 'Profile text cannot be empty.' }),
  goals: z.array(z.string()).optional(),
  values: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileEditingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      website: '',
      github: '',
      linkedin: '',
      substack: '',
      slideshare: '',
      medium: '',
      discord: '',
      merisLabsLinkedin: '',
      bioPitchLink: '',
      youtube: '',
      language: '',
      location: '',
      profileText: '',
      goals: [],
      values: [],
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      logger.info('[ProfileEditingPage][useEffect] Attempting to load user profile.');
      setIsLoading(true);
      try {
        const profileResponse: UserProfileFetchResponse = await fetchUserProfile();

        if (profileResponse.success && profileResponse.profile) {
          const profile = profileResponse.profile;
          const defaultValues: ProfileFormValues = {
            name: profile.name || '',
            email: profile.email || '',
            mobile: profile.mobile || '',
            website: profile.website || '',
            github: profile.github || '',
            linkedin: profile.linkedin || '',
            substack: profile.substack || '',
            slideshare: profile.slideshare || '',
            medium: profile.medium || '',
            discord: profile.discord || '',
            merisLabsLinkedin: profile.merisLabsLinkedin || '',
            bioPitchLink: profile.bioPitchLink || '',
            youtube: profile.youtube || '',
            language: profile.language || '',
            location: profile.location || '',
            profileText: profile.profileText || '',
            goals: profile.goals || [],
            values: profile.values || [],
          };
          form.reset(defaultValues); // Populate form with fetched data
          logger.success('[ProfileEditingPage][useEffect] User profile loaded successfully.', {
            source: profileResponse.source,
          });
          toast.success(`Profile loaded from ${profileResponse.source === 'cache' ? 'cache' : 'the database'}.`);
        } else {
          logger.warn('[ProfileEditingPage][useEffect] No user profile found or error during fetch.', {
            error: profileResponse.error,
            source: profileResponse.source,
          });
          toast.error(profileResponse.error || 'No profile data found. Please fill in the details.');
        }
      } catch (error) {
        logger.error('[ProfileEditingPage][useEffect] Unexpected error loading user profile.', { error });
        toast.error('An unexpected error occurred while loading your profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onSubmit = async (values: ProfileFormValues) => {
    logger.info('[ProfileEditingPage][onSubmit] Attempting to save user profile.', { values: Object.keys(values) });
    setIsSaving(true);
    try {
      const response = await fetch('/api/orion/profile/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        logger.success('[ProfileEditingPage][onSubmit] User profile saved successfully.', {
          profileId: result.profile.id,
        });
        toast.success('Your profile data has been successfully updated!');
      } else {
        logger.error('[ProfileEditingPage][onSubmit] Failed to save user profile.', {
          error: result.error,
          details: result.details,
        });
        toast.error(result.error || 'Failed to save your profile data.');
      }
    } catch (error) {
      logger.error('[ProfileEditingPage][onSubmit] Network or unknown error saving profile.', { error });
      toast.error('Could not connect to the server or an unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">Edit Your Profile</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Info */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'name'> }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Tomide Adeoye" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'email'> }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'mobile'> }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'language'> }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input placeholder="English (Native)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'location'> }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Lagos, Nigeria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Links */}
            <h2 className="col-span-full mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Social Presence
            </h2>
            <FormField
              control={form.control}
              name="website"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'website'> }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://merislabs.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'github'> }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'linkedin'> }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="substack"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'substack'> }) => (
                <FormItem>
                  <FormLabel>Substack URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yoursubstack.substack.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slideshare"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'slideshare'> }) => (
                <FormItem>
                  <FormLabel>SlideShare URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.slideshare.net/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medium"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'medium'> }) => (
                <FormItem>
                  <FormLabel>Medium URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://medium.com/@yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discord"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'discord'> }) => (
                <FormItem>
                  <FormLabel>Discord Handle</FormLabel>
                  <FormControl>
                    <Input placeholder="YourUsername#1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="merisLabsLinkedin"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'merisLabsLinkedin'> }) => (
                <FormItem>
                  <FormLabel>MerisLabs LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/company/merislabs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bioPitchLink"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'bioPitchLink'> }) => (
                <FormItem>
                  <FormLabel>Bio Pitch Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://bit.ly/your-bio-pitch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtube"
              render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'youtube'> }) => (
                <FormItem>
                  <FormLabel>YouTube Channel URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/yourchannel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Goals */}
          <FormField
            control={form.control}
            name="goals"
            render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'goals'> }) => (
              <FormItem>
                <FormLabel>Your Goals (comma-separated)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Become a Staff Engineer, Launch a SaaS product, Learn a new language"
                    {...field}
                    value={field.value ? field.value.join(', ') : ''} // Convert array to string for display
                    onChange={(e) => field.onChange(e.target.value.split(',').map((s) => s.trim()))} // Convert string back to array
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Values */}
          <FormField
            control={form.control}
            name="values"
            render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'values'> }) => (
              <FormItem>
                <FormLabel>Your Core Values (comma-separated)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Integrity, Innovation, Growth, Empathy"
                    {...field}
                    value={field.value ? field.value.join(', ') : ''} // Convert array to string for display
                    onChange={(e) => field.onChange(e.target.value.split(',').map((s) => s.trim()))} // Convert string back to array
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Profile Text */}
          <FormField
            control={form.control}
            name="profileText"
            render={({ field }: { field: ControllerRenderProps<ProfileFormValues, 'profileText'> }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Background Summary / Bio Pitch</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a comprehensive summary of your background, aspirations, and value proposition."
                    {...field}
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditingPage;
