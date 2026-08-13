# Glove Keyboard — Research & Development Project

This project aims to develop a wearable, ambidextrous hand-input device that transforms natural finger movement, touch, gestures, and hand geometry into keyboard, mouse, and future interaction commands. The initial product concept is a lightweight exoskeleton-style glove with open fingertips, rigid modular finger segments, nail-side sensing, a wrist-mounted electronics module, and a design philosophy centered around long-term comfort and minimal interference with normal hand activity. Version 1 focuses on surface typing and finger-to-finger interaction, while maintaining a path toward richer gesture, sign-like, and spatial input.

The first phase is deliberately a research and measurement platform rather than a finished consumer product. A development-grade MCU platform will collect high-resolution finger, hand, contact, mechanical, and vibration data while a wrist/hand IMU establishes the primary hand reference frame. The fingertips remain completely unobstructed so users can interact naturally with keyboards, touch surfaces, and physical objects. A camera and physical keyboard will initially act as external reference systems, allowing the project to compare what the glove measures against what the hand and computer actually experienced.

The project will use a structured experimental methodology. Raw sensor observations, camera information, and keyboard events will be stored independently from the human-intended output, allowing future algorithms to be evaluated without recollecting the physical experiments. Experiments will begin with small pilot datasets and progressively expand only when the results justify additional collection. This creates a path toward discovering which sensors actually contribute useful information, eliminating redundant hardware, and eventually reconstructing increasingly accurate relative and 3D hand geometry from a minimal and comfortable sensor architecture.

Software will develop in parallel as a modular research workbench and eventually evolve into the consumer configuration environment. The browser will become the primary user interface for configuration, calibration, profiles, diagnostics, and wired firmware updates, inspired by the simplicity of modern web-based keyboard configurators. The research environment will additionally provide live sensor visualization, structured experiment control, synchronized camera/keyboard/glove recording, data replay, and analysis. Normal operation will remain driverless through standard USB/Bluetooth HID, while optional local software and camera integration can provide advanced recognition and sensor fusion without becoming mandatory dependencies.

The long-term vision is a general-purpose wearable human-computer interface, not simply a glove-shaped keyboard. The initial system can evolve from surface typing and finger-to-finger gestures toward context-aware input, personalized gesture recognition, spatial hand interaction, sign-like gesture combinations, camera-assisted recognition, and eventually increasingly capable on-device inference. The hardware roadmap follows development platform → sensor characterization → optimized architecture → custom PCB → refined wearable, while the usability roadmap prioritizes comfort, durability, easy donning/doffing, washability, replaceable components, and equal usability on either hand. The ultimate goal is a device that feels less like wearing a computer and more like gaining a new, natural layer of interaction with computers.

