import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nodeId = searchParams.get('nodeId');

  if (!nodeId) {
    return NextResponse.json({ error: 'Missing nodeId' }, { status: 400 });
  }

  try {
    // 1. Fetch node details
    const { data: node, error: nodeError } = await supabase
      .from('nodes')
      .select('label, description')
      .eq('id', nodeId)
      .single();

    if (nodeError) throw nodeError;

    // 2. Generate Quiz via AI
    const quiz = await generateQuiz(node.label, node.description);

    // 3. Optional: Cache quiz in node_progress table
    
    return NextResponse.json({ quiz });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
