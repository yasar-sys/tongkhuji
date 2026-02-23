import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type TeaStallRow = Tables<'tea_stalls'>;

export const useTeaStalls = (division?: string) => {
  return useQuery({
    queryKey: ['tea-stalls', division],
    queryFn: async () => {
      let query = supabase
        .from('tea_stalls')
        .select(`
          *,
          stall_images (
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (division && division !== 'all') {
        query = query.eq('division', division);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(stall => ({
        ...stall,
        image_url: stall.stall_images?.[0]?.image_url || ''
      })) as any[];
    },
  });
};

export const useInsertStall = () => {
  const insert = async (stall: Omit<Tables<'tea_stalls'>, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: string }) => {
    const { data, error } = await supabase
      .from('tea_stalls')
      .insert(stall)
      .select()
      .single();
    if (error) throw error;
    return data;
  };
  return { insert };
};