# LLM JSON/XML context
```
{
  "project": {
    "name": "Glove Keyboard",
    "type": "wearable human-computer interface",
    "stage": "initial research/prototyping",
    "status": "concept architecture established; component-level implementation not yet finalized",
    "primary_goal": "Develop an ambidextrous wearable hand-input device that converts finger movement, surface interaction, finger-to-finger interaction, and gestures into keyboard, mouse, and future computer-input commands.",
    "initial_goal": "Build a research-grade prototype capable of collecting rich, synchronized hand/finger data while remaining comfortable, minimally intrusive, and usable for long periods.",
    "long_term_goal": "Evolve from surface typing and finger-to-finger interaction into a general-purpose wearable human-computer interface with personalized gesture recognition, spatial interaction, sign-like gesture combinations, context awareness, optional camera fusion, and increasingly capable on-device inference."
  },

  "development_philosophy": {
    "principles": [
      "Research before optimization",
      "Collect raw data before committing to sensor reduction",
      "Use experiments to determine hardware requirements",
      "Keep fingertips completely unobstructed",
      "Prioritize comfort and long-term wearability",
      "Design for ambidextrous use",
      "Use modular and replaceable components during prototyping",
      "Separate raw observations from human intention",
      "Keep the glove useful without a camera",
      "Keep normal operation driverless",
      "Use browser-first configuration",
      "Avoid premature hardware or protocol lock-in"
    ],
    "development_sequence": [
      "Prototype 0",
      "Sensor characterization",
      "Experimental data collection",
      "Sensor/hardware optimization",
      "Custom PCB",
      "Mechanical refinement",
      "V1 functional product",
      "V2 advanced interaction and sensor fusion"
    ]
  },

  "product_requirements": {
    "wearable_form": "exoskeleton-style wearable",
    "primary_hand_interface": "finger and hand structures rather than full latex glove",
    "wrist_interface": "watch-like band/module",
    "ambidextrous": true,
    "single_hand_initially": true,
    "second_glove": {
      "initial_version": "not required",
      "future_version": "must remain architecturally possible"
    },
    "fingertips": {
      "must_remain_open": true,
      "reason": "allow completely natural human fingertip interaction with keyboards, surfaces and objects",
      "no_sensor_between_fingertip_and_surface": true
    },
    "target_interactions_v1": [
      "surface typing",
      "finger-to-finger interaction",
      "mouse control",
      "simple gestures"
    ],
    "future_interactions": [
      "complex gestures",
      "gesture combinations",
      "sign-like input",
      "context-aware gestures",
      "3D hand interaction",
      "camera-assisted interaction",
      "personalized gesture recognition"
    ],
    "long_term_wear": true,
    "comfort_requirements": [
      "minimal pressure points",
      "minimal skin friction",
      "minimal stickiness",
      "minimal roughness",
      "minimal interference with daily activities",
      "good ventilation",
      "easy donning",
      "easy doffing"
    ]
  },

  "mechanical_architecture": {
    "overall": "lightweight exoskeleton",
    "finger_architecture": "multiple rigid/semi-rigid segments connected by flexible joints",
    "finger_segment_role": "repeatable sensor mounting location",
    "sensor_mounts": "modular and replaceable during research",
    "initial_attachment_experiments": [
      "finger rings/loops",
      "side rails"
    ],
    "finger_structure_experiment": {
      "selected": "rigid segments connected by flexible joints",
      "reason": "repeatable sensor placement and rapid replacement during prototyping"
    },
    "distal_finger_sensor_location": "nail side",
    "nail_sensor_rationale": "nail provides a mechanically stable reference associated with distal phalanx/fingertip movement",
    "important_caveat": "nail motion is a proxy for distal fingertip motion and should be experimentally validated rather than assumed perfectly identical",
    "palm_architecture": "back-of-palm structure carrying flexible PCB and routing",
    "wrist_architecture": "watch-like wrist band/module containing main electronics",
    "finger_to_wrist_connection": "fine flexible wires",
    "palm_wrist_connection": "flexible PCB",
    "main_electronics": "rigid PCB at wrist",
    "mechanical_design_principle": "sensor structure should follow natural finger movement rather than constrain it",
    "ambidextrous_design": "physical architecture should be as symmetrical as practical; left/right interpretation handled in firmware/software"
  },

  "sensing_architecture": {
    "initial_imu_count": 1,
    "imu_location": "wrist/hand",
    "coordinate_reference": "wrist/hand",
    "thumb_is_origin": false,
    "initial_sensors": [
      "single wrist/hand IMU",
      "high-resolution flex/strain sensing",
      "nail/distal finger sensing",
      "mechanical/contact sensing",
      "vibration/impact sensing"
    ],
    "proximity": {
      "included_in_research": true,
      "priority": "secondary/experimental",
      "purpose": "support finger-to-finger and contact inference if geometry/mechanical sensing is insufficient"
    },
    "flex_sensing": {
      "initial_strategy": "maximum practical resolution",
      "goal": "distinguish individual joint behavior rather than treating each finger as one flex value",
      "four_long_fingers": [
        "MCP behavior",
        "PIP behavior",
        "DIP behavior",
        "overall curvature"
      ],
      "thumb": [
        "thumb base/opposition",
        "MCP",
        "IP",
        "thumb-tip relative position"
      ]
    },
    "additional_finger_imus": {
      "initially": false,
      "future": "add only if data shows they provide significant missing information"
    },
    "optical_tracking_on_glove": {
      "initially": false,
      "future": "optional research/fusion technology"
    },
    "magnetic_tracking": {
      "initially": false,
      "future": "consider only if experimentally justified"
    }
  },

  "contact_detection": {
    "surface_contact": {
      "goal": "detect fingertip contact while leaving fingertip completely unobstructed",
      "primary_methods": [
        "mechanical deflection",
        "vibration/impact"
      ],
      "supporting_methods": [
        "finger geometry",
        "wrist/hand IMU",
        "flex/strain sensing",
        "optional proximity"
      ],
      "approach": "sensor fusion/inference rather than relying on a single fingertip pressure sensor"
    },
    "finger_to_finger": {
      "primary_signal": "relative finger geometry derived from wrist/hand reference and finger sensing",
      "secondary_confirmation": "mechanical/contact sensing",
      "optional_support": "proximity",
      "target_examples": [
        "thumb-index contact",
        "thumb-middle contact",
        "thumb-ring contact",
        "thumb-little contact",
        "other finger combinations",
        "approach without contact",
        "contact",
        "hold",
        "contact plus movement"
      ]
    }
  },

  "geometry_model": {
    "reference_frame": "wrist/hand",
    "eventual_goal": "3D relative hand geometry",
    "initial_goal": "collect sufficient data to derive increasingly accurate relative geometry",
    "potential_features": [
      "joint angles",
      "segment orientations",
      "finger curvature",
      "fingertip position relative to hand",
      "fingertip velocity",
      "fingertip acceleration",
      "distance between fingertips",
      "angles between fingers",
      "fingertip orientation relative to palm",
      "contact state"
    ],
    "coordinate_systems": [
      "individual sensor frame",
      "hand/wrist frame",
      "world/reference frame when camera/keyboard are available"
    ],
    "principle": "3D reconstruction is an eventual objective, not a V1 hardware requirement"
  },

  "electronics_architecture": {
    "development_strategy": [
      "development platform",
      "sensor characterization",
      "requirements determination",
      "custom PCB"
    ],
    "hardware_platform_strategy": "choose a development MCU platform reasonably representative of the eventual architecture",
    "hardware_optimization": [
      "USB capability",
      "Bluetooth/wireless capability",
      "ADC capability",
      "GPIO",
      "processing headroom",
      "hardware timestamping",
      "local storage",
      "low-power capability",
      "sensor interfaces"
    ],
    "prototype_0": {
      "purpose": "measurement and research instrument",
      "not_final_product": true,
      "priority": "fast experimentation and reliable data acquisition"
    },
    "physical_signal_path": [
      "finger sensors",
      "fine flexible wires",
      "palm/wrist flexible PCB",
      "main wrist PCB"
    ],
    "flex_pcb_role": [
      "sensor routing",
      "power/ground distribution",
      "analog conditioning where appropriate",
      "sensor interfaces",
      "contact/proximity circuitry where appropriate",
      "haptic connections"
    ],
    "main_pcb_role": [
      "MCU",
      "USB",
      "wireless",
      "battery interface",
      "power management",
      "storage",
      "haptics",
      "status indicators"
    ],
    "battery": {
      "initial_location": "wrist",
      "type": "rechargeable",
      "architecture": "modular/replaceable",
      "future": [
        "different capacity",
        "different weight distribution",
        "alternative battery architecture"
      ]
    },
    "haptics": {
      "initial_experiments": [
        "wrist actuator",
        "back-of-hand actuator"
      ],
      "purpose": [
        "gesture confirmation",
        "profile change",
        "activation/deactivation",
        "calibration feedback",
        "error feedback"
      ],
      "design_goal": "minimum perceptible feedback suitable for long-duration wear"
    },
    "visual_feedback": {
      "technology": "LED/RGB or equivalent",
      "purpose": [
        "power/state",
        "connection",
        "active profile",
        "calibration",
        "firmware update",
        "errors",
        "research/debug state"
      ]
    }
  },

  "connectivity": {
    "usb": {
      "required": true,
      "uses": [
        "high-rate research data",
        "diagnostics",
        "firmware updates",
        "wired HID",
        "configuration"
      ],
      "firmware_update": "wired only"
    },
    "wireless": {
      "required": true,
      "uses": [
        "normal typing",
        "mouse control",
        "normal telemetry where appropriate"
      ]
    },
    "normal_operation": "USB HID and/or Bluetooth HID without mandatory companion application",
    "research_operation": "USB preferred for high-rate raw data"
  },

  "software_architecture": {
    "overall_strategy": "modular software with browser-first interfaces",
    "consumer_interface": "browser-based configurator",
    "research_interface": "browser UI plus local backend/service when required",
    "consumer_model": "browser configuration, no mandatory installed application for normal HID operation",
    "research_model": "browser frontend with local service for camera, keyboard, high-rate data, datasets and analysis",
    "software_development_strategy": "multiple tools/components allowed during research; avoid premature stack lock-in",
    "device_protocol": {
      "formal_specification": "not defined before prototype",
      "approach": "start coding, learn from hardware, document and stabilize protocol as it emerges",
      "internal_architecture_should_remain_modular": true
    }
  },

  "browser_configurator": {
    "design_inspiration": "Keychron-style web-only configuration interface",
    "connection": "USB",
    "workflow": [
      "connect glove via USB",
      "open browser",
      "detect device",
      "configure",
      "calibrate",
      "manage profiles",
      "diagnose",
      "load firmware",
      "disconnect",
      "use glove independently"
    ],
    "target_features": [
      "configuration",
      "calibration",
      "gesture mapping",
      "keyboard mapping",
      "mouse settings",
      "profiles",
      "personalization",
      "diagnostics",
      "firmware update"
    ],
    "web_transport_candidates": [
      "WebUSB",
      "Web Serial"
    ],
    "final_transport": "to be determined during implementation"
  },

  "hid_architecture": {
    "normal_operation": "driverless",
    "interfaces": [
      "standard keyboard HID",
      "standard mouse HID",
      "future consumer controls"
    ],
    "advanced_configuration": "optional browser configuration",
    "advanced_research": "local backend/research tooling",
    "camera_dependency": false
  },

  "profiles": {
    "required": true,
    "selection_model": "combination of manual/physical override and optional automatic context switching",
    "principle": "there must always be a deterministic manual method to know/select/override the active profile",
    "example_profiles": [
      "general",
      "presentation",
      "programming"
    ],
    "automatic_context": "optional future capability",
    "profile_feedback": "visual and haptic"
  },

  "camera_integration": {
    "role": [
      "research ground truth",
      "optional sensor-fusion input"
    ],
    "mandatory_for_glove": false,
    "research_use": true,
    "future_controlled_environment_use": true,
    "conceptual_pipeline": [
      "glove data",
      "camera data",
      "context",
      "sensor fusion/recognition",
      "HID output"
    ]
  },

  "keyboard_integration": {
    "role": "external ground truth during research",
    "target": "physical keyboard",
    "purpose": [
      "compare intended key action with actual keyboard event",
      "synchronize glove observations with physical input",
      "evaluate surface typing recognition"
    ]
  },

  "data_architecture": {
    "core_principle": "separate objective observations from human intention",
    "table_1": {
      "name": "sensor_data",
      "role": "objective observation layer",
      "sources": [
        "glove sensors",
        "keyboard",
        "camera"
      ],
      "raw_data_should_be_preserved": true,
      "example_fields": [
        "timestamp",
        "source",
        "sensor_id",
        "sensor_type",
        "raw_value",
        "calibrated_value",
        "status"
      ]
    },
    "table_2": {
      "name": "human_intended_output",
      "role": "human intention layer",
      "example_fields": [
        "timestamp_or_segment",
        "intended_action",
        "expected_output",
        "actual_result",
        "correct"
      ]
    },
    "derived_layer": {
      "not_part_of_raw_tables": true,
      "purpose": "algorithm/model predictions",
      "examples": [
        "recognized gesture",
        "predicted key",
        "predicted contact",
        "confidence",
        "classification result"
      ]
    },
    "analysis_principle": "raw data remains immutable so multiple algorithms can be evaluated against identical experiments"
  },

  "time_synchronization": {
    "strategy": "hardware timestamps plus periodic synchronization",
    "clock_sources": [
      "glove MCU clock",
      "computer clock",
      "camera clock",
      "keyboard event timing"
    ],
    "sensor_timestamping": "local MCU timestamps",
    "goal": "reconstruct temporal relationships between sensor events, camera observations and keyboard events",
    "research_importance": "high"
  },

  "research_workbench": {
    "goal": "accelerate the design → collect → inspect → replay → analyze → modify → repeat cycle",
    "interface": "browser frontend",
    "local_backend": "allowed/expected for advanced research functions",
    "features": [
      "live sensor dashboard",
      "experiment runner",
      "data recording",
      "camera integration",
      "keyboard integration",
      "synchronized replay",
      "analysis",
      "dataset management",
      "calibration",
      "device diagnostics"
    ],
    "live_dashboard": [
      "flex/strain channels",
      "IMU",
      "mechanical/contact signals",
      "vibration",
      "nail/distal sensors",
      "battery",
      "connection state",
      "sensor health",
      "timestamps"
    ],
    "experiment_runner": {
      "initial_mode": "structured experiments",
      "experiment_definition": "data-driven/configuration-based rather than hard-coded",
      "future_capability": "large experiment library without application code changes"
    },
    "data_replay": {
      "required": true,
      "features": [
        "timeline",
        "camera synchronization",
        "sensor plots",
        "keyboard events",
        "human intention",
        "model prediction"
      ]
    }
  },

  "research_methodology": {
    "initial_mode": "structured experiments only",
    "natural_long_term_use": {
      "initially": false,
      "future": true,
      "purpose": "discover unexpected behavior after sensing architecture is sufficiently validated"
    },
    "repetition_strategy": {
      "type": "progressive",
      "pilot": "approximately 5 trials",
      "standard": "approximately 20-30 trials",
      "extended": "approximately 50-100+ trials",
      "decision_rule": "only expand experiments when previous stage produces promising/useful information"
    },
    "research_goal": "determine which sensor signals contribute useful information and remove unnecessary hardware before custom PCB design"
  },

  "initial_experiment_categories": {
    "finger_geometry": [
      "open hand",
      "close hand",
      "individual finger flexion",
      "individual joint movement",
      "finger combinations",
      "thumb opposition"
    ],
    "finger_surface": [
      "single-finger tap",
      "different tap strengths",
      "press",
      "hold",
      "release",
      "repeated taps",
      "different surfaces",
      "different fingers",
      "sliding"
    ],
    "finger_to_finger": [
      "thumb-index",
      "thumb-middle",
      "thumb-ring",
      "thumb-little",
      "other finger pairs",
      "approach without contact",
      "contact",
      "hold",
      "contact plus movement"
    ],
    "gesture_sequences": [
      "approach",
      "contact",
      "release",
      "move"
    ]
  },

  "hardware_research_questions": {
    "primary": [
      "How accurately can flex/strain sensing reconstruct finger configuration?",
      "How much information is provided by a single wrist/hand IMU?",
      "Can nail-side sensing adequately represent distal finger motion?",
      "Can surface contact be inferred using mechanical deflection and vibration without covering the fingertip?",
      "Can finger-to-finger contact be inferred primarily from relative geometry plus mechanical/contact sensing?",
      "Which sensors are redundant?",
      "Which signals materially improve recognition?",
      "How much sensor resolution is actually required?",
      "How much mechanical structure is required for sensor repeatability?",
      "Which attachment method provides the best comfort/repeatability tradeoff?",
      "What is the actual power requirement?",
      "What sampling rates are actually required?"
    ],
    "future": [
      "Whether additional finger IMUs improve accuracy enough to justify hardware complexity",
      "Whether optical tracking improves performance enough to justify optional integration",
      "Whether magnetic/proximity sensing is necessary for specific interactions",
      "Whether full 3D relative hand reconstruction is achievable with minimal sensing"
    ]
  },

  "usability_workstream": {
    "status": "planned as first-class engineering workstream",
    "areas": [
      "materials",
      "comfort",
      "durability",
      "washability",
      "maintenance",
      "donning",
      "doffing",
      "ventilation",
      "skin contact",
      "pressure points",
      "sensor retention",
      "wire fatigue",
      "connector durability",
      "long-duration wear"
    ],
    "materials_research": [
      "soft skin-contact materials",
      "stretchable materials",
      "semi-rigid finger segments",
      "flexible joints",
      "sensor mounting materials",
      "textile/elastomer options",
      "adhesive versus mechanical attachment"
    ],
    "durability_testing": [
      "repeated flexing",
      "repeated don/doff",
      "cable fatigue",
      "sensor replacement cycles",
      "sweat exposure",
      "impact",
      "long-duration wear"
    ],
    "maintenance_requirements": [
      "cleaning",
      "washability",
      "removable electronics",
      "replaceable finger modules",
      "replaceable battery",
      "replaceable wiring",
      "replaceable sensors"
    ],
    "ambidextrous_testing": "left and right hand must be explicitly tested"
  },

  "software_workstream": {
    "priority": "browser-first interface",
    "phases": [
      "research workbench",
      "device configuration",
      "camera integration",
      "keyboard integration",
      "data pipeline",
      "gesture recognition",
      "sensor fusion",
      "consumer configurator"
    ],
    "architecture_principle": "separate device acquisition, transport, interpretation and UI layers",
    "device_data_flow": [
      "sensors",
      "acquisition",
      "timestamping",
      "internal data model",
      "transport",
      "host software"
    ],
    "consumer_data_flow": [
      "glove",
      "USB/Bluetooth HID",
      "operating system"
    ],
    "configuration_data_flow": [
      "glove",
      "USB",
      "browser",
      "configuration/firmware"
    ],
    "research_data_flow": [
      "glove",
      "USB",
      "browser/local service",
      "camera",
      "keyboard",
      "dataset",
      "analysis"
    ]
  },

  "hardware_workstream": {
    "priority": "parts selection after architecture requirements are measured",
    "development_strategy": "representative MCU development platform first, custom PCB later",
    "parts_selection_categories": [
      "MCU",
      "IMU",
      "flex/strain sensors",
      "ADC/analog front end",
      "mechanical/contact sensors",
      "vibration sensors",
      "proximity sensors if justified",
      "USB",
      "Bluetooth/wireless",
      "storage",
      "battery",
      "power management",
      "haptic actuators",
      "LEDs",
      "connectors",
      "flex PCB",
      "finger sensor modules"
    ],
    "selection_principle": "experimental evidence determines final parts and sensor count"
  },

  "custom_pcb_strategy": {
    "timing": "after sensor characterization",
    "architecture": [
      "finger sensor modules",
      "flexible wires",
      "palm/wrist flex PCB",
      "main wrist PCB"
    ],
    "main_pcb_concentration": "MCU, wireless, USB, power, storage and haptics primarily at wrist",
    "goal": "minimize hand weight and preserve modularity",
    "production_evolution": [
      "prototype wires",
      "flex PCB routing",
      "integrated sensor modules",
      "optimized custom PCB"
    ]
  },

  "firmware": {
    "initial_role": [
      "sensor acquisition",
      "timestamping",
      "calibration",
      "raw data streaming",
      "HID",
      "configuration",
      "diagnostics"
    ],
    "operating_modes": [
      "research mode",
      "standalone mode"
    ],
    "research_mode": "raw and processed data available to computer",
    "standalone_mode": "local recognition and HID",
    "algorithm_strategy": "develop heavy experimentation on host computer first; migrate mature algorithms/models to MCU when justified",
    "firmware_updates": "wired only",
    "recovery": "bootloader/recovery capability required in future architecture"
  },

  "architecture_layers": {
    "sensor_layer": "physical sensing",
    "acquisition_layer": "MCU sensor acquisition",
    "timestamp_layer": "hardware timestamping",
    "calibration_layer": "automatic and user/research calibration",
    "recognition_layer": "gesture/contact/typing interpretation",
    "hid_layer": "keyboard/mouse output",
    "configuration_layer": "browser-accessible device configuration",
    "research_layer": "raw data streaming, experiment control, replay and analysis"
  },

  "calibration": {
    "philosophy": "automatic baseline calibration with optional deeper calibration",
    "levels": {
      "session": [
        "sensor baseline",
        "hand orientation",
        "resting finger position",
        "contact/proximity baseline",
        "sensor health"
      ],
      "user": [
        "open hand",
        "close hand",
        "thumb-to-finger contacts",
        "personal geometry/range"
      ],
      "research": [
        "detailed sensor range",
        "geometry calibration",
        "controlled reference measurements"
      ]
    },
    "target": "minimal user friction during normal use"
  },

  "profile_system": {
    "examples": [
      "general",
      "presentation",
      "programming"
    ],
    "selection": [
      "manual/physical override",
      "optional automatic context selection"
    ],
    "override_requirement": true,
    "feedback": [
      "visual",
      "haptic"
    ]
  },

  "feedback": {
    "visual": {
      "initial": true,
      "purpose": [
        "state",
        "connection",
        "profile",
        "calibration",
        "firmware",
        "error",
        "debug"
      ]
    },
    "haptic": {
      "initial": true,
      "locations_to_test": [
        "wrist",
        "back of hand"
      ],
      "purpose": [
        "gesture confirmation",
        "profile change",
        "activation",
        "calibration",
        "error"
      ],
      "normal_typing": "preferably silent"
    }
  },

  "future_v2": {
    "possible_features": [
      "second glove",
      "additional IMUs",
      "camera fusion",
      "advanced proximity",
      "3D hand reconstruction",
      "personalized models",
      "sign-like gesture combinations",
      "context-aware recognition",
      "advanced on-device ML",
      "richer spatial input"
    ],
    "rule": "V2 features should be justified by V1 research data where possible"
  },

  "explicitly_deferred": {
    "final_sensor_count": true,
    "additional_finger_imus": true,
    "final_proximity_architecture": true,
    "final_mcu": true,
    "custom_pcb": true,
    "production_materials": true,
    "final_battery_capacity": true,
    "final_wireless_protocol": true,
    "formal_device_protocol": true,
    "final_ml_architecture": true,
    "full_3d_reconstruction": true,
    "second_glove": true
  },

  "decision_rules": {
    "sensor_addition": "add only when experiments demonstrate meaningful missing information",
    "sensor_removal": "remove when sufficient data demonstrates negligible contribution",
    "hardware_optimization": "do not optimize before measuring actual requirements",
    "software_optimization": "keep research components modular",
    "camera": "optional enhancement, never mandatory for core glove operation",
    "consumer_operation": "driverless HID",
    "configuration": "browser-first",
    "firmware_update": "wired only",
    "mechanical_design": "prioritize comfort and natural movement over rigid constraint",
    "data": "preserve raw observations independently from interpretation"
  },

  "next_phase": {
    "name": "Prototype 0 engineering",
    "priority_order": [
      "define initial sensor experiments",
      "select representative MCU development platform",
      "select candidate sensors",
      "prototype sensor acquisition",
      "implement timestamping",
      "implement USB data acquisition",
      "build browser research dashboard",
      "integrate camera",
      "integrate physical keyboard events",
      "implement two-table dataset",
      "build experiment runner",
      "perform pilot experiments",
      "analyze sensor contribution",
      "refine sensor architecture",
      "define custom PCB requirements"
    ]
  },

  "project_workstreams": {
    "software": {
      "priority": 1,
      "focus": [
        "browser-first research interface",
        "camera integration",
        "keyboard integration",
        "live dashboard",
        "experiment runner",
        "data capture",
        "synchronized replay",
        "configuration",
        "firmware update"
      ]
    },
    "hardware": {
      "priority": 2,
      "focus": [
        "MCU development platform",
        "sensor parts",
        "analog acquisition",
        "IMU",
        "contact/vibration sensing",
        "power",
        "finger modules",
        "flex PCB architecture"
      ]
    },
    "usability": {
      "priority": 3,
      "focus": [
        "materials",
        "comfort",
        "durability",
        "washability",
        "maintenance",
        "don/doff",
        "long-term wear",
        "ambidextrous fit"
      ]
    }
  },

  "context_for_future_llm": {
    "do_not_repeat_already_answered_questions": [
      "single glove initially",
      "ambidextrous target",
      "surface typing and finger-to-finger are V1 priorities",
      "wrist/hand is the coordinate origin",
      "one IMU initially",
      "fingertips remain open",
      "nail-side distal sensing",
      "rigid modular finger segments",
      "ring and side-rail attachment experiments",
      "watch-like wrist module",
      "finger wires to palm/wrist flex PCB",
      "main electronics at wrist",
      "USB and wireless operation",
      "wired firmware updates",
      "browser-based configuration",
      "driverless HID",
      "camera as ground truth and optional fusion",
      "physical keyboard as ground truth",
      "two-table research data model",
      "structured experiments initially",
      "progressive data collection",
      "C-B-CUSTOM PCB hardware development path",
      "modular software research architecture"
    ],
    "important_uncertainties": [
      "exact sensor technologies",
      "exact number of flex zones",
      "exact MCU",
      "exact ADC/AFE",
      "exact contact/vibration implementation",
      "whether proximity sensors are ultimately required",
      "final mechanical material",
      "final battery",
      "final custom PCB",
      "final recognition algorithm",
      "final device protocol"
    ],
    "preferred_reasoning_style": "experimental, evidence-driven, modular, minimize premature assumptions",
    "primary_question": "What is the minimum hardware and software architecture that can reliably reconstruct useful finger/hand interactions while preserving natural human touch and long-duration comfort?"
  }
}

```
# Master prompt

