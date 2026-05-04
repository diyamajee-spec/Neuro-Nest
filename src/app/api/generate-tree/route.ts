import { NextRequest, NextResponse } from 'next/server';
import { parseResume } from '@/lib/pdf-parser';
import { extractSkills, generateLearningTree } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    const dreamGoal = formData.get('dreamGoal') as string;
    const rawUserId = formData.get('userId') as string;
    const isGuest = formData.get('isGuest') === 'true';
    const userId = (isGuest || !rawUserId || rawUserId === 'undefined') ? null : rawUserId;

    if (!file || !dreamGoal) {
      return NextResponse.json({ error: 'Missing resume or dream goal' }, { status: 400 });
    }

    // 1. Parse PDF
    let resumeText = "Experienced Professional";
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      resumeText = await parseResume(buffer);
    } catch (err) {
      console.error("PDF Parsing failed, using placeholder text", err);
    }

    // 2. Extract Skills
    const skills = await extractSkills(resumeText);

    // 3. Generate Learning Tree
    const tree = await generateLearningTree(skills, dreamGoal);

    // 4. Save to Supabase
    const { data: treeData, error: treeError } = await supabase
      .from('learning_trees')
      .insert({
        user_id: userId,
        title: `Path to ${dreamGoal}`,
        description: tree.roadmap_summary || `A roadmap to become a ${dreamGoal}`,
        target_goal: dreamGoal,
        is_guest: isGuest
      })
      .select()
      .single();

    if (treeError) {
      console.error('Supabase tree error:', treeError);
      throw treeError;
    }

    // Insert Nodes
    const nodesToInsert = tree.nodes.map((node: any, index: number) => {
      const isGoal = index === tree.nodes.length - 1 || node.label.toLowerCase().includes(dreamGoal.toLowerCase());
      return {
        id: `${treeData.id}_${node.id}`,
        tree_id: treeData.id,
        label: node.label,
        description: node.description,
        level: node.level || (index + 1),
        status: (node.level === 1 || index === 0) ? 'in-progress' : 'locked',
        metadata: {
          category: node.category || 'core',
          is_goal: isGoal,
          resources: node.resources || [],
          market_insight: node.market_insight || {}
        }
      };
    });

    const { error: nodesError } = await supabase.from('nodes').insert(nodesToInsert);
    if (nodesError) {
      console.error('Supabase nodes error:', nodesError);
      throw nodesError;
    }

    // Insert Edges
    const edgesToInsert = tree.edges.map((edge: any) => ({
      id: `${treeData.id}_${edge.id}`,
      tree_id: treeData.id,
      source_id: `${treeData.id}_${edge.source}`,
      target_id: `${treeData.id}_${edge.target}`,
    }));

    const { error: edgesError } = await supabase.from('edges').insert(edgesToInsert);
    if (edgesError) {
      console.error('Supabase edges error:', edgesError);
      throw edgesError;
    }

    return NextResponse.json({ 
      success: true, 
      treeId: treeData.id,
      summary: tree.roadmap_summary
    });

  } catch (error: any) {
    console.error('Tree generation error:', error);
    
    // Fallback for demo/testing purposes if AI or Database fails
    if (process.env.NODE_ENV === 'development' || !process.env.GEMINI_API_KEY) {
      console.log('Falling back to mock data for testing...');
      return NextResponse.json({ 
        success: true, 
        treeId: 'demo',
        isMock: true,
        message: 'Returning mock data because backend services are unavailable.'
      });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
