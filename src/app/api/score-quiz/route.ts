import { NextRequest, NextResponse } from 'next/server';
import { scoreQuiz } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { nodeId, answers, questions, userId, isGuest } = await req.json();

    if (!nodeId || !answers || !questions) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // 1. Get Node details
    const { data: node, error: nodeError } = await supabase
      .from('nodes')
      .select('label, tree_id')
      .eq('id', nodeId)
      .single();

    if (nodeError) throw nodeError;

    // 2. Score via AI
    const result = await scoreQuiz(node.label, questions, answers);

    if (result.passed) {
      // 3. Update current node status
      await supabase
        .from('nodes')
        .update({ status: 'mastered' })
        .eq('id', nodeId);

      // 4. Unlock next nodes (Unlock nodes where this node is a source in the edges table)
      const { data: nextEdges } = await supabase
        .from('edges')
        .select('target_id')
        .eq('source_id', nodeId);

      if (nextEdges && nextEdges.length > 0) {
        const nextNodeIds = nextEdges.map((e: any) => e.target_id);
        
        // Update next nodes to 'in-progress' if they are 'locked'
        await supabase
          .from('nodes')
          .update({ status: 'in-progress' })
          .in('id', nextNodeIds)
          .eq('status', 'locked');
      }

      // 5. Track progress
      if (!isGuest && userId) {
        await supabase.from('node_progress').insert({
          user_id: userId,
          node_id: nodeId,
          is_passed: true,
          best_score: result.score,
        });
      }
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Scoring error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
