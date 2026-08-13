export interface ExperimentPreset {
  id: string;
  name: string;
  category: 'surface_typing' | 'finger_to_finger' | 'finger_geometry' | 'custom';
  description: string;
  defaultRepetitions: number;
  steps: {
    stepNumber: number;
    intendedAction: string;
    expectedOutput?: string;
    instructions: string;
    durationMs?: number;
  }[];
}

export const EXPERIMENT_PRESETS: ExperimentPreset[] = [
  {
    id: 'exp_index_tap',
    name: 'Index Finger Surface Tap',
    category: 'surface_typing',
    description: 'Collect high-resolution tap profiles for index finger surface contact vs flight phase.',
    defaultRepetitions: 5,
    steps: [
      {
        stepNumber: 1,
        intendedAction: 'index_finger_tap',
        expectedOutput: 'KeyA',
        instructions: 'Place hand naturally on surface. Tap with index finger, then release.',
      }
    ]
  },
  {
    id: 'exp_finger_taps_all',
    name: 'Sequential 4-Finger Taps',
    category: 'surface_typing',
    description: 'Sequential surface taps starting from index to little finger.',
    defaultRepetitions: 5,
    steps: [
      { stepNumber: 1, intendedAction: 'index_finger_tap', expectedOutput: 'KeyA', instructions: 'Tap surface with Index finger.' },
      { stepNumber: 2, intendedAction: 'middle_finger_tap', expectedOutput: 'KeyS', instructions: 'Tap surface with Middle finger.' },
      { stepNumber: 3, intendedAction: 'ring_finger_tap', expectedOutput: 'KeyD', instructions: 'Tap surface with Ring finger.' },
      { stepNumber: 4, intendedAction: 'little_finger_tap', expectedOutput: 'KeyF', instructions: 'Tap surface with Little finger.' },
    ]
  },
  {
    id: 'exp_thumb_pinches',
    name: 'Thumb-to-Finger Pinch Series',
    category: 'finger_to_finger',
    description: 'Finger-to-finger contact interactions between thumb tip and each finger tip.',
    defaultRepetitions: 5,
    steps: [
      { stepNumber: 1, intendedAction: 'thumb_index_pinch', instructions: 'Pinch Thumb tip to Index tip, then release.' },
      { stepNumber: 2, intendedAction: 'thumb_middle_pinch', instructions: 'Pinch Thumb tip to Middle tip, then release.' },
      { stepNumber: 3, intendedAction: 'thumb_ring_pinch', instructions: 'Pinch Thumb tip to Ring tip, then release.' },
      { stepNumber: 4, intendedAction: 'thumb_little_pinch', instructions: 'Pinch Thumb tip to Little tip, then release.' },
    ]
  },
  {
    id: 'exp_hand_flexion',
    name: 'Open & Close Hand Flexion',
    category: 'finger_geometry',
    description: 'Full extension followed by full flexion of all fingers.',
    defaultRepetitions: 5,
    steps: [
      { stepNumber: 1, intendedAction: 'open_hand_extend', instructions: 'Extend hand fully open.' },
      { stepNumber: 2, intendedAction: 'closed_fist_flex', instructions: 'Flex hand into a fist.' },
    ]
  }
];
