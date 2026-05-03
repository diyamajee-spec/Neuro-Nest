import { NextRequest, NextResponse } from 'next/server';
import { parseResume } from '@/lib/pdf-parser';
import { extractSkills, generateLearningTree } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    const dreamGoal = formData.get('dreamGoal') as string;
    const userId = formData.get('userId') as string;
    const isGuest = formData.get('isGuest') === 'true';

    if (!file || !dreamGoal) {
      return NextResponse.json({ error: 'Missing resume or dream goal' }, { status: 400 });
    }

    // 1. Parse PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await parseResume(buffer);

    // 2. Extract Skills
    const skills = await extractSkills(resumeText);

    // 3. Generate Learning Tree
    const tree = await generateLearningTree(skills, dreamGoal);

    // 4. Save to Supabase
    // Note: In a real app, we'd handle transactions and existing trees
    const { data: treeData, error: treeError } = await supabase
      .from('learning_trees')
      .insert({
        user_id: isGuest ? null : userId,
        title: `Path to ${dreamGoal}`,
        target_goal: dreamGoal,
        is_guest: isGuest
      })
      .select()
      .single();

    if (treeError) throw treeError;

    // Insert Nodes
    const nodesToInsert = tree.nodes.map((node: any) => ({
      id: `${treeData.id}_${node.id}`,
      tree_id: treeData.id,
      label: node.label,
      description: node.description,
      level: node.level,
      status: node.level === 1 ? 'in-progress' : 'locked', // Unlock first level by default
    }));

    const { error: nodesError } = await supabase.from('nodes').insert(nodesToInsert);
    if (nodesError) throw nodesError;

    // Insert Edges
    const edgesToInsert = tree.edges.map((edge: any) => ({
      id: `${treeData.id}_${edge.id}`,
      tree_id: treeData.id,
      source_id: `${treeData.id}_${edge.source}`,
      target_id: `${treeData.id}_${edge.target}`,
    }));

    const { error: edgesError } = await supabase.from('edges').insert(edgesToInsert);
    if (edgesError) throw edgesError;

    return NextResponse.json({ 
      success: true, 
      treeId: treeData.id,
      nodes: nodesToInsert,
      edges: edgesToInsert
    });

  } catch (error: any) {
    console.error('Tree generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
