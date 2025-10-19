/**
 * Event Mutation Hooks
 *
 * React Query mutation hooks for creating, updating, and deleting events.
 * Implements optimistic updates and automatic cache invalidation.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateEventInput {
  name: string;
  slug: string;
  event_type: string;
  description?: string;
  start_at: string;
  end_at: string;
  capacity?: number;
}

interface UpdateEventInput {
  id: string;
  updates: Partial<CreateEventInput>;
}

/**
 * Create a new event
 *
 * @example
 * const createEvent = useCreateEvent();
 * createEvent.mutate({ name: 'My Event', ... });
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: CreateEventInput) => {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create event', {
        description: error.message,
      });
    },
  });
}

/**
 * Update an existing event
 *
 * @example
 * const updateEvent = useUpdateEvent();
 * updateEvent.mutate({ id: '123', updates: { name: 'New Name' } });
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateEventInput) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['event', id] });

      // Snapshot previous value
      const previousEvent = queryClient.getQueryData(['event', id]);

      // Optimistically update cache
      queryClient.setQueryData(['event', id], (old: any) => ({
        ...old,
        ...updates,
      }));

      return { previousEvent };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousEvent) {
        queryClient.setQueryData(['event', id], context.previousEvent);
      }
      toast.error('Failed to update event', {
        description: err.message,
      });
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onSuccess: () => {
      toast.success('Event updated successfully');
    },
  });
}

/**
 * Delete an event
 *
 * @example
 * const deleteEvent = useDeleteEvent();
 * deleteEvent.mutate('event-id');
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete event', {
        description: error.message,
      });
    },
  });
}