```
MASTER PROMPT — GLOVE PROJECT / PROTOTYPE 0 RESEARCH WORKBENCH

You are a senior computer-vision engineer, browser application engineer, and human-computer-interaction researcher.

You are helping develop Prototype 0 of a wearable glove-based keyboard/HID device.

IMPORTANT PROJECT CONTEXT

The long-term project is an ambidextrous wearable hand-input device designed around natural finger movement, surface typing, finger-to-finger interaction, and gestures.

The physical glove is NOT connected yet.

For this first software prototype, build a browser-first research application that uses:

1. A webcam for real-time hand/finger tracking.
2. A physical keyboard for keyboard-event capture.
3. A browser-based UI for visualization and experiment control.
4. A structured data recording system that can later accept glove sensor data.

The software must be designed as a research instrument, NOT as a finished gesture-recognition product.

The objective is to collect synchronized, high-quality data that can later be used to design the glove sensor architecture and recognition algorithms.

==================================================
PRIMARY OBJECTIVES
==================================================

Build a browser-based application capable of:

A. CAMERA / HAND TRACKING
--------------------------------

Use a reliable browser-compatible hand-tracking solution.

The system must detect, for each visible hand:

- wrist
- thumb
- index finger
- middle finger
- ring finger
- little finger

Track:

- fingertips
- finger joints
- knuckles
- wrist

Use the standard 21-point hand landmark topology if supported by the selected tracking library.

At minimum capture:

WRIST:
- wrist

THUMB:
- thumb CMC/base
- thumb MCP
- thumb IP
- thumb tip

INDEX:
- index MCP/knuckle
- index PIP
- index DIP
- index tip

MIDDLE:
- middle MCP/knuckle
- middle PIP
- middle DIP
- middle tip

RING:
- ring MCP/knuckle
- ring PIP
- ring DIP
- ring tip

LITTLE:
- little MCP/knuckle
- little PIP
- little DIP
- little tip

The architecture should support one or two hands.

For each landmark capture, where available:

- normalized x
- normalized y
- normalized z
- visibility/confidence
- hand label (left/right)
- timestamp

If the tracking library provides world-coordinate landmarks, capture those too.

DO NOT discard the raw landmark data.

The research system should preserve raw observations and derive additional geometry separately.

==================================================
B. DERIVED HAND GEOMETRY
==================================================

In addition to raw landmarks, calculate useful derived features.

At minimum:

- finger segment lengths
- finger joint angles
- finger flexion estimates
- distance between fingertips
- distance between thumb tip and each fingertip
- distance between selected finger pairs
- wrist-to-fingertip distances
- fingertip velocity
- fingertip acceleration where mathematically reasonable
- relative finger angles
- hand orientation estimates
- palm dimensions/geometry where possible

Use the wrist as the primary hand reference frame.

DO NOT use the thumb as the coordinate origin.

The project philosophy is that hand/finger geometry should eventually be expressed relative to the wrist/hand coordinate system.

Preserve both:

1. camera/image coordinates
2. derived hand-relative coordinates

Do not replace the raw coordinates with derived coordinates.

==================================================
C. KEYBOARD INPUT CAPTURE
==================================================

Capture physical keyboard events from the browser.

Capture at minimum:

- keydown
- keyup
- key
- code
- modifier state
- repeat
- timestamp

Capture:

- Shift
- Ctrl
- Alt
- Meta
- Caps Lock where detectable
- function keys
- arrows
- navigation keys
- letters
- numbers
- punctuation

Do NOT only capture printable characters.

Preserve the distinction between:

- event.key
- event.code

This is important for future keyboard-layout-independent analysis.

The application must clearly communicate that normal browser keyboard capture is limited to events available to the active browser page/window.

Do not attempt to implement OS-level global keyboard hooks.

Provide a dedicated keyboard capture area / active recording state so the user knows when keyboard data is being recorded.

Visually display the latest keyboard event.

Example:

KEYDOWN:
key = "a"
code = "KeyA"
shift = false
ctrl = false
alt = false
meta = false

==================================================
D. SYNCHRONIZATION
==================================================

This is a research application.

Synchronization is extremely important.

Use a high-resolution monotonic browser timestamp where possible, such as performance.now(), rather than relying only on wall-clock time.

Every recorded observation must have a timestamp.

Camera observations:

timestamp
frame index
hand ID
landmark data

Keyboard observations:

timestamp
event type
key
code
modifiers

The system must use one common session timeline.

If possible, also record:

- session start time
- browser time
- recording-relative timestamp
- frame number

Design the timestamp system so that future glove MCU timestamps can later be synchronized with this dataset.

==================================================
E. DATA ARCHITECTURE
==================================================

Use a structured data model.

The project already follows a two-table research philosophy.

TABLE 1:
sensor_data

For this software-only prototype, this table may contain:

- camera observations
- keyboard observations

Later it will also contain:

- glove IMU
- flex sensors
- contact sensors
- vibration sensors
- proximity sensors

Do not create a schema that assumes only camera data.

Example conceptual structure:

sensor_data:

{
  "timestamp": 12345.678,
  "source": "camera",
  "type": "hand_landmark",
  "hand": "right",
  "landmark": "index_tip",
  "x": 0.51,
  "y": 0.43,
  "z": -0.12,
  "confidence": 0.98
}

or:

{
  "timestamp": 12452.112,
  "source": "keyboard",
  "type": "keydown",
  "key": "a",
  "code": "KeyA",
  "shift": false,
  "ctrl": false,
  "alt": false,
  "meta": false,
  "repeat": false
}

TABLE 2:
human_intended_output

This table represents what the human intended.

It must remain separate from sensor observations.

For example:

{
  "timestamp": 12500.000,
  "intended_action": "index_finger_tap",
  "expected_output": "KeyA",
  "notes": ""
}

Do not automatically populate human intention from the computer-vision algorithm.

Human intention is ground truth supplied by the experiment/user.

==================================================
F. SESSION MODEL
==================================================

Implement a concept of a recording session.

Each session should have:

- session ID
- creation timestamp
- application version
- tracking-library version
- camera information where available
- browser information where useful
- screen resolution
- experiment name
- user identifier or anonymous participant ID
- hand being tested
- notes
- start time
- end time

Example:

{
  "session": {
    "id": "session_2026_001",
    "application_version": "0.1.0",
    "experiment": "surface_typing",
    "hand": "right",
    "participant": "P001",
    "start_timestamp": 1000.000
  }
}

Do not store personally identifying information unless explicitly entered by the user.

==================================================
G. EXPERIMENT SYSTEM
==================================================

Create a basic experiment system.

The first version should support:

- free recording
- structured recording

Structured recording example:

Experiment:
"Index Finger Surface Tap"

Instructions:
"Place your hand naturally."
"Tap the surface with the index finger."
"Release."

Number of trials:
5

For every trial capture:

- trial ID
- start timestamp
- end timestamp
- camera data
- keyboard data
- intended action
- expected output
- notes

The system should later support 20–30 and 50–100+ repetitions without changing the data architecture.

==================================================
H. WEB UI
==================================================

Create a clean research dashboard.

The UI should have these major sections:

1. CAMERA VIEW

Show:

- live webcam
- hand skeleton overlay
- landmarks
- fingertips
- knuckles
- wrist
- left/right labels
- tracking confidence

Allow:

- camera selection
- start/stop camera
- mirror preview toggle

2. HAND DATA PANEL

Show live values for:

- wrist position
- fingertip positions
- joint angles
- fingertip distances
- thumb-to-finger distances
- hand orientation

3. KEYBOARD PANEL

Show:

- latest keydown
- latest keyup
- key
- code
- modifiers
- event timestamp

Also provide a visual keyboard if practical.

4. RECORDING PANEL

Buttons:

- Start recording
- Stop recording
- Pause
- New session
- New trial
- Mark event
- Add human intention
- Add note

Show:

- recording duration
- event count
- camera FPS
- detected hands
- keyboard event count
- data size estimate

5. EXPERIMENT PANEL

Allow:

- experiment name
- participant ID
- hand
- trial number
- intended action
- expected output
- notes

6. DATA PANEL

Display:

- number of camera frames
- number of landmarks
- keyboard events
- trials
- recording duration

Provide:

- Export JSON
- Export CSV where useful
- Clear session
- Load previous session if practical

7. TIMELINE

Create a simple synchronized timeline showing:

CAMERA
KEYBOARD
INTENTION
TRIALS

Example:

TIME ────────────────────────────────>

CAMERA    ● ● ● ● ● ● ● ● ● ● ●
KEYBOARD          K       E       Y
INTENTION         TAP
TRIAL             └──────1──────┘

A full replay system is desirable but not mandatory for the first implementation.

==================================================
I. DATA EXPORT
==================================================

The primary export format should be JSON.

Use a single session JSON containing:

- metadata
- experiment
- trials
- sensor_data
- human_intended_output

Example high-level structure:

{
  "schema_version": "0.1",
  "session": {...},
  "experiment": {...},
  "trials": [...],
  "sensor_data": [...],
  "human_intended_output": [...]
}

Keep the schema extensible.

The following future source types must be possible without redesigning the schema:

- camera
- keyboard
- imu
- flex
- strain
- contact
- vibration
- proximity
- future_sensor

==================================================
J. PRIVACY
==================================================

Camera data is sensitive.

For Prototype 0:

- process the camera locally in the browser
- do not upload video anywhere
- do not use cloud processing
- do not store video by default
- only store landmark/derived tracking data unless the user explicitly enables video recording
- clearly indicate when the camera is active
- clearly indicate when recording is active

The default research dataset should contain numerical tracking data, not video.

==================================================
K. TECHNICAL APPROACH
==================================================

Prefer a simple browser-first architecture.

For the first prototype, favor:

- HTML
- CSS
- JavaScript/TypeScript

Use a modern browser-compatible hand-tracking library.

A MediaPipe-compatible hand landmark solution is a strong candidate, but evaluate the currently maintained browser-compatible option and use a stable version.

Do not introduce unnecessary frameworks.

If using a build system, use a simple modern setup such as Vite.

The application should run locally.

Initial deployment should ideally be:

npm install
npm run dev

Then open the local browser interface.

Camera access normally requires localhost or HTTPS.

Do not require a backend for the first camera/keyboard prototype unless technically necessary.

Use browser APIs wherever practical.

==================================================
L. CODE QUALITY
==================================================

Write production-quality prototype code.

Requirements:

- modular architecture
- clear folder structure
- TypeScript preferred
- strong typing for data structures
- comments explaining non-obvious decisions
- no giant monolithic file
- no hard-coded experiment logic
- version the data schema
- version the application
- graceful error handling
- camera permission handling
- camera disconnection handling
- keyboard capture state handling
- tracking failure handling
- no silent data loss
- visible recording state

Create separate modules for:

- camera
- hand tracking
- geometry
- keyboard
- recording
- session management
- experiment management
- data schema
- export
- UI

==================================================
M. FUTURE GLOVE COMPATIBILITY
==================================================

This is extremely important.

The software is being built before the physical glove.

Therefore design the architecture so that later the glove can provide:

- IMU samples
- flex samples
- strain samples
- contact events
- vibration events
- proximity measurements

without replacing the research UI.

The future architecture should be:

CAMERA
   \
    \
KEYBOARD ---> COMMON TIMELINE ---> DATASET
    /
   /
GLOVE

The browser application should eventually be able to display:

CAMERA
+ GLOVE SENSORS
+ KEYBOARD
+ HUMAN INTENTION

on one synchronized timeline.

==================================================
N. DO NOT BUILD YET
==================================================

Do NOT implement:

- machine-learning gesture recognition
- automatic keyboard prediction
- final gesture classification
- sign-language recognition
- wireless glove communication
- final HID firmware
- custom PCB integration
- cloud backend
- user accounts
- cloud data storage
- complex authentication
- production UI
- automatic profile switching

Those belong to later stages.

For now:

MEASURE FIRST.

==================================================
O. DEVELOPMENT PRIORITY
==================================================

Implement in this order:

PHASE 1
Basic web application shell.

PHASE 2
Webcam acquisition.

PHASE 3
Hand tracking.

PHASE 4
Display the 21 landmarks.

PHASE 5
Display fingertips, joints, knuckles and wrist clearly.

PHASE 6
Calculate hand-relative geometry.

PHASE 7
Keyboard capture.

PHASE 8
Unified timestamp system.

PHASE 9
Recording/session system.

PHASE 10
Two-table dataset architecture.

PHASE 11
JSON export.

PHASE 12
Experiment runner.

PHASE 13
Timeline visualization.

PHASE 14
Replay.

Do not skip directly to sophisticated recognition.

==================================================
P. ACCEPTANCE TESTS
==================================================

The finished Prototype 0 should pass these tests:

1. User opens the application locally.

2. Browser requests camera permission.

3. Webcam appears.

4. One hand is placed in front of the camera.

5. Application identifies the hand.

6. Wrist is visible.

7. All four long fingers are tracked.

8. Thumb is tracked.

9. Fingertips are clearly displayed.

10. MCP/knuckle points are displayed.

11. PIP and DIP joints are displayed.

12. Landmark coordinates are updated in real time.

13. Left/right hand identification works.

14. Keyboard events are captured.

15. Key and code are both preserved.

16. Camera and keyboard events share a common timestamp system.

17. Recording can be started and stopped.

18. A session can be created.

19. A trial can be created.

20. Human intention can be entered independently from sensor observations.

21. Data can be exported as structured JSON.

22. Exported JSON contains:
    - metadata
    - sensor_data
    - human_intended_output
    - trials

23. Camera video is not uploaded or stored by default.

24. The application continues functioning when hand tracking temporarily fails.

25. The architecture makes it possible to add glove sensor data later.

==================================================
Q. DELIVERABLES
==================================================

Do not only provide code.

Provide:

1. Recommended technology stack and justification.

2. Complete project folder structure.

3. Complete source code for Prototype 0.

4. package.json.

5. TypeScript configuration if applicable.

6. Vite configuration if applicable.

7. README.md containing:
   - requirements
   - installation
   - running instructions
   - camera permissions
   - browser compatibility
   - keyboard limitations
   - data format
   - troubleshooting

8. JSON schema/documentation for the dataset.

9. Example exported JSON dataset.

10. Explanation of how camera timestamps and keyboard timestamps are synchronized.

11. Explanation of how future glove sensor data will plug into the architecture.

12. A list of known limitations.

13. A list of recommended next experiments.

==================================================
R. IMPORTANT IMPLEMENTATION RULE
==================================================

Do not pretend the system provides measurements that the browser/library cannot actually provide.

If a value is estimated rather than directly measured, explicitly label it as estimated.

For example:

"world_z" is not automatically equivalent to true physical depth.

Similarly:

- landmark z is not necessarily metric depth
- joint angles are derived estimates
- fingertip velocity is calculated from successive observations
- hand orientation is derived from landmarks unless an actual IMU is available

Preserve this distinction in the dataset.

==================================================
FINAL OUTPUT FORMAT
==================================================

Before writing the code:

1. Briefly explain the architecture.
2. State the selected hand-tracking technology and exact version.
3. Explain why it is appropriate.
4. State browser compatibility.
5. State any important limitations.
6. Show the project tree.

Then provide the complete implementation.

Do not give pseudocode where working code is expected.

Make the result runnable by a developer who has cloned the project and followed the README.

Keep the first version intentionally simple and reliable.

The priority is:

RELIABLE DATA COLLECTION
>
CLEAR VISUALIZATION
>
CORRECT TIMESTAMPING
>
EXTENSIBLE DATA FORMAT
>
ADVANCED RECOGNITION

```
